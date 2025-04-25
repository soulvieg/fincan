const { hasUserPurchasedProduct, placeOrder } = require("../services/orderService");

/**
 * Controller to check if a user purchased a given product.
 * Expects userId and productId as query parameters.
 *
 * Route: GET /api/orders/check-purchase
 */
async function checkPurchaseController(req, res) {
  try {
    const { userId, productId } = req.query;

    // Validate query parameters
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required as query parameters." });
    }

    // Check if user has purchased the product
    const purchased = await hasUserPurchasedProduct(Number(userId), Number(productId));

    if (purchased) {
      return res.status(200).json({ message: "User has purchased this product." });
    } else {
      return res.status(404).json({ message: "User has not purchased this product." });
    }
  } catch (error) {
    console.error("Error checking user purchase:", error);
    return res.status(500).json({ message: error.message || "Something went wrong" });
  }
}


/**
 * Controller to handle placing an order
 * @route POST /api/orders
 */
async function placeOrderController(req, res) {
  try {
    const customer_id = req.user.id;  // Assuming customer ID is available from `req.user`
    const { products, paymentInfo } = req.body;

    // Validate request body
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "At least one product is required in the products array.",
      });
    }
    if (!paymentInfo) {
      return res.status(400).json({
        message: "Payment info is required.",
      });
    }

    // Validate each product in the array
    const invalidProduct = products.find(
      ({ productId, quantity }) => !productId || !quantity || quantity <= 0
    );
    if (invalidProduct) {
      return res.status(400).json({
        message: `Invalid product details for productId ${invalidProduct.productId}`,
      });
    }

    // Place the order
    const order = await placeOrder({ customer_id, products, paymentInfo });

    return res.status(201).json({
      message: "Order placed and payment processed successfully.",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: error.message || "Something went wrong" });
  }
}



module.exports = {
  checkPurchaseController,
  placeOrderController,
};
