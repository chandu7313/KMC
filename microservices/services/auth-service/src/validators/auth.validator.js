import Joi from 'joi';

/**
 * Validation schemas for all auth endpoints.
 */

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({ 'string.min': 'Name must be at least 2 characters' }),
  email: Joi.string().email().required()
    .messages({ 'string.email': 'Please provide a valid email address' }),
  password: Joi.string().min(6).max(128).required()
    .messages({ 'string.min': 'Password must be at least 6 characters' }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const sendOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({ 'string.pattern.base': 'Please provide a valid 10-digit Indian phone number' }),
});

export const verifyOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  otp: Joi.string().length(6).required()
    .messages({ 'string.length': 'OTP must be exactly 6 digits' }),
  name: Joi.string().min(2).max(100).optional(),
});

export const sendVerifyOtpSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});

export const verifyEmailSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  otp: Joi.string().length(6).required(),
});

export const sendResetOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).max(128).required(),
});

export const autoLoginSchema = Joi.object({
  role: Joi.string().valid(
    'super_admin', 'admin', 'tech_admin', 'agri_expert',
    'ecommerce_manager', 'order_manager', 'support_agent',
    'support_manager', 'content_manager', 'finance_manager',
    'field_agent', 'farmer', 'field-officer', 'user'
  ).required(),
});
