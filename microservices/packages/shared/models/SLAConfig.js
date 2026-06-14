import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SLAConfig = sequelize.define('SLAConfig', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    priority: { type: DataTypes.STRING, unique: true, allowNull: false },
    firstResponseHours: { type: DataTypes.DECIMAL(4, 2), allowNull: false, field: 'first_response_hours' },
    resolutionHours: { type: DataTypes.DECIMAL(4, 2), allowNull: false, field: 'resolution_hours' },
    escalateAfterHours: { type: DataTypes.DECIMAL(4, 2), allowNull: false, field: 'escalate_after_hours' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  }, {
    tableName: 'sla_config',
    timestamps: false,
    underscored: true,
  });

  return SLAConfig;
};
