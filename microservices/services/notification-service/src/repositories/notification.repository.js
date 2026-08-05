import { models } from '@kissan/shared';

const { NotificationLog } = models;

/**
 * Notification log repository — stores all sent notifications for audit trail.
 */
class NotificationRepository {
  /**
   * Log an outgoing notification delivery attempt.
   * @param {object} notification - Notification payload
   * @param {string} notification.userId - Recipient user UUID
   * @param {string} notification.channel - Delivery channel ('email'|'sms'|'push')
   * @param {string} notification.type - Notification category ('otp'|'order_placed'|etc)
   * @param {string} notification.recipient - Target address (email or phone)
   * @param {string} [notification.subject] - Optional subject
   * @param {string} [notification.status='sent'] - Status
   * @param {object} [notification.metadata] - Extra context
   * @returns {Promise<object>} Created plain log record
   */
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

  /**
   * Fetch recent notification logs for a user.
   * @param {string} userId - User UUID
   * @param {number} [limit=20] - Max logs
   * @returns {Promise<Array>} List of log records
   */
  async findByUserId(userId, limit = 20) {
    return NotificationLog.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      raw: true
    });
  }

  /**
   * Count total logged notifications.
   * @returns {Promise<{ total: number }>}
   */
  async getStats() {
    const total = await NotificationLog.count();
    return { total };
  }
}

export default new NotificationRepository();
