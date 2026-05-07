import axios from 'axios';
import { createLogger } from '@kissan/shared';
import env from '../config/env.js';

const logger = createLogger('notification-service');

/**
 * Send SMS via Fast2SMS Quick SMS route.
 * Matches existing monolith config/fast2sms.js behavior.
 *
 * @param {string} phone - 10-digit Indian mobile number
 * @param {string} message - Message to send
 * @returns {Promise<{success: boolean, error?: string}>}
 */
const sendSms = async (phone, message) => {
  if (!env.enableSms) {
    logger.info(`[DEV] SMS to ${phone}: ${message}`);
    return { success: true };
  }

  if (!env.fast2smsApiKey) {
    logger.warn('FAST2SMS_API_KEY missing. SMS not sent.');
    return { success: false, error: 'API key missing' };
  }

  try {
    const response = await axios({
      method: 'GET',
      url: 'https://www.fast2sms.com/dev/bulkV2',
      params: {
        authorization: env.fast2smsApiKey,
        route: 'q',
        message,
        language: 'english',
        flash: '0',
        numbers: phone,
      },
    });

    if (response.data?.return === true) {
      logger.info(`SMS sent to ${phone}`);
      return { success: true };
    }

    logger.error(`Fast2SMS error for ${phone}`, { response: response.data });
    return { success: false, error: response.data?.message || 'Unknown API error' };
  } catch (error) {
    logger.error(`SMS send failed for ${phone}`, { error: error.message });
    return { success: false, error: error.message };
  }
};

/**
 * Send OTP SMS.
 */
const sendOtpSms = async (phone, otp) => {
  return sendSms(phone, `Your Kissan Mithar OTP is ${otp}. Valid for 5 minutes.`);
};

/**
 * Send order status SMS.
 */
const sendOrderStatusSms = async (phone, orderId, status) => {
  const statusMessages = {
    confirmed: `Your order #${orderId} is confirmed! We're preparing it for delivery.`,
    shipped: `Your order #${orderId} has been shipped. Track it in the app.`,
    delivered: `Your order #${orderId} has been delivered. Thank you for shopping with us!`,
    cancelled: `Your order #${orderId} has been cancelled. Refund will be processed within 5-7 days.`,
  };
  const message = statusMessages[status] || `Order #${orderId} status updated: ${status}`;
  return sendSms(phone, message);
};

export { sendSms, sendOtpSms, sendOrderStatusSms };
