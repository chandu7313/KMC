import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExpertBooking = sequelize.define('ExpertBooking', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmerId: { type: DataTypes.UUID, allowNull: false, field: 'farmer_id' },
    expertId: { type: DataTypes.UUID, allowNull: false, field: 'expert_id' },
    scheduledAt: { type: DataTypes.DATE, allowNull: false, field: 'scheduled_at' },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    meetingUrl: { type: DataTypes.STRING, field: 'meeting_url' },
    notes: { type: DataTypes.TEXT },
    amount: { type: DataTypes.DECIMAL }
  
  }, {
    tableName: 'expert_bookings',
    timestamps: true
  });

  return ExpertBooking;
};
