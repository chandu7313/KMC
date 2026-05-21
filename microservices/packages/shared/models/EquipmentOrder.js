import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const EquipmentOrder = sequelize.define('EquipmentOrder', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    total_amount: { type: DataTypes.DECIMAL, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'), defaultValue: 'Pending' },
    payment_status: { type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), defaultValue: 'Pending' },
    cancellation_reason: { type: DataTypes.STRING, defaultValue: '' }
  
  }, {
    tableName: 'equipment_orders',
    timestamps: true
  });

  return EquipmentOrder;
};
