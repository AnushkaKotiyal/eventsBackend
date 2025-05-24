const { DataTypes } = require("sequelize");
const sequelize = require("../Config/database");
const Sequelize = require("sequelize");
const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    dob: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
    },
    photo_url: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Users",
    timestamps: false,
  }
);

module.exports = User;
