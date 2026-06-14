import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const AgentPerformance = sequelize.define('AgentPerformance', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    agentId: { type: DataTypes.UUID, allowNull: false, field: 'agent_id' },
    agentName: { type: DataTypes.STRING, allowNull: false, field: 'agent_name' },
    date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    ticketsAssigned: { type: DataTypes.INTEGER, defaultValue: 0, field: 'tickets_assigned' },
    ticketsResolved: { type: DataTypes.INTEGER, defaultValue: 0, field: 'tickets_resolved' },
    avgResponseMins: { type: DataTypes.INTEGER, defaultValue: 0, field: 'avg_response_mins' },
    avgResolutionHrs: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0, field: 'avg_resolution_hrs' },
    slaMetCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sla_met_count' },
    slaBreachedCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sla_breached_count' },
    csatAvg: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0, field: 'csat_avg' },
    csatCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'csat_count' },
  }, {
    tableName: 'agent_performance',
    timestamps: false,
    underscored: true,
    indexes: [
      { unique: true, fields: ['agent_id', 'date'] }
    ]
  });

  return AgentPerformance;
};
