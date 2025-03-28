// services/reviewService.js
const Review = require("../models/Review");
const Product = require("../models/Product");
// const User = require("../models/User"); // If you need to check user existence or purchases

/**
 * Add or update a comment for a product
 * @param {number} productId
 * @param {number} userId
 * @param {string} comment
 * @returns {object} - The created or updated review
 * @throws {Error} - If product not found
 */
async function addCommentToProduct(productId, userId, comment) {
  // 1. Verify the product exists
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // 2. Find existing review by this user for the same product
  let review = await Review.findOne({ where: { productId, userId } });

  if (!review) {
    // Create a new review
    review = await Review.create({
      productId,
      userId,
      comment,
    });
  } else {
    // Update the existing review with the new comment
    review.comment = comment;
    await review.save();
  }

  return review;
}

/**
 * Add or update a rating (1-5) for a product
 * @param {number} productId
 * @param {number} userId
 * @param {number} rating
 * @returns {object} - The created or updated review
 * @throws {Error} - If product not found or rating out of range
 */
async function addRatingToProduct(productId, userId, rating) {
  // 1. Verify the product exists
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // 2. Validate the rating
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // 3. Find existing review or create a new one
  let review = await Review.findOne({ where: { productId, userId } });

  if (!review) {
    review = await Review.create({
      productId,
      userId,
      rating,
    });
  } else {
    review.rating = rating;
    await review.save();
  }

  return review;
}

module.exports = {
  addCommentToProduct,
  addRatingToProduct,
};
