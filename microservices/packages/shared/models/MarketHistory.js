import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const MarketHistory = sequelize.define('MarketHistory', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    crop: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  
  }, {
    tableName: 'market_history',
    timestamps: true
  });

  return MarketHistory;
};
