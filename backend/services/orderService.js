const Order = require("../models/Order");

/**
 * Check if a user has purchased a given product.
 * Only orders with status "delivered" count as a valid purchase.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 * @returns {boolean} - True if an order exists, false otherwise.
 * @throws {Error} - If a query error occurs.
 */
async function hasUserPurchasedProduct(userId, productId) {
  const order = await Order.findOne({
    where: {
      userId: userId,
      productId: productId,
      status: "delivered",
    },
  });
  return !!order;
}

module.exports = {
  hasUserPurchasedProduct,
};
