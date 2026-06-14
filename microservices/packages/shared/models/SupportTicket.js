import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SupportTicket = sequelize.define('SupportTicket', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ticketRef: { type: DataTypes.STRING, unique: true, field: 'ticket_ref' },
    farmerId: { type: DataTypes.UUID, field: 'farmer_id' },
    farmerName: { type: DataTypes.STRING, field: 'farmer_name' },
    farmerPhone: { type: DataTypes.STRING, field: 'farmer_phone' },
    assignedTo: { type: DataTypes.UUID, field: 'assigned_to' },
    assignedAgentName: { type: DataTypes.STRING, field: 'assigned_agent_name' },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'general',
      validate: {
        isIn: [['order_issue', 'payment', 'delivery', 'app_issue', 'expert_booking', 'general', 'disease_scan', 'soil_test', 'refund']]
      }
    },
    subject: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    priority: {
      type: DataTypes.STRING,
      defaultValue: 'medium',
      validate: { isIn: [['critical', 'high', 'medium', 'low']] }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open',
      validate: { isIn: [['open', 'in_progress', 'waiting', 'resolved', 'closed', 'spam']] }
    },
    source: {
      type: DataTypes.STRING,
      defaultValue: 'app',
      validate: { isIn: [['app', 'email', 'phone', 'whatsapp', 'system']] }
    },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    firstResponseAt: { type: DataTypes.DATE, field: 'first_response_at' },
    resolvedAt: { type: DataTypes.DATE, field: 'resolved_at' },
    closedAt: { type: DataTypes.DATE, field: 'closed_at' },
    slaDueAt: { type: DataTypes.DATE, field: 'sla_due_at' },
    slaBreached: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'sla_breached' },
    linkedOrderId: { type: DataTypes.STRING, field: 'linked_order_id' },
    linkedBookingId: { type: DataTypes.UUID, field: 'linked_booking_id' },
  }, {
    tableName: 'support_tickets',
    timestamps: true,
    underscored: true,
  });

  return SupportTicket;
};
