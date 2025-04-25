// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "customer_id",  // "id" in code => "customer_id" in DB
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    homeAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "address", // "homeAddress" => "address" in DB
    },
    phoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "phone_number",
    },
    userType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "type",
    },
  },
  {
    tableName: "Customers",
    timestamps: false,
  }
);

module.exports = User;