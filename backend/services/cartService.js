const CartItem = require("../models/cartItem");
const Product = require("../models/Product");

/**
 * Add or update an item in the cart
 * @param {object} options - { customer_id, session_id, product_id, quantity }
 * @returns {object} - The newly created or updated CartItem
 */
async function addProductToCart({ customer_id, session_id, product_id, quantity }) {
  if (!customer_id && !session_id) {
    throw new Error("Either customer_id or session_id is required.");
  }

  const product = await Product.findByPk(product_id);
  if (!product) {
    throw new Error("Product not found.");
  }

  const existing = await CartItem.findOne({
    where: {
      product_id,
      customer_id: customer_id || null,
      session_id: session_id || null,
    },
  });

  const alreadyInCart = existing ? existing.quantity : 0;

  if (product.stock === 0) {
    throw new Error("This product is out of stock.");
  }

  if (alreadyInCart + quantity > product.stock) {
    const available = product.stock - alreadyInCart;
    throw new Error(
      `Cannot add ${quantity} item(s). Only ${available} left in stock.`
    );
  }

  if (existing) {
    existing.quantity += quantity;
    await existing.save();
    return existing;
  } else {
    return await CartItem.create({
      customer_id: customer_id || null,
      session_id: session_id || null,
      product_id,
      quantity,
    });
  }
}

/**
 * Get the cart items for a given user or session
 */
async function getCart({ customer_id, session_id }) {
  if (!customer_id && !session_id) {
    throw new Error("Either customer_id or session_id is required.");
  }

  return await CartItem.findAll({
    where: {
      customer_id: customer_id || null,
      session_id: session_id || null,
    },
  });
}

/**
 * Merge guest cart into user cart upon login
 */
async function mergeGuestCartIntoUser(session_id, customer_id) {
  if (!session_id || !customer_id) return;

  const guestItems = await CartItem.findAll({
    where: { session_id, customer_id: null },
  });

  for (const item of guestItems) {
    const existing = await CartItem.findOne({
      where: { customer_id, product_id: item.product_id },
    });

    if (existing) {
      existing.quantity += item.quantity;
      await existing.save();
      await item.destroy();
    } else {
      item.customer_id = customer_id;
      item.session_id = null;
      await item.save();
    }
  }
}

module.exports = {
  addProductToCart,
  getCart,
  mergeGuestCartIntoUser,
};
