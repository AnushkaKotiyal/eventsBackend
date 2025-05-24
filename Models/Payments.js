const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.ENUM('Card', 'UPI', 'Wallet'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Completed'),
    defaultValue: 'Pending',
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  razorpay_order_id:{
   type:DataTypes.STRING(255),
   allowNull:false,
   unique:true
  }
}, {
    tableName:'Payments',
  timestamps: false,
});

module.exports = Payment;
