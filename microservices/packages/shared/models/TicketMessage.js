import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TicketMessage = sequelize.define('TicketMessage', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ticketId: { type: DataTypes.UUID, allowNull: false, field: 'ticket_id' },
    senderType: {
      type: DataTypes.STRING,
      field: 'sender_type',
      validate: { isIn: [['farmer', 'agent', 'system']] }
    },
    senderId: { type: DataTypes.UUID, field: 'sender_id' },
    senderName: { type: DataTypes.STRING, field: 'sender_name' },
    message: { type: DataTypes.TEXT, allowNull: false },
    attachments: { type: DataTypes.JSONB, defaultValue: [] },
    isInternalNote: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_internal_note' },
  }, {
    tableName: 'ticket_messages',
    timestamps: true,
    underscored: true,
  });

  return TicketMessage;
};
