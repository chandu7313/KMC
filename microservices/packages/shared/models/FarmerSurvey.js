import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const FarmerSurvey = sequelize.define('FarmerSurvey', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, unique: true, field: 'user_id' },
    language: { type: DataTypes.STRING },
    farm_name: { type: DataTypes.STRING },
    farm_size: { type: DataTypes.STRING },
    farm_size_unit: { type: DataTypes.STRING, defaultValue: 'acres' },
    land_ownership: { type: DataTypes.STRING },
    soil_type: { type: DataTypes.STRING },
    water_source: { type: DataTypes.STRING },
    primary_crops: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    farming_experience: { type: DataTypes.STRING }
  
  }, {
    tableName: 'farmer_surveys',
    timestamps: true
  });

  return FarmerSurvey;
};
