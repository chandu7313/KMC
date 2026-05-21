import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Product = sequelize.define('Product', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    short_description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING, allowNull: false },
    sub_category: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    discounted_price: { type: DataTypes.DECIMAL },
    images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    specifications: { type: DataTypes.JSONB, defaultValue: {} },
    ratings: { type: DataTypes.DECIMAL, defaultValue: 0 },
    num_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_featured' }
  
  }, {
    tableName: 'products',
    timestamps: true
  });

  return Product;
};
