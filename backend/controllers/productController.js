const productService = require("../services/productService");

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

// controllers/productController.js
const { incrementStock, decrementStock } = require("../services/productService");

async function incrementStockController(req, res) {
  try {
    const { productId } = req.params;
    const updatedProduct = await incrementStock(productId);
    return res.status(200).json({
      message: "Quantity incremented successfully",
      product: updatedProduct
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function decrementStockController(req, res) {
  try {
    const { productId } = req.params;
    const updatedProduct = await decrementStock(productId);
    return res.status(200).json({
      message: "Quantity decremented successfully",
      product: updatedProduct
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const { approveComment, rejectComment } = require("../services/commentService");

/**
 * Approve a user comment
 * @route PUT /api/comments/:commentId/approve
 */
async function approveCommentController(req, res) {
  try {
    const { commentId } = req.params;
    const updatedComment = await approveComment(commentId);
    return res.status(200).json({
      message: "Comment approved successfully",
      comment: updatedComment
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Reject a user comment
 * @route PUT /api/comments/:commentId/reject
 */
async function rejectCommentController(req, res) {
  try {
    const { commentId } = req.params;
    const updatedComment = await rejectComment(commentId);
    return res.status(200).json({
      message: "Comment rejected successfully",
      comment: updatedComment
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Controller to search products by name or description.
 * Expects a query parameter "query".
 * @route GET /api/products/search?query=searchTerm
 */
async function searchProductsController(req, res) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }
    const products = await productService.searchProducts(query);

    // return a 404 if no results
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for your query." });
    }

    return res.status(200).json({ message: "Products retrieved successfully", products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  addProductController,
  updateQuantityInStockController,
  deleteProductController,
  incrementStockController,
  decrementStockController,
  approveCommentController,
  rejectCommentController,
  searchProductsController,
};