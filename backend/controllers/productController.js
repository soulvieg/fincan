// controllers/productController.js
const {
  addProduct,
  updateProductQuantity,
  deleteProduct,
  incrementStock,
  decrementStock,
  searchProducts,
  getProducts,
} = require("../services/productService");
const { approveComment, rejectComment } = require("../services/commentService");

/**
 * Add a new product
 * POST /api/products
 */
async function addProductController(req, res) {
  try {
    const productData = req.body;
    const newProduct  = await addProduct(productData);
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Update stock quantity
 * PUT /api/products/:productId/quantity
 */
async function updateQuantityInStockController(req, res) {
  try {
    const { productId }  = req.params;
    const { newQuantity } = req.body;

    if (typeof newQuantity !== "number" || newQuantity < 0) {
      return res
        .status(400)
        .json({ message: "Invalid quantity. Must be a non-negative number." });
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
 * DELETE /api/products/:productId
 */
async function deleteProductController(req, res) {
  try {
    const { productId } = req.params;
    await deleteProduct(productId);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
}

/**
 * Increment stock by 1
 * PATCH /api/products/:productId/increment
 */
async function incrementStockController(req, res) {
  try {
    const { productId }     = req.params;
    const updatedProduct    = await incrementStock(productId);
    return res.status(200).json({
      message: "Quantity incremented successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Decrement stock by 1
 * PATCH /api/products/:productId/decrement
 */
async function decrementStockController(req, res) {
  try {
    const { productId }     = req.params;
    const updatedProduct    = await decrementStock(productId);
    return res.status(200).json({
      message: "Quantity decremented successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Approve a comment
 * PUT /api/comments/:commentId/approve
 */
async function approveCommentController(req, res) {
  try {
    const { commentId }      = req.params;
    const updatedComment     = await approveComment(commentId);
    return res.status(200).json({
      message: "Comment approved successfully",
      comment: updatedComment,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Reject a comment
 * PUT /api/comments/:commentId/reject
 */
async function rejectCommentController(req, res) {
  try {
    const { commentId }      = req.params;
    const updatedComment     = await rejectComment(commentId);
    return res.status(200).json({
      message: "Comment rejected successfully",
      comment: updatedComment,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Search products by name or description
 * GET /api/products/search?query=...
 */
async function searchProductsController(req, res) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }
    const results = await searchProducts(query);
    if (!results.length) {
      return res.status(404).json({ message: "No products found." });
    }
    return res
      .status(200)
      .json({ message: "Products retrieved successfully", products: results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * Get all products (with optional category & sort)
 * GET /api/products?category=...&sort=...
 */
async function getProductsController(req, res) {
  try {
    const { category, sort } = req.query;
    const products = await getProducts({
      categoryFilter: category,
      sortMethod:     sort,
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
  getProductsController,
};