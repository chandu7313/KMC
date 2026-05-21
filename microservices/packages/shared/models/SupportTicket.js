import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SupportTicket = sequelize.define('SupportTicket', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, field: 'user_id' },
    ticketRef: { type: DataTypes.STRING, field: 'ticket_ref' },
    subject: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    priority: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'open' },
    assignedTo: { type: DataTypes.UUID, field: 'assigned_to' },
    description: { type: DataTypes.TEXT }
  
  }, {
    tableName: 'support_tickets',
    timestamps: true
  });

  return SupportTicket;
};
