const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Booking = sequelize.define('Booking', {
  booking_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tickets_booked: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }, 
  payment_status: { 
    type: DataTypes.ENUM('Pending', 'Completed'),
    defaultValue: 'Pending',
  },
  booked_at: {
    type: DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  razorpay_order_id: {
    type: DataTypes.STRING,
  },  
}, {
  tableName: 'Bookings',
  timestamps: false,
});

module.exports = Booking;
