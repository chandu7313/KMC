import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Expert = sequelize.define('Expert', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, field: 'user_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    specialization: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
    profileImage: { type: DataTypes.STRING, field: 'profile_image' },
    experienceYears: { type: DataTypes.INTEGER, field: 'experience_years' },
    rating: { type: DataTypes.DECIMAL, defaultValue: 0 },
    hourlyRate: { type: DataTypes.DECIMAL, field: 'hourly_rate' },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_available' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' }
  
  }, {
    tableName: 'experts',
    timestamps: true
  });

  return Expert;
};
