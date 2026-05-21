import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Booking = sequelize.define('Booking', {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmer_id: { type: DataTypes.UUID, allowNull: false },
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    village: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    visit_date: { type: DataTypes.DATE, allowNull: false },
    purpose: { type: DataTypes.STRING, allowNull: false },
    assigned_officer_id: { type: DataTypes.UUID },
    status: { type: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled'), defaultValue: 'Pending' },
    payment_status: { type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), defaultValue: 'Pending' }
  
  }, {
    tableName: 'bookings',
    timestamps: true
  });

  return Booking;
};
