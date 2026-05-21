import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Review = sequelize.define('Review', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
    user_name: { type: DataTypes.STRING, allowNull: false }
  
  }, {
    tableName: 'reviews',
    timestamps: true
  });

  return Review;
};
