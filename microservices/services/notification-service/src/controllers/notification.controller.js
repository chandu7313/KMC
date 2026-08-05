import { successResponse, HttpError, createLogger } from '@kissan/shared';
import * as emailService from '../services/email.service.js';
import * as smsService from '../services/sms.service.js';
import * as pushService from '../services/push.service.js';

const logger = createLogger('notification-service');

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
