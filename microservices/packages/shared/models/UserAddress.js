import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UserAddress = sequelize.define('UserAddress', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false }
  
  }, {
    tableName: 'user_addresses',
    timestamps: true
  });

  return UserAddress;
};
