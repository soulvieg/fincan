// controllers/productController.js
const { updateProductQuantity } = require("../services/productService");

/**
 * Add a new product
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function addProductController(req, res) {
  try {
    const productData = req.body;
    const newProduct = await productService.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

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

/**
 * Delete a product by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function deleteProductController(req, res) {
  try {
    const productId = req.params.productId;
    await productService.deleteProduct(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}


module.exports = {
  addProductController,
  updateQuantityInStockController,
  deleteProductController,
};
