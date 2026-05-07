import { getSupabaseClient } from '@kissan/shared';

/**
 * Notification log repository — stores all sent notifications for audit trail.
 */
class NotificationRepository {
  constructor() {
    this.db = getSupabaseClient();
    this.table = 'notification_logs';
  }

  async create(notification) {
    const { data, error } = await this.db
      .from(this.table)
      .insert({
        user_id: notification.userId,
        channel: notification.channel, // 'email', 'sms', 'push'
        type: notification.type,       // 'otp', 'order_confirmation', etc.
        recipient: notification.recipient, // email or phone
        subject: notification.subject,
        status: notification.status || 'sent',
        metadata: notification.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findByUserId(userId, limit = 20) {
    const { data, error } = await this.db
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getStats() {
    const { data: total } = await this.db
      .from(this.table)
      .select('channel', { count: 'exact', head: true });

    return { total };
  }
}

export default new NotificationRepository();
