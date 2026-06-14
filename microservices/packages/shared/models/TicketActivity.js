import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TicketActivity = sequelize.define('TicketActivity', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ticketId: { type: DataTypes.UUID, allowNull: false, field: 'ticket_id' },
    agentId: { type: DataTypes.UUID, field: 'agent_id' },
    agentName: { type: DataTypes.STRING, field: 'agent_name' },
    action: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    metadata: { type: DataTypes.JSONB, defaultValue: {} },
  }, {
    tableName: 'ticket_activity',
    timestamps: true,
    underscored: true,
    updatedAt: false,
  });

  return TicketActivity;
};
