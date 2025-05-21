// backend/models/Refund.js
const { DataTypes } = require("sequelize");
const sequelize      = require("../config/db");

const Refund = sequelize.define(
  "Refund",
  {
    refund_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key:   "order_id",
      },
      onDelete: "CASCADE",
    },
    refund_status: {
      type: DataTypes.ENUM(
        "Waiting for Refund",
        "Refunded",
        "Refund Denied"
      ),
      allowNull: false,
      defaultValue: "Waiting for Refund",
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00,
    },
  },
  {
    tableName: "Refunds",
    timestamps: false,
  }
);

module.exports = Refund;