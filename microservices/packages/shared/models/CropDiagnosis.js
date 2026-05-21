import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CropDiagnosis = sequelize.define('CropDiagnosis', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmerId: { type: DataTypes.UUID, field: 'farmer_id' },
    imageUrl: { type: DataTypes.STRING, field: 'image_url' },
    cropName: { type: DataTypes.STRING, field: 'crop_name' },
    fieldName: { type: DataTypes.STRING, field: 'field_name' },
    diseaseName: { type: DataTypes.STRING, field: 'disease_name' },
    severity: { type: DataTypes.STRING },
    confidence: { type: DataTypes.DECIMAL },
    isHealthy: { type: DataTypes.BOOLEAN, field: 'is_healthy' },
    recommendations: { type: DataTypes.JSONB, defaultValue: [] }
  
  }, {
    tableName: 'crop_diagnoses',
    timestamps: true
  });

  return CropDiagnosis;
};
