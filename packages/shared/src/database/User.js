const { DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');

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

module.exports = User;
