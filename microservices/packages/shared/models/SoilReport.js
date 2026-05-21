import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SoilReport = sequelize.define('SoilReport', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmerId: { type: DataTypes.UUID, allowNull: false, field: 'farmer_id' },
    ph: { type: DataTypes.DECIMAL },
    nitrogen: { type: DataTypes.DECIMAL },
    phosphorus: { type: DataTypes.DECIMAL },
    potassium: { type: DataTypes.DECIMAL },
    organic_matter: { type: DataTypes.DECIMAL },
    micronutrients: { type: DataTypes.JSONB, defaultValue: {} },
    recommended_fertilizer: { type: DataTypes.STRING },
    suitable_crops: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    soil_status: { type: DataTypes.ENUM('Good', 'Moderate', 'Critical', 'Acidic', 'Neutral', 'Alkaline') },
    suitability_pct: { type: DataTypes.DECIMAL },
    report_file: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Pending', 'Completed'), defaultValue: 'Pending' },
    next_test_date: { type: DataTypes.DATE }
  
  }, {
    tableName: 'soil_reports',
    timestamps: true
  });

  return SoilReport;
};
