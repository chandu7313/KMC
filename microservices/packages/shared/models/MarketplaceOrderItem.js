import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const MarketplaceOrderItem = sequelize.define('MarketplaceOrderItem', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false, field: 'order_id' },
    productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false }
  
  }, {
    tableName: 'marketplace_order_items',
    timestamps: false
  });

  return MarketplaceOrderItem;
};
