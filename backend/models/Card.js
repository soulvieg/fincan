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
      field: "card_id",
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "customer_id",
    },
    cardNumber: {
      type: DataTypes.STRING(255),    // store bcrypt hash
      allowNull: false,
      field: "card_number",
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expiration_date",
    },
    cardName: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: "card_name",
    },
  },
  {
    tableName: "Cards",
    timestamps: false,
  }
);

module.exports = Card;