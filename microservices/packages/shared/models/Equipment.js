import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Equipment = sequelize.define('Equipment', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    specifications: { type: DataTypes.JSONB, defaultValue: {} }
  
  }, {
    tableName: 'equipments',
    timestamps: true
  });

  return Equipment;
};
