// backend/controllers/purchaseController.js
const { placeOrder, hasUserPurchasedProduct } = require("../services/orderService");

/**
 * POST /api/orders
 */
async function placeOrderController(req, res) {
  try {
    const customer_id = req.user.id;      // from your authenticate middleware
    const { products, paymentInfo } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "At least one product is required." });
    }

    const order = await placeOrder({ customer_id, products, paymentInfo });
    return res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/orders/check-purchase?userId=...&productId=...
 */
async function checkPurchaseController(req, res) {
  try {
    const userId    = Number(req.query.userId);
    const productId = Number(req.query.productId);
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required." });
    }
    const purchased = await hasUserPurchasedProduct(userId, productId);
    if (purchased) {
      return res.status(200).json({ message: "User has purchased this product." });
    } else {
      return res.status(404).json({ message: "User has not purchased this product." });
    }
  } catch (err) {
    console.error("Error checking purchase:", err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  placeOrderController,
  checkPurchaseController,
};