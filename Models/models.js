const sequelize = require('../Config/database');
const User = require('./Users');
const Event = require('./Events');
const Booking = require('./Bookings');
const TicketUpload = require('./TicketUploads');
const Payment = require('./Payments');
const OTPLog = require('./OtpLog');

User.hasMany(Event, { foreignKey: 'created_by', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'created_by' });

User.hasMany(Booking, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

Event.hasMany(Booking, { foreignKey: 'event_id', onDelete: 'CASCADE' });
Booking.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(TicketUpload, { foreignKey: 'user_id' });
TicketUpload.belongsTo(User, { foreignKey: 'user_id' });

Event.hasMany(TicketUpload, { foreignKey: 'event_id' });
TicketUpload.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

// User.hasMany(OTPLog, { foreignKey: 'user_id' });
// OTPLog.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(OTPLog, { foreignKey: 'email', sourceKey: 'email' });
OTPLog.belongsTo(User, { foreignKey: 'email', targetKey: 'email' });

module.exports = {
  sequelize,  
  User,
  Event,
  Booking,
  TicketUpload,
  Payment, 
  OTPLog
};
