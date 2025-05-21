const Rating = require("../models/Rating");
const Comment = require("../models/Comment");
const Product = require("../models/Product");
const User = require("../models/User");
const { hasUserPurchasedProduct } = require("../services/orderService");

/**
 * Add or update a comment for a product.
 * This function first verifies if the user purchased the product.
 * @param {number} productId
 * @param {number} userId
 * @param {string} commentText
 * @returns {object} - The created or updated comment.(Not approved at initial point.)
 * @throws {Error} - If product not found or user hasn't purchased the product.
 */
async function addCommentToProduct(productId, userId, commentText) {
    try {
    // Verify the product exists.
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }
  
  // Verify if the user purchased the product.
  const purchased = await hasUserPurchasedProduct(userId, productId);
  if (!purchased) {
    throw new Error("User has not purchased this product and cannot leave a comment.");
  }

  // Create a new comment (don't check for existing ones)
  const comment = await Comment.create({
    product_id: productId,
    manager_id: null, // Manager not assigned initially
    customer_id: userId,
    text: commentText,
    approval: null, // New comments need approval
  });

  return comment;
} catch (error) {
  console.error("Error adding comment:", error);
  throw error;
}
}

/**
 * Add or update a rating (1-5) for a product.
 * Rating is immediately visible (no approval required).
 * @param {number} productId
 * @param {number} userId
 * @param {number} ratingVal
 * @returns {object} - The created or updated review.
 * @throws {Error} - If product not found, rating out of range, or user hasn't purchased the product.
 */
async function addRatingToProduct(productId, userId, ratingVal) {
    // Verify the product exists.
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }
  
  // Verify if the user purchased the product.
  const purchased = await hasUserPurchasedProduct(userId, productId);
  if (!purchased) {
    throw new Error("User has not purchased this product and cannot leave a rating.");
  }

  // Validate the rating value.
  if (ratingVal < 1 || ratingVal > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  
  // Find existing review or create a new one.
  let rating = await Rating.findOne({ where: { customer_id: userId, product_id: productId } });
  if (!rating) {
    rating = await Rating.create({
      customer_id: userId,
      manager_id: null, // No approval needed
      product_id: productId,
      score: ratingVal,
      approval: true,   // Always immediately approved
    });
  } else {
    rating.score = ratingVal;
    await rating.save();
  }

  return rating;
}

/**
 * Approve or decline a comment.
 * Only managers/admins can call this.
 * @param {number} commentId
 * @param {number} managerId
 * @param {boolean} approve
 * @returns {object} - Updated comment
 * @throws {Error}
 */
async function reviewComment(commentId, managerId, approve) {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  comment.approval = approve;
  comment.manager_id = managerId;
  await comment.save();

  return comment;
}

/**
 * Fetch approved comments for a product.
 * (For homepage / product page display)
 * @param {number} productId
 * @returns {array} - List of approved comments
 */
async function getApprovedCommentsForProduct(productId) {
  return Comment.findAll({
    where: {
      product_id: productId,
      approval: true,
    },
    include: {
      model: User,
      as: "Customer",
      attributes: ['id', 'firstName'], // or fullName, email, etc.  
  },
  });
}

/**
 * Fetch pending comments.
 * (For manager access)
 * @returns {array} - List of pending comments
 */
async function getPendingComments() {
  return Comment.findAll({
    where: {
      approval: false,
    },
    include: [
      {
        model: Product,
        as:"Product",
        attributes: ['product_id', 'name'],
      },
      {
        model: User,
        as: "Customer",
        attributes: ['id', 'firstName','lastName'],
      },
    ],
    
  
  });
}

async function getComments() {
  return Comment.findAll({});
}

async function getRatingForCustomerComments(customerID,productID) 
{
  return Rating.findAll({where: 
    {
      product_id: productID,
      customer_id: customerID,
    }});
}

module.exports = {
  addCommentToProduct,
  addRatingToProduct,
  getApprovedCommentsForProduct,
  getPendingComments,
  reviewComment,
  getComments,
  getRatingForCustomerComments,
};
