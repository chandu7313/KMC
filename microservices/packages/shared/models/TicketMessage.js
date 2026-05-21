import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TicketMessage = sequelize.define('TicketMessage', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ticketId: { type: DataTypes.UUID, allowNull: false, field: 'ticket_id' },
    senderId: { type: DataTypes.UUID, field: 'sender_id' },
    senderRole: { type: DataTypes.STRING, field: 'sender_role' },
    message: { type: DataTypes.TEXT, allowNull: false },
    attachments: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] }
  
  }, {
    tableName: 'ticket_messages',
    timestamps: true
  });

  return TicketMessage;
};
