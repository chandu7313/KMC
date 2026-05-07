import express from 'express';
import { authenticate, validate } from '@kissan/shared';
import * as authController from '../controllers/auth.controller.js';
import {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  sendVerifyOtpSchema,
  verifyEmailSchema,
  sendResetOtpSchema,
  resetPasswordSchema,
  autoLoginSchema,
} from '../validators/auth.validator.js';

const router = express.Router();

// ── Email/Password Routes ──
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

// ── Mobile OTP Routes ──
router.post('/send-otp', validate(sendOtpSchema), authController.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);

// ── Email Verification (requires auth) ──
router.post('/send-verify-otp', authenticate, validate(sendVerifyOtpSchema), authController.sendVerifyOtp);
router.post('/verify-account', authenticate, validate(verifyEmailSchema), authController.verifyEmail);

// ── Auth Check ──
router.get('/is-auth', authenticate, authController.isAuthenticated);

// ── Password Reset ──
router.post('/send-reset-otp', validate(sendResetOtpSchema), authController.sendResetOtp);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// ── Dev Auto-Login ──
router.post('/auto-login', validate(autoLoginSchema), authController.autoLogin);

export default router;
