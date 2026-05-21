import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExpertReview = sequelize.define('ExpertReview', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmerId: { type: DataTypes.UUID, allowNull: false, field: 'farmer_id' },
    expertId: { type: DataTypes.UUID, allowNull: false, field: 'expert_id' },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT }
  
  }, {
    tableName: 'expert_reviews',
    timestamps: true
  });

  return ExpertReview;
};
