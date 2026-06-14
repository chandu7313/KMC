import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ReplyTemplate = sequelize.define('ReplyTemplate', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    subjectEn: { type: DataTypes.STRING, field: 'subject_en' },
    contentEn: { type: DataTypes.TEXT, allowNull: false, field: 'content_en' },
    contentHi: { type: DataTypes.TEXT, field: 'content_hi' },
    contentTe: { type: DataTypes.TEXT, field: 'content_te' },
    variables: { type: DataTypes.JSONB, defaultValue: [] },
    usageCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'usage_count' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    createdBy: { type: DataTypes.UUID, field: 'created_by' },
  }, {
    tableName: 'reply_templates',
    timestamps: true,
    underscored: true,
  });

  return ReplyTemplate;
};
