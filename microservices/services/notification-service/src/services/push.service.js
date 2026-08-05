import { createLogger } from '@kissan/shared';

const logger = createLogger('notification-service');

/**
 * Push notification service — placeholder for FCM/APNs integration.
 * Ready for Flutter mobile app integration.
 */

const sendPushNotification = async (userId, notification) => {
  try {
    // TODO: Integrate Firebase Cloud Messaging (FCM)
    // 1. Look up user's FCM token from DB
    // 2. Send via firebase-admin SDK
    logger.info(`[PUSH] Notification for user ${userId}:`, {
      title: notification.title,
      body: notification.body,
    });

    return { success: true };
  } catch (error) {
    logger.error(`Push notification failed for user ${userId}`, { error: error.message });
    return { success: false, error: error.message };
  }
};

const sendBulkPush = async (userIds, notification) => {
  const results = await Promise.allSettled(
    userIds.map((id) => sendPushNotification(id, notification))
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
  logger.info(`Bulk push: ${succeeded}/${userIds.length} delivered`);

  return { total: userIds.length, succeeded, failed: userIds.length - succeeded };
};

export { sendPushNotification, sendBulkPush };
