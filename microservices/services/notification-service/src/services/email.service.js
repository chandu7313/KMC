import nodemailer from 'nodemailer';
import { createLogger } from '@kissan/shared';
import env from '../config/env.js';
import * as templates from './template.service.js';

const logger = createLogger('notification-service');

let transporter = null;

/**
 * Get or create the nodemailer transporter.
 */
const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  return transporter;
};

/**
 * Send an email.
 * @param {object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text fallback
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mail = getTransporter();
    const result = await mail.sendMail({
      from: `"${env.senderName}" <${env.senderEmail}>`,
      to,
      subject,
      html,
      ...(text && { text }),
    });

    logger.info(`Email sent to ${to}`, { subject, messageId: result.messageId });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error(`Email failed to ${to}`, { subject, error: error.message });
    return { success: false, error: error.message };
  }
};

// ── Pre-built Email Methods ──

/**
 * Send email verification OTP with HTML branded template.
 * @param {string} email - Recipient email
 * @param {string|number} otp - 6-digit OTP code
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendEmailVerificationOtp = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: 'Verify your email — Kissan Mithar Consultancy',
    html: templates.getEmailVerifyTemplate(email, otp),
  });
};

/**
 * Send password reset OTP email.
 * @param {string} email - Recipient email
 * @param {string|number} otp - 6-digit OTP code
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendPasswordResetOtp = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset OTP — Kissan Mithar Consultancy',
    html: templates.getPasswordResetTemplate(email, otp),
  });
};

/**
 * Send password changed confirmation alert.
 * @param {string} email - Recipient email
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendPasswordChangedNotification = async (email) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset Successful — Kissan Mithar Consultancy',
    text: 'Your password has been reset successfully as you requested.',
  });
};

/**
 * Send order confirmation invoice email.
 * @param {object} params
 * @param {string} params.email - Recipient email
 * @param {string} params.name - Customer name
 * @param {string} params.orderId - Order UUID
 * @param {string} params.address - Shipping address
 * @param {number} params.amount - Total amount
 * @param {string} params.paymentMethod - Payment mode
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendOrderConfirmation = async ({ email, name, orderId, address, amount, paymentMethod }) => {
  return sendEmail({
    to: email,
    subject: `Order Confirmed #${orderId} — Kissan Mithar Consultancy`,
    html: templates.getOrderConfirmationTemplate({ name, orderId, address, amount, paymentMethod }),
  });
};

/**
 * Send expert consultation booking confirmation email.
 * @param {object} params
 * @param {string} params.email - Recipient email
 * @param {string} params.name - Customer name
 * @param {object} params.bookingDetails - Booking schedule and expert metadata
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendBookingConfirmation = async ({ email, name, bookingDetails }) => {
  return sendEmail({
    to: email,
    subject: 'Consultation Booking Confirmed — Kissan Mithar Consultancy',
    html: templates.getBookingConfirmationTemplate({ name, ...bookingDetails }),
  });
};

/**
 * Send critical admin system alert email.
 * @param {string} subject - Alert subject
 * @param {string} message - Alert body
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendAdminAlert = async (subject, message) => {
  return sendEmail({
    to: env.adminEmail,
    subject: `[ADMIN ALERT] ${subject}`,
    text: message,
  });
};

export {
  sendEmail,
  sendEmailVerificationOtp,
  sendPasswordResetOtp,
  sendPasswordChangedNotification,
  sendOrderConfirmation,
  sendBookingConfirmation,
  sendAdminAlert,
};
