const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Order Model
 *
 * Fields:
 * - id:        Primary key, auto-increment
 * - userId:    The ID of the user who made the purchase
 * - productId: The ID of the purchased product
 * - quantity:  Number of items purchased
 * - status:    Order status (e.g., "processing", "delivered")
 */
const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    // For this check we use "delivered" to allow reviews.
  },
});

module.exports = Order;
