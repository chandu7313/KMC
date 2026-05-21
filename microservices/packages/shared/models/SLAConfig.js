import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SLAConfig = sequelize.define('SLAConfig', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    priority: { type: DataTypes.STRING, unique: true },
    firstResponseMins: { type: DataTypes.INTEGER, field: 'first_response_mins' },
    resolutionMins: { type: DataTypes.INTEGER, field: 'resolution_mins' }
  
  }, {
    tableName: 'sla_config',
    timestamps: true
  });

  return SLAConfig;
};
