import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const FertilizerOrderItem = sequelize.define('FertilizerOrderItem', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false, field: 'order_id' },
    fertilizerId: { type: DataTypes.UUID, allowNull: false, field: 'fertilizer_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false }
  
  }, {
    tableName: 'fertilizer_order_items',
    timestamps: false
  });

  return FertilizerOrderItem;
};
