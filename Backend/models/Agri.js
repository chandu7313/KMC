import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const SoilReport = sequelize.define('SoilReport', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ph: { type: DataTypes.FLOAT },
    nitrogen: { type: DataTypes.FLOAT },
    phosphorus: { type: DataTypes.FLOAT },
    potassium: { type: DataTypes.FLOAT },
    organicMatter: { type: DataTypes.FLOAT },
    micronutrients: { type: DataTypes.JSONB, defaultValue: {} },
    recommendedFertilizer: { type: DataTypes.STRING },
    suitableCrops: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    soilStatus: { type: DataTypes.STRING },
    suitabilityPct: { type: DataTypes.FLOAT },
    reportFile: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    nextTestDate: { type: DataTypes.DATE }
}, {
    tableName: 'soil_reports',
    underscored: true,
    timestamps: true
});

const SoilReminder = sequelize.define('SoilReminder', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    reminderDate: { type: DataTypes.DATE, allowNull: false },
    isSent: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'soil_reminders',
    underscored: true,
    timestamps: true
});

const MarketPrice = sequelize.define('MarketPrice', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    cropName: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    mandi: { type: DataTypes.STRING, defaultValue: 'Local Mandi' },
    minPrice: { type: DataTypes.FLOAT },
    maxPrice: { type: DataTypes.FLOAT },
    modalPrice: { type: DataTypes.FLOAT, allowNull: false },
    change: { type: DataTypes.FLOAT, defaultValue: 0 },
    arrivalDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    variety: { type: DataTypes.STRING, defaultValue: 'Standard' },
    source: { type: DataTypes.STRING, defaultValue: 'agmarknet' }
}, {
    tableName: 'market_prices',
    underscored: true,
    timestamps: true
});

const MarketHistory = sequelize.define('MarketHistory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    crop: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'market_history',
    underscored: true,
    timestamps: true
});

const PriceAlert = sequelize.define('PriceAlert', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    crop: { type: DataTypes.STRING, allowNull: false },
    targetPrice: { type: DataTypes.FLOAT, allowNull: false },
    condition: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Active' },
    lastNotified: { type: DataTypes.DATE }
}, {
    tableName: 'price_alerts',
    underscored: true,
    timestamps: true
});

export { SoilReport, SoilReminder, MarketPrice, MarketHistory, PriceAlert };
