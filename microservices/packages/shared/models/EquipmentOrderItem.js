import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const EquipmentOrderItem = sequelize.define('EquipmentOrderItem', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false, field: 'order_id' },
    equipmentId: { type: DataTypes.UUID, allowNull: false, field: 'equipment_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false }
  
  }, {
    tableName: 'equipment_order_items',
    timestamps: false
  });

  return EquipmentOrderItem;
};
