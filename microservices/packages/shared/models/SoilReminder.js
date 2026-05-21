import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SoilReminder = sequelize.define('SoilReminder', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    reportId: { type: DataTypes.UUID, allowNull: false, field: 'report_id' },
    reminder_date: { type: DataTypes.DATE, allowNull: false },
    is_sent: { type: DataTypes.BOOLEAN, defaultValue: false }
  
  }, {
    tableName: 'soil_reminders',
    timestamps: true
  });

  return SoilReminder;
};
