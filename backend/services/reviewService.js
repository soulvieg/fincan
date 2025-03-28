const Review = require("../models/Review");
const Product = require("../models/Product");
const { hasUserPurchasedProduct } = require("../services/orderService");

/**
 * Add or update a comment for a product.
 * This function first verifies if the user purchased the product.
 * @param {number} productId
 * @param {number} userId
 * @param {string} comment
 * @returns {object} - The created or updated review.
 * @throws {Error} - If product not found or user hasn't purchased the product.
 */
async function addCommentToProduct(productId, userId, comment) {
  // Verify if the user purchased the product.
  const purchased = await hasUserPurchasedProduct(userId, productId);
  if (!purchased) {
    throw new Error("User has not purchased this product and cannot leave a comment.");
  }

  // Verify the product exists.
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Find existing review or create a new one.
  let review = await Review.findOne({ where: { productId, userId } });
  if (!review) {
    review = await Review.create({
      productId,
      userId,
      comment,
    });
  } else {
    review.comment = comment;
    await review.save();
  }

  return review;
}

/**
 * Add or update a rating (1-5) for a product.
 * This function first verifies if the user purchased the product.
 * @param {number} productId
 * @param {number} userId
 * @param {number} rating
 * @returns {object} - The created or updated review.
 * @throws {Error} - If product not found, rating out of range, or user hasn't purchased the product.
 */
async function addRatingToProduct(productId, userId, rating) {
  // Verify if the user purchased the product.
  const purchased = await hasUserPurchasedProduct(userId, productId);
  if (!purchased) {
    throw new Error("User has not purchased this product and cannot leave a rating.");
  }

  // Verify the product exists.
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Validate the rating value.
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Find existing review or create a new one.
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
