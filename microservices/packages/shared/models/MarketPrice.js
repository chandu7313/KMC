import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const MarketPrice = sequelize.define('MarketPrice', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    cropName: { type: DataTypes.STRING, allowNull: false, field: 'crop_name' },
    district: { type: DataTypes.STRING, allowNull: false },
    mandi: { type: DataTypes.STRING, defaultValue: 'Local Mandi' },
    min_price: { type: DataTypes.DECIMAL },
    max_price: { type: DataTypes.DECIMAL },
    modalPrice: { type: DataTypes.DECIMAL, allowNull: false, field: 'modal_price' },
    change: { type: DataTypes.DECIMAL, defaultValue: 0 },
    arrivalDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'arrival_date' },
    variety: { type: DataTypes.STRING, defaultValue: 'Standard' },
    source: { type: DataTypes.STRING, defaultValue: 'agmarknet' }
  
  }, {
    tableName: 'market_prices',
    timestamps: true
  });

  return MarketPrice;
};
