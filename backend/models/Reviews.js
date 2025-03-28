// models/Review.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Review Model
 *
 * Fields:
 * - id:        Primary key
 * - userId:    The ID of the user leaving the comment/rating
 * - productId: The ID of the product being reviewed
 * - rating:    An integer 1-5
 * - comment:   A text field for user comments
 */
const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Optionally: references: { model: 'Users', key: 'id' }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Optionally: references: { model: 'Products', key: 'id' }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Review;
