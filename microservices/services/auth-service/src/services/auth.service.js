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
    });

    logger.info(`User registered: ${user.id}`, { email });

    // Publish event
    await publishEvent(EXCHANGES.AUTH, AUTH_EVENTS.USER_REGISTERED, {
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return user;
  }

  // ── Email/Password Login ──

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

  async autoLogin(role) {
    const adminRoles = [
      'super_admin', 'admin', 'tech_admin', 'agri_expert',
      'ecommerce_manager', 'order_manager', 'support_agent',
      'support_manager', 'content_manager', 'finance_manager', 'field_agent',
    ];

    let user;

    if (adminRoles.includes(role)) {
      const email = `${role}_test@agridust.com`;
      try {
        user = await userRepository.findAdminByEmail(email);

        if (!user) {
          user = await userRepository.createAdmin({
            name: `${role.replace(/_/g, ' ').toUpperCase()} TEST`,
            email,
            password: 'hashed_password_here',
            role,
            status: 'online',
          });
        }
      } catch (err) {
        user = {
          id: `mock-${role}-123`,
          name: `${role.replace(/_/g, ' ').toUpperCase()} TEST`,
          email,
          role,
          status: 'online',
          isAccountVerified: true,
        };
      }
    } else if (role === 'farmer' || role === 'user') {
      try {
        user = await userRepository.findByEmail('amit@example.com');
        if (!user) {
          user = await userRepository.create({
            name: 'Amit Kumar',
            email: 'amit@example.com',
            phone: '8888888888',
            role: 'user',
            district: 'Pune',
            crops: ['Wheat'],
            isAccountVerified: true,
          });
        }
      } catch (err) {
        user = {
          id: `mock-user-123`,
          name: 'Amit Kumar (Mock)',
          email: 'amit@example.com',
          phone: '8888888888',
          role: 'user',
          district: 'Pune',
          crops: ['Wheat'],
          isAccountVerified: true,
        };
      }
    } else if (role === 'field-officer') {
      try {
        user = await userRepository.findByEmail('john.fo@agridust.com');
        if (!user) {
          user = await userRepository.create({
            name: 'John Officer',
            email: 'john.fo@agridust.com',
            phone: '7777777777',
            role: 'field-officer',
            isAccountVerified: true,
          });
        }
      } catch (err) {
        user = {
          id: `mock-fo-123`,
          name: 'John Officer (Mock)',
          email: 'john.fo@agridust.com',
          phone: '7777777777',
          role: 'field-officer',
          isAccountVerified: true,
        };
      }
    }

    if (!user) {
      throw HttpError.notFound('User not found for auto-login');
    }

    return user;
  }
}

export default new AuthService();
