// models/Admin.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Admin Model
 *
 * We assume an Admin can be either a productManager or a salesManager.
 * Fields (adjust as needed):
 * - id:       Primary key, auto-increment
 * - name:     Admin name
 * - email:    Email address (unique)
 * - password: Hashed password
 * - role:     'productManager' or 'salesManager'
 */
const Admin = sequelize.define("Admin", {
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

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false,
    //defaultValue: "product_manager", // or "sales_manager"
    validate: {
      isIn: [["salesManager", "productManager", 'overseeingAdmin']],
    },
  },
});

module.exports = Admin;
