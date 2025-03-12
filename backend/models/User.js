// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * User Model
 *
 * Fields:
 * - id:           Primary key, auto-increment
 * - name:         Full name of the user
 * - email:        Email address (unique)
 * - homeAddress:  Home address of the user
 * - password:     Hashed password
 */
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  homeAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
