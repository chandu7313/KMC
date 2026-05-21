import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ReplyTemplate = sequelize.define('ReplyTemplate', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
    content: { type: DataTypes.TEXT, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    createdBy: { type: DataTypes.UUID, field: 'created_by' }
  
  }, {
    tableName: 'reply_templates',
    timestamps: true
  });

  return ReplyTemplate;
};
