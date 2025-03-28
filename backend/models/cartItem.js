// models/CartItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * CartItem Model
 *
 * Fields:
 * - id:         Primary key
 * - userId:     References the User's ID (nullable for guest carts)
 * - sessionId:  Unique session identifier for guest carts (nullable if logged in)
 * - productId:  ID of the product being added to the cart
 * - quantity:   How many of this product
 */
const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

module.exports = CartItem;
