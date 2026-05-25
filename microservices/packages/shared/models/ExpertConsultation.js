import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExpertConsultation = sequelize.define('ExpertConsultation', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingRef: { type: DataTypes.TEXT, field: 'booking_ref', allowNull: false, unique: true },
    userId: { type: DataTypes.UUID, field: 'user_id', allowNull: false },
    expertId: { type: DataTypes.UUID, field: 'expert_id', REFERENCES: { model: 'experts', key: 'id' } },
    slotId: { type: DataTypes.UUID, field: 'slot_id', REFERENCES: { model: 'expert_slots', key: 'id' } },
    topic: { type: DataTypes.TEXT, allowNull: false },
    callType: { type: DataTypes.TEXT, defaultValue: 'phone', field: 'call_type' },
    farmerPhone: { type: DataTypes.TEXT, field: 'farmer_phone', allowNull: false },
    notes: { type: DataTypes.TEXT },
    detectedIssueId: { type: DataTypes.UUID, field: 'detected_issue_id' },
    detectedIssueType: { type: DataTypes.TEXT, field: 'detected_issue_type' },
    status: { type: DataTypes.TEXT, defaultValue: 'confirmed' },
    expertNotes: { type: DataTypes.TEXT, field: 'expert_notes' },
    recommendations: { type: DataTypes.JSONB, defaultValue: [] },
    farmerRating: { type: DataTypes.INTEGER, field: 'farmer_rating' },
    farmerReview: { type: DataTypes.TEXT, field: 'farmer_review' },
    ratedAt: { type: DataTypes.DATE, field: 'rated_at' },
    cancelledAt: { type: DataTypes.DATE, field: 'cancelled_at' },
    cancelReason: { type: DataTypes.TEXT, field: 'cancel_reason' },
    completedAt: { type: DataTypes.DATE, field: 'completed_at' },
    durationActualMinutes: { type: DataTypes.INTEGER, field: 'duration_actual_minutes' }
  }, {
    tableName: 'consultations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ExpertConsultation;
};
