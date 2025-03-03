// controllers/productController.js
const { updateProductQuantity } = require("../services/productService");

/**
 * Controller to handle quantity updates for a product
 * @route PUT /api/products/:productId/quantity
 */
async function updateQuantityInStockController(req, res) {
  try {
    const { productId } = req.params;
    const { newQuantity } = req.body;

    // Validate the new quantity is not negative and is a number
    if (typeof newQuantity !== "number" || newQuantity < 0) {
      return res
        .status(400)
        .json({ message: "Invalid quantity value. Must be a non-negative number." });
    }

    const updatedProduct = await updateProductQuantity(Number(productId), newQuantity);

    return res
      .status(200)
      .json({ message: "Quantity updated successfully", product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  updateQuantityInStockController,
};
