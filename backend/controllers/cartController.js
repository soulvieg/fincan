const {
  addProductToCart,
  getCart,
  mergeGuestCartIntoUser,
} = require("../services/cartService");

async function addToCartController(req, res) {
  try {
    const { customer_id, session_id, product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "product_id and quantity are required." });
    }

    const cartItem = await addProductToCart({
      customer_id,
      session_id,
      product_id,
      quantity,
    });

    return res.status(200).json({
      message: "Item added to cart successfully",
      cartItem,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getCartController(req, res) {
  try {
    const { customer_id, session_id } = req.query;

    const items = await getCart({ customer_id, session_id });
    return res.status(200).json({
      message: "Cart retrieved successfully",
      cart: items,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function mergeCartController(req, res) {
  try {
    const { session_id, customer_id } = req.body;

    if (!session_id || !customer_id) {
      return res.status(400).json({ message: "session_id and customer_id are required." });
    }

    await mergeGuestCartIntoUser(session_id, customer_id);

    return res.status(200).json({ message: "Cart merged successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  addToCartController,
  getCartController,
  mergeCartController,
};
