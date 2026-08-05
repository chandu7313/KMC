import bcrypt from 'bcryptjs';
import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, AUTH_EVENTS, EXCHANGES } from '@kissan/events';
import env from '../config/env.js';
import userRepository from '../repositories/user.repository.js';
import otpService from './otp.service.js';
import tokenService from './token.service.js';

const logger = createLogger('auth-service');

/**
 * Core authentication business logic.
 * Extracted from monolith authController.js — now testable and decoupled.
 */
class AuthService {
  // ── Email/Password Registration ──

  /**
   * Register a new user with email and password, hashing the password and publishing an event.
   * @param {object} params
   * @param {string} params.name - Full name of the user
   * @param {string} params.email - Unique email address
   * @param {string} params.password - Plaintext password to hash
   * @returns {Promise<object>} Created user record
   * @throws {HttpError} If email already exists
   */
  async register({ name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw HttpError.conflict('A user with this email already exists', 'EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, env.bcryptRounds);
    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      isAccountVerified: false,
    });

    logger.info(`User registered: ${user.id}`, { email });

    // Publish event
    await publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.USER_REGISTERED, {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return user;
  }

  // ── Email/Password Login ──

  /**
   * Authenticate user with email and password.
   * @param {object} params
   * @param {string} params.email - User email
   * @param {string} params.password - Plaintext password
   * @returns {Promise<object>} Authenticated user record
   * @throws {HttpError} If credentials do not match
   */
  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw HttpError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw HttpError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    logger.info(`User logged in: ${user.id}`, { email });

    await publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.USER_LOGGED_IN, {
      userId: user.id,
      method: 'email',
    });

