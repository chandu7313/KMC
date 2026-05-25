import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExpertV2 = sequelize.define('ExpertV2', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    photoUrl: { type: DataTypes.TEXT, field: 'photo_url' },
    specialty: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT },
    experienceYears: { type: DataTypes.INTEGER, defaultValue: 0, field: 'experience_years' },
    rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 4.5 },
    tags: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
    languages: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: ['English'] },
    availabilityStatus: { type: DataTypes.TEXT, defaultValue: 'available', field: 'availability_status' },
    nextAvailableAt: { type: DataTypes.DATE, field: 'next_available_at' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' }
  }, {
    tableName: 'experts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ExpertV2;
};
