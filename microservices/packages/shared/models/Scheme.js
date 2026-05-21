import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Scheme = sequelize.define('Scheme', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    eligibility: { type: DataTypes.TEXT },
    benefits: { type: DataTypes.TEXT },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  
  }, {
    tableName: 'schemes',
    timestamps: true
  });

  return Scheme;
};
