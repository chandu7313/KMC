import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Payment = sequelize.define('Payment', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, field: 'order_id' },
    userId: { type: DataTypes.UUID, field: 'user_id' },
    amount: { type: DataTypes.DECIMAL },
    currency: { type: DataTypes.STRING, defaultValue: 'INR' },
    status: { type: DataTypes.STRING },
    paymentMethod: { type: DataTypes.STRING, field: 'payment_method' },
    transactionId: { type: DataTypes.STRING, field: 'transaction_id' },
    paymentGateway: { type: DataTypes.STRING, field: 'payment_gateway' },
    gatewayResponse: { type: DataTypes.JSONB, field: 'gateway_response' }
  
  }, {
    tableName: 'payments',
    timestamps: true
  });

  return Payment;
};
