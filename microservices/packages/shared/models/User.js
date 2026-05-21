import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING, unique: true },
    otp: { type: DataTypes.STRING, defaultValue: '' },
    otp_expire_at: { type: DataTypes.BIGINT, defaultValue: 0 },
    verify_otp: { type: DataTypes.STRING, defaultValue: '' },
    verify_otp_expire_at: { type: DataTypes.BIGINT, defaultValue: 0 },
    reset_otp: { type: DataTypes.STRING, defaultValue: '' },
    reset_otp_expire_at: { type: DataTypes.BIGINT, defaultValue: 0 },
    isAccountVerified: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_account_verified' },
    role: { type: DataTypes.ENUM('user', 'admin', 'field-officer'), defaultValue: 'user' },
    district: { type: DataTypes.STRING, defaultValue: 'Other' },
    crops: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    field_officer_id: { type: DataTypes.UUID },
    language: { type: DataTypes.STRING, defaultValue: 'en' },
    preferred_language: { type: DataTypes.STRING, defaultValue: 'en' },
    has_completed_tour: { type: DataTypes.BOOLEAN, defaultValue: false },
    simple_mode: { type: DataTypes.BOOLEAN, defaultValue: false },
    cartData: { type: DataTypes.JSONB, defaultValue: {}, field: 'cart_data' },
    has_completed_survey: { type: DataTypes.BOOLEAN, defaultValue: false }
  
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};
