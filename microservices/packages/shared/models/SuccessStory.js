import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SuccessStory = sequelize.define('SuccessStory', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmer_name: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    crop: { type: DataTypes.STRING },
    before_yield: { type: DataTypes.DECIMAL },
    after_yield: { type: DataTypes.DECIMAL },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' }
  
  }, {
    tableName: 'success_stories',
    timestamps: true
  });

  return SuccessStory;
};
