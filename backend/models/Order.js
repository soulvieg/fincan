const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "order_id",
    },
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "product_id",
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "customer_id",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "order_date",
    },
    order_status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "order_status",
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_amount",
    },
  },
  {
    tableName: "Orders",
    timestamps: false,
  }
);

module.exports = Order;