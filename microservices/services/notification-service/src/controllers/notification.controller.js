import { successResponse, HttpError, createLogger } from '@kissan/shared';
import * as emailService from '../services/email.service.js';
import * as smsService from '../services/sms.service.js';
import * as pushService from '../services/push.service.js';

const logger = createLogger('notification-service');

/**
 * Send a notification via API (for internal service-to-service calls).
 * @route POST /api/notifications/send
 * @param {import('express').Request} req - Express request with channel ('email'|'sms'|'push'), to, subject, and message
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const sendNotification = async (req, res, next) => {
  try {
    const { channel, to, subject, message, html, userId, data: payloadData } = req.body;

    if (!channel || !to) {
      throw HttpError.badRequest('channel and to are required');
    }

    let result;

    switch (channel) {
      case 'email':
        result = await emailService.sendEmail({ to, subject, html: html || message, text: message });
        break;
      case 'sms':
        result = await smsService.sendSms(to, message);
        break;
      case 'push':
        result = await pushService.sendPushNotification(userId || to, {
          title: subject,
          body: message,
          data: payloadData,
        });
        break;
      default:
        throw HttpError.badRequest(`Invalid channel: ${channel}. Must be email, sms, or push.`);
    }

    return successResponse(res, result, 'Notification sent');
  } catch (error) {
    next(error);
  }
};

/**
 * Get notification history for a user (admin endpoint).
 * @route GET /api/notifications/history/:userId
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const getNotificationHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { default: notificationRepo } = await import('../repositories/notification.repository.js');
    const notifications = await notificationRepo.findByUserId(userId);
    return successResponse(res, { notifications }, 'Notification history retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Send a test notification (dev/admin only).
 * @route POST /api/notifications/test
 * @param {import('express').Request} req - Express request with recipient email
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>}
 */
export const sendTestNotification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw HttpError.badRequest('email is required');

    const result = await emailService.sendEmail({
      to: email,
      subject: 'Test Notification — Kissan Mithar Consultancy',
      text: 'This is a test notification from the notification service. If you received this, email delivery is working correctly!',
    });

    return successResponse(res, result, 'Test notification sent');
  } catch (error) {
    next(error);
  }
};
