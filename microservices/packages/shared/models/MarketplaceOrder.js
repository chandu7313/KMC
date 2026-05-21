import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const MarketplaceOrder = sequelize.define('MarketplaceOrder', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    total_amount: { type: DataTypes.DECIMAL, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'), defaultValue: 'Pending' },
    payment_method: { type: DataTypes.ENUM('COD', 'Razorpay'), defaultValue: 'COD' },
    payment_status: { type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), defaultValue: 'Pending' },
    razorpay_order_id: { type: DataTypes.STRING, defaultValue: '' },
    payment_details: { type: DataTypes.JSONB, defaultValue: {} },
    cancellation_reason: { type: DataTypes.STRING, defaultValue: '' }
  
  }, {
    tableName: 'marketplace_orders',
    timestamps: true
  });

  return MarketplaceOrder;
};
