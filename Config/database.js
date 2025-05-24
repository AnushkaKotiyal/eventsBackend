const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('eventsBackend', 'Anushka', 'Anushka@7', {
  host: 'localhost',
  dialect: 'mssql',
  timezone: '+00:00',
  dialectOptions: {
    useUTC: false,
    encrypt: true,
    trustServerCertificate: true
  },
  logging: console.log
});

module.exports = sequelize;
