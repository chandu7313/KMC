import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExpertConsultationNote = sequelize.define('ExpertConsultationNote', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    consultationId: { type: DataTypes.UUID, field: 'consultation_id', allowNull: false, unique: true },
    expertNotes: { type: DataTypes.TEXT, field: 'expert_notes' },
    recommendations: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
    durationActualMinutes: { type: DataTypes.INTEGER, field: 'duration_actual_minutes' },
    farmerRating: { type: DataTypes.INTEGER, field: 'farmer_rating' }
  }, {
    tableName: 'expert_consultation_notes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ExpertConsultationNote;
};
