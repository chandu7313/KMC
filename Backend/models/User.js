import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING, unique: true },
    otp: { type: DataTypes.STRING, defaultValue: '' },
    otpExpireAt: { type: DataTypes.BIGINT, defaultValue: 0 },
    verifyOtp: { type: DataTypes.STRING, defaultValue: '' },
    verifyOtpExpireAt: { type: DataTypes.BIGINT, defaultValue: 0 },
    resetOtp: { type: DataTypes.STRING, defaultValue: '' },
    resetOtpExpireAt: { type: DataTypes.BIGINT, defaultValue: 0 },
    isAccountVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    district: { type: DataTypes.STRING, defaultValue: 'Other' },
    crops: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    language: { type: DataTypes.STRING, defaultValue: 'en' },
    preferredLanguage: { type: DataTypes.STRING, defaultValue: 'en' },
    hasCompletedTour: { type: DataTypes.BOOLEAN, defaultValue: false },
    simpleMode: { type: DataTypes.BOOLEAN, defaultValue: false },
    hasCompletedSurvey: { type: DataTypes.BOOLEAN, defaultValue: false },
    cartData: { type: DataTypes.JSONB, defaultValue: {} },
}, {
    tableName: 'users',
    underscored: true,
    timestamps: true
});

const UserAddress = sequelize.define('UserAddress', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'user_addresses',
    underscored: true,
    timestamps: true
});

const FarmerSurvey = sequelize.define('FarmerSurvey', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    language: { type: DataTypes.STRING },
    farmName: { type: DataTypes.STRING },
    farmSize: { type: DataTypes.DECIMAL },
    farmSizeUnit: { type: DataTypes.STRING, defaultValue: 'acres' },
    landOwnership: { type: DataTypes.STRING },
    soilType: { type: DataTypes.STRING },
    waterSource: { type: DataTypes.STRING },
    primaryCrops: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    farmingExperience: { type: DataTypes.STRING },
}, {
    tableName: 'farmer_surveys',
    underscored: true,
    timestamps: true
});

export { User, UserAddress, FarmerSurvey };
