const { hasUserPurchasedProduct } = require("../services/orderService");

/**
 * Controller to check if a user purchased a given product.
 * Expects userId and productId as query parameters.
 *
 * Route: GET /api/orders/check-purchase
 */
async function checkPurchaseController(req, res) {
  try {
    const { userId, productId } = req.query;
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required as query parameters." });
    }
    
    const purchased = await hasUserPurchasedProduct(Number(userId), Number(productId));
    if (purchased) {
      return res.status(200).json({ message: "User has purchased this product." });
    } else {
      return res.status(404).json({ message: "User has not purchased this product." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  checkPurchaseController,
};
