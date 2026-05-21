import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const AdminUser = sequelize.define('AdminUser', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: 'support_agent' },
    status: { type: DataTypes.STRING, defaultValue: 'active' },
    avatar: { type: DataTypes.STRING },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    assignedDistricts: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [], field: 'assigned_districts' },
    languagesSpoken: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: ['en'], field: 'languages_spoken' }
  
  }, {
    tableName: 'admin_users',
    timestamps: true
  });

  return AdminUser;
};
