import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const NotificationLog = sequelize.define('NotificationLog', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID },
    channel: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    recipient: { type: DataTypes.STRING },
    subject: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'sent' },
    metadata: { type: DataTypes.JSONB, defaultValue: {} },
    targetType: { type: DataTypes.STRING, field: 'target_type' },
    target_value: { type: DataTypes.STRING, defaultValue: 'Global' },
    recipient_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    sent_by: { type: DataTypes.UUID },
    sent_at: { type: DataTypes.DATE }
  
  }, {
    tableName: 'notification_logs',
    timestamps: true
  });

  return NotificationLog;
};
