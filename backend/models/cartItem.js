// models/CartItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CartItem = sequelize.define("CartItem", {
  cart_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,    // allow NULL for guest carts
  },
  session_id: {
    type: DataTypes.STRING,
    allowNull: true,    // track guest sessions
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: "Carts",
  timestamps: false,
});

module.exports = CartItem;