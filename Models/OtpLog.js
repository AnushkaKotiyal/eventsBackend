const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const OTPLog = sequelize.define('OTPLog', {
  otp_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true, // allow null so Sequelize doesn't force a value
    defaultValue: undefined   
  },  
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true, // allow null so Sequelize doesn't force a value
    defaultValue: undefined 
  },
  email:{
    type:DataTypes.STRING(100),
    allowNull:false,
    unique:true
  }
},
 {
  tableName:'OTP_Logs',
  timestamps: false,
});

module.exports = OTPLog;

// older
// const { DataTypes } = require('sequelize');
// const sequelize = require('../Config/database');

// const OTPLog = sequelize.define('OTPLog', {
//   otp_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   otp_code: {
//     type: DataTypes.STRING(6),
//     allowNull: false,
//   },
//   expires_at: {
//     type: DataTypes.DATEONLY,
//     allowNull: false,
//   },
//   verified: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   }
// }, {
//   tableName:'OTP_Logs',
//   timestamps: false,
// });

// module.exports = OTPLog;
