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

const sendEmailVerificationOtp = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: 'Verify your email — Kissan Mithar Consultancy',
    html: templates.getEmailVerifyTemplate(email, otp),
  });
};

const sendPasswordResetOtp = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset OTP — Kissan Mithar Consultancy',
    html: templates.getPasswordResetTemplate(email, otp),
  });
};

const sendPasswordChangedNotification = async (email) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset Successful — Kissan Mithar Consultancy',
    text: 'Your password has been reset successfully as you requested.',
  });
};

const sendOrderConfirmation = async ({ email, name, orderId, address, amount, paymentMethod }) => {
  return sendEmail({
    to: email,
    subject: `Order Confirmed #${orderId} — Kissan Mithar Consultancy`,
    html: templates.getOrderConfirmationTemplate({ name, orderId, address, amount, paymentMethod }),
  });
};

const sendBookingConfirmation = async ({ email, name, bookingDetails }) => {
  return sendEmail({
    to: email,
    subject: 'Consultation Booking Confirmed — Kissan Mithar Consultancy',
    html: templates.getBookingConfirmationTemplate({ name, ...bookingDetails }),
  });
};

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
