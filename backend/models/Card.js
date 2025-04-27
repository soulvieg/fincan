// backend/models/Card.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Card = sequelize.define(
  "Card",
  {
    card_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    card_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    card_last4: {
      type: DataTypes.CHAR(4),
      allowNull: false,
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    card_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    tableName: "Cards",
    timestamps: false,
  }
);

module.exports = Card;