// models/Order.js
const { DataTypes } = require("sequelize");    
const sequelize = require("../config/db");      

const Order = sequelize.define("Order", {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  order_status: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: "Orders",
  timestamps: false,
});

module.exports = Order;
