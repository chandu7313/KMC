import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PriceAlert = sequelize.define('PriceAlert', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    crop: { type: DataTypes.STRING, allowNull: false },
    target_price: { type: DataTypes.DECIMAL, allowNull: false },
    condition: { type: DataTypes.ENUM('Above', 'Below'), allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Triggered'), defaultValue: 'Active' },
    last_notified: { type: DataTypes.DATE }
  
  }, {
    tableName: 'price_alerts',
    timestamps: true
  });

  return PriceAlert;
};