    return user;
  }

  // ── Mobile OTP: Send ──

  /**
   * Send a 6-digit one-time password via SMS to a phone number.
   * @param {string} phone - 10-digit mobile number
   * @returns {Promise<{isNewUser: boolean}>} Result indicating whether user account was newly created
   * @throws {HttpError} If SMS gateway delivery fails
   */
  async sendOtp(phone) {
    const otp = otpService.generateOtp();
    const otpExpireAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    let isNewUser = false;
    const existingUser = await userRepository.findByPhone(phone);

    if (existingUser) {
      await userRepository.update(existingUser.id, { otp, otpExpireAt });
    } else {
      isNewUser = true;
      await userRepository.create({
        name: 'KMC Farmer',
        phone,
        email: `temp_${phone}@agridust.com`,
        otp,
        otpExpireAt,
      });
    }

    logger.info(`OTP generated for ${phone}`, { isNewUser });

    const smsResult = await otpService.sendSmsOtp(phone, otp);

    await publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.OTP_SENT, {
      phone,
      isNewUser,
      delivered: smsResult.success,
    });

    if (!smsResult.success) {
      throw HttpError.internal('Failed to send OTP. Please try again.', 'OTP_SEND_FAILED');
    }

    return { isNewUser };
  }

  // ── Mobile OTP: Verify ──

  /**
   * Verify mobile OTP, update user profile name if provided, and mark account verified.
   * @param {object} params
   * @param {string} params.phone - 10-digit phone number
   * @param {string} params.otp - 6-digit OTP string
   * @param {string} [params.name] - Optional display name
   * @returns {Promise<object>} Verified user record
   * @throws {HttpError} If user not found or OTP is invalid/expired
   */
  async verifyOtp({ phone, otp, name }) {
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw HttpError.notFound('User not found. Please request a new OTP.', 'USER_NOT_FOUND');
    }

    const validation = otpService.validateOtp(user.otp, otp, user.otpExpireAt);
    if (!validation.valid) {
      throw HttpError.unauthorized(validation.message, 'OTP_INVALID');
    }

    const updateData = {
      isAccountVerified: true,
      otp: '',
      otpExpireAt: 0,
    };

    if (name && name !== 'User' && name !== 'KMC Farmer') {
      updateData.name = name;
    }

    await userRepository.update(user.id, updateData);

    logger.info(`OTP verified for ${phone}`, { userId: user.id });

    await publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.OTP_VERIFIED, {
      userId: user.id,
      phone,
    });

    return { ...user, ...updateData };
  }

  // ── Email Verification: Send OTP ──

  /**
   * Generate and dispatch email verification OTP via RabbitMQ event.
   * @param {string} userId - User identifier
   * @returns {Promise<{email: string}>} User's email
   * @throws {HttpError} If user not found or already verified
   */
  async sendVerifyOtp(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw HttpError.notFound('User not found');
    if (user.isAccountVerified) {
      throw HttpError.badRequest('Account is already verified', 'ALREADY_VERIFIED');
    }

    const otp = otpService.generateOtp();
    await userRepository.update(userId, {
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Publish event for notification service to send email
    await publishEvent(EXCHANGES.NOTIFICATIONS, 'notification.email_verify', {
      userId,
      email: user.email,
      otp,
    });

    return { email: user.email };
  }

  // ── Email Verification: Verify ──

  /**
   * Validate email verification OTP and mark account as verified.
   * @param {object} params
   * @param {string} params.userId - User identifier
   * @param {string} params.otp - 6-digit verification OTP
   * @returns {Promise<object>} Updated user record
   * @throws {HttpError} If user not found or OTP is invalid
   */
  async verifyEmail({ userId, otp }) {
    const user = await userRepository.findById(userId);
    if (!user) throw HttpError.notFound('User not found');

    const validation = otpService.validateOtp(user.verifyOtp, otp, user.verifyOtpExpireAt);
    if (!validation.valid) {
      throw HttpError.unauthorized(validation.message, 'OTP_INVALID');
    }

    await userRepository.update(userId, {
      isAccountVerified: true,
      verifyOtp: '',
      verifyOtpExpireAt: 0,
    });

    return user;
  }

  // ── Password Reset: Send OTP ──

  /**
   * Send password reset OTP to user email and broadcast event.
   * @param {string} email - Registered user email
   * @returns {Promise<{email: string}>} User's email
   * @throws {HttpError} If user account does not exist
   */
  async sendResetOtp(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw HttpError.notFound('No account found with this email', 'USER_NOT_FOUND');
    }

    const otp = otpService.generateOtp();
    await userRepository.update(user.id, {
      resetOtp: otp,
      resetOtpExpireAt: Date.now() + 15 * 60 * 1000,
    });

    await publishEvent(EXCHANGES.NOTIFICATIONS, 'notification.password_reset', {
      userId: user.id,
      email: user.email,
      otp,
    });

    await publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.PASSWORD_RESET, {
      userId: user.id,
      email: user.email,
    });

    return { email: user.email };
  }

  // ── Password Reset: Verify & Change ──

  /**
   * Validate password reset OTP and hash new password.
   * @param {object} params
   * @param {string} params.email - User email
   * @param {string} params.otp - Reset OTP
   * @param {string} params.newPassword - New plaintext password
   * @returns {Promise<object>} Updated user record
   * @throws {HttpError} If user not found or OTP invalid
   */
  async resetPassword({ email, otp, newPassword }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw HttpError.notFound('User not found');

    const validation = otpService.validateOtp(user.resetOtp, otp, user.resetOtpExpireAt);
    if (!validation.valid) {
      throw HttpError.unauthorized(validation.message, 'OTP_INVALID');
    }

    const hashedPassword = await bcrypt.hash(newPassword, env.bcryptRounds);
    await userRepository.update(user.id, {
      password: hashedPassword,
      resetOtp: '',
      resetOtpExpireAt: 0,
    });

    // Publish notification
    await publishEvent(EXCHANGES.NOTIFICATIONS, 'notification.password_changed', {
      userId: user.id,
      email: user.email,
    });

    return user;
  }

  // ── Auto-Login (Dev mode) ──

  /**
   * Development shortcut to authenticate as any system role.
   * @param {string} role - Target role (e.g. 'farmer', 'super_admin', 'agri_expert', etc.)
   * @returns {Promise<object>} Dev user object
   * @throws {HttpError} If role unknown or dev account not found
   */
  async autoLogin(role) {
    // All admin roles that live in admin_users table
    const adminRoles = [
      'super_admin', 'admin', 'tech_admin', 'agri_expert',
      'ecommerce_manager', 'order_manager', 'support_agent',
      'support_manager', 'content_manager', 'finance_manager',
      'field_agent', 'field_officer',
    ];

    let user;

    if (role === 'farmer' || role === 'user') {
      // Farmer login — look up in users table by phone
      user = await userRepository.findByPhone('9876543210');

      if (!user) {
        // Create a dev farmer if missing
        user = await userRepository.create({
          name: 'Test Farmer',
          email: 'farmer@dev.kissanmithar.com',
          phone: '9876543210',
          role: 'user',
          district: 'Nizamabad',
          crops: ['Wheat', 'Cotton'],
          isAccountVerified: true,
        });
      }

      // Normalize role for frontend
      user = { ...user, role: 'farmer', userType: 'farmer' };

    } else if (adminRoles.includes(role)) {
      // Admin roles — look up in admin_users table by role
      user = await userRepository.findAdminByRole(role);

      if (!user) {
        throw HttpError.notFound(
          `Dev account for role "${role}" not found. Run: node scripts/seedDevAccounts.js`
        );
      }

      user = { ...user, userType: 'admin' };

    } else {
      throw HttpError.badRequest(`Unknown role: "${role}"`);
    }

    if (!user) {
      throw HttpError.notFound('User not found for auto-login');
    }

    logger.info(`Auto-login successful for role: ${role}`, { userId: user.id });
    return user;
  }
}

export default new AuthService();
