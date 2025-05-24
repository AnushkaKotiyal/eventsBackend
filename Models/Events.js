const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Event = sequelize.define('Event', {
  event_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  event_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique:true
  },
  event_status:{
    type: DataTypes.STRING(25),
    allowNull:false,
    defaultValue:'active'
  },
  event_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['Music', 'Comedy', 'Workshop', 'Conference', 'Festival', 'Other']]
    }
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = Event;
