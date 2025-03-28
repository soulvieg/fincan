// services/cartService.js
const CartItem = require("../models/cartItem");

/**
 * Add or update an item in the cart
 * @param {object} options - { userId, sessionId, productId, quantity }
 * @returns {object} - The newly created or updated CartItem
 */
async function addProductToCart({ userId, sessionId, productId, quantity }) {
  // We need either userId or sessionId
  if (!userId && !sessionId) {
    throw new Error("Either userId or sessionId is required.");
  }

  // Check if there's already a cart item for the same product
  const existingCartItem = await CartItem.findOne({
    where: {
      productId,
      userId: userId || null,
      sessionId: sessionId || null,
    },
  });

  if (existingCartItem) {
    // Update the quantity
    existingCartItem.quantity += quantity;
    await existingCartItem.save();
    return existingCartItem;
  } else {
    // Create a new cart item
    const newCartItem = await CartItem.create({
      userId: userId || null,
      sessionId: sessionId || null,
      productId,
      quantity,
    });
    return newCartItem;
  }
}

/**
 * Get the cart items for a given user or session
 * @param {object} options - { userId, sessionId }
 * @returns {Array} - List of CartItems
 */
async function getCart({ userId, sessionId }) {
  // Must have at least one
  if (!userId && !sessionId) {
    throw new Error("Either userId or sessionId is required.");
  }

  const cartItems = await CartItem.findAll({
    where: {
      userId: userId || null,
      sessionId: sessionId || null,
    },
  });

  return cartItems;
}

/**
 * Merge a guest cart into a user cart upon login
 * @param {string} guestSessionId - The sessionId for the guest cart
 * @param {number} userId - The userId to merge into
 */
async function mergeGuestCartIntoUser(guestSessionId, userId) {
  if (!guestSessionId || !userId) return;

  // Find all cart items for the guest session
  const guestCartItems = await CartItem.findAll({
    where: {
      sessionId: guestSessionId,
      userId: null,
    },
  });

  // Reassign each guest cart item to the logged-in user
  for (const item of guestCartItems) {
    // Check if the user already has the same product in their cart
    const existingUserCartItem = await CartItem.findOne({
      where: {
        userId,
        productId: item.productId,
      },
    });

    if (existingUserCartItem) {
      // Merge quantity
      existingUserCartItem.quantity += item.quantity;
      await existingUserCartItem.save();

      // Remove the guest cart item
      await item.destroy();
    } else {
      // Just update the guest item to belong to this user
      item.userId = userId;
      item.sessionId = null; // no longer needed
      await item.save();
    }
  }
}

module.exports = {
  addProductToCart,
  getCart,
  mergeGuestCartIntoUser,
};
