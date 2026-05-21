import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Fertilizer = sequelize.define('Fertilizer', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
  
  }, {
    tableName: 'fertilizers',
    timestamps: true
  });

  return Fertilizer;
};
