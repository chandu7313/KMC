import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Order = sequelize.define('Order', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
    package: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.STRING, defaultValue: 'Active' }
  
  }, {
    tableName: 'orders',
    timestamps: true
  });

  return Order;
};
