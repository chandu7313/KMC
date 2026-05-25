import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExpertSlot = sequelize.define('ExpertSlot', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    expertId: { type: DataTypes.UUID, field: 'expert_id', allowNull: false },
    slotDatetime: { type: DataTypes.DATE, field: 'slot_datetime', allowNull: false },
    durationMinutes: { type: DataTypes.INTEGER, defaultValue: 30, field: 'duration_minutes' },
    isBooked: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_booked' }
  }, {
    tableName: 'expert_slots',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ExpertSlot;
};
