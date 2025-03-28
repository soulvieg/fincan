// controllers/cartController.js
const {
    addProductToCart,
    getCart,
  } = require("../services/cartService");
  
  /**
   * Controller to add a product to the cart
   * @route POST /api/cart
   */
  async function addToCartController(req, res) {
    try {
      const { userId, sessionId, productId, quantity } = req.body;
  
      // Basic validation
      if (!productId || !quantity) {
        return res
          .status(400)
          .json({ message: "productId and quantity are required." });
      }
  
      const cartItem = await addProductToCart({
        userId,
        sessionId,
        productId,
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
  
  /**
   * Controller to get cart items
   * @route GET /api/cart
   */
  async function getCartController(req, res) {
    try {
      // Could be query params or body
      const { userId, sessionId } = req.query;
  
      const items = await getCart({ userId, sessionId });
      return res.status(200).json({
        message: "Cart retrieved successfully",
        cart: items,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  module.exports = {
    addToCartController,
    getCartController,
  };
  