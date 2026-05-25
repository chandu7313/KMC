import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExpertConsultation = sequelize.define('ExpertConsultation', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    expertId: { type: DataTypes.UUID, field: 'expert_id', allowNull: false },
    farmerId: { type: DataTypes.UUID, field: 'farmer_id', allowNull: false },
    farmerPhone: { type: DataTypes.TEXT, field: 'farmer_phone' },
    topic: { type: DataTypes.TEXT },
    callType: { type: DataTypes.TEXT, defaultValue: 'phone', field: 'call_type' },
    scheduledAt: { type: DataTypes.DATE, field: 'scheduled_at', allowNull: false },
    status: { type: DataTypes.TEXT, defaultValue: 'upcoming' },
    cancelReason: { type: DataTypes.TEXT, field: 'cancel_reason' },
    cancelledBy: { type: DataTypes.TEXT, field: 'cancelled_by' },
    cancelledAt: { type: DataTypes.DATE, field: 'cancelled_at' }
  }, {
    tableName: 'expert_consultations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ExpertConsultation;
};
