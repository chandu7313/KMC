import { successResponse, createLogger } from '@kissan/shared';
import authService from '../services/auth.service.js';
import tokenService from '../services/token.service.js';

const logger = createLogger('auth-service');

/**
 * Auth Controller — thin layer that delegates to services.
 * Only handles HTTP request/response. Zero business logic here.
 */

// ── Email/Password ──

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    const { accessToken } = tokenService.generateTokens(user);
    tokenService.setTokenCookie(res, accessToken);
    await tokenService.storeSession(user.id, accessToken);

    return successResponse(res, { userId: user.id }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);
    const { accessToken } = tokenService.generateTokens(user);
    tokenService.setTokenCookie(res, accessToken);
    await tokenService.storeSession(user.id, accessToken);

    return successResponse(res, null, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user?.id) {
      await tokenService.invalidateSession(req.user.id);
    }
    tokenService.clearTokenCookie(res);
    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// ── Mobile OTP ──

export const sendOtp = async (req, res, next) => {
  try {
    const result = await authService.sendOtp(req.body.phone);
    return successResponse(res, result, 'OTP sent successfully');
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const user = await authService.verifyOtp(req.body);
    const { accessToken } = tokenService.generateTokens(user);
    tokenService.setTokenCookie(res, accessToken);
    await tokenService.storeSession(user.id, accessToken);

    return successResponse(res, null, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// ── Email Verification ──

export const sendVerifyOtp = async (req, res, next) => {
  try {
    const result = await authService.sendVerifyOtp(req.body.userId);
    return successResponse(res, null, 'Verification OTP sent to your email');
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.body);
    return successResponse(res, null, 'Email verified successfully');
  } catch (error) {
    next(error);
  }
};

// ── Password Reset ──

export const sendResetOtp = async (req, res, next) => {
  try {
    await authService.sendResetOtp(req.body.email);
    return successResponse(res, null, 'OTP sent to your email');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    return successResponse(res, null, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};

// ── Auth Check ──

export const isAuthenticated = async (req, res, next) => {
  try {
    return successResponse(res, { userId: req.user.id, role: req.user.role }, 'Authenticated');
  } catch (error) {
    next(error);
  }
};

// ── Auto-Login (Dev Mode Only) ──

export const autoLogin = async (req, res, next) => {
  try {
    const user = await authService.autoLogin(req.body.role);
    const { accessToken } = tokenService.generateTokens(user);
    tokenService.setTokenCookie(res, accessToken);
    await tokenService.storeSession(user.id, accessToken);

    return successResponse(res, { user, role: req.body.role }, 'Auto login successful');
  } catch (error) {
    next(error);
  }
};
