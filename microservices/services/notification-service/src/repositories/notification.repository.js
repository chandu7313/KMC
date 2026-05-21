import { models } from '@kissan/shared';

const { NotificationLog } = models;

/**
 * Notification log repository — stores all sent notifications for audit trail.
 */
class NotificationRepository {
  async create(notification) {
    const log = await NotificationLog.create({
      user_id: notification.userId,
      channel: notification.channel, // 'email', 'sms', 'push'
      type: notification.type,       // 'otp', 'order_confirmation', etc.
      recipient: notification.recipient, // email or phone
      subject: notification.subject,
      status: notification.status || 'sent',
      metadata: notification.metadata || {},
    });
    return log.get({ plain: true });
  }

  async findByUserId(userId, limit = 20) {
    return NotificationLog.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      raw: true
    });
  }

  async getStats() {
    const total = await NotificationLog.count();
    return { total };
  }
}

export default new NotificationRepository();
