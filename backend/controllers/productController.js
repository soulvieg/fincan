// controllers/productController.js
const {
  addProduct,
  updateProductQuantity,
  deleteProduct,
  incrementStock,
  decrementStock,
  searchProducts,
  getProducts,
  updateProductImage,
  addCategory,
  updateProductPrice,
  updateProductDiscount,
  fetchProductDiscount,
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

async function updateImageController(req, res) {
  try {
    const { productId } = req.params;
    const { image_url } = req.body;
    if (typeof image_url !== "string" || !image_url) {
      return res.status(400).json({ message: "Invalid or missing image_url" });
    }
    const updated = await updateProductImage(Number(productId), image_url);
    return res.status(200).json({ product: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function addCategoryController(req, res) {
  try {
    const { name } = req.body;
    const newCat   = await addCategory(name);
    return res.status(201).json(newCat);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}


/**
 * Set the price of a product
 * PATCH /api/products/:productId/price
 */
async function updatePriceController(req, res) {
  try {
    const { productId } = req.params;
    const price         = Number(req.body.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ message: "Invalid price." });
    }
    const updated = await updateProductPrice(Number(productId), price);
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


/**
 * PATCH /api/products/:productId/discount
 * body: { discount: 0-1 }
 */
async function updateProductDiscountController(req, res) {
  try {
    const productId = Number(req.params.productId);
    const { discount } = req.body;

    const updated = await updateProductDiscount(productId, discount);
    return res.status(200).json({
      product_id: updated.product_id,
      discount:   Number(updated.discount),
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

/**
 * GET /api/products/:productId/discount
 * → { product_id, discount }
 */
async function getProductDiscountController(req, res) {
  try {
    const productId = Number(req.params.productId);
    const discount  = await fetchProductDiscount(productId);

    return res.json({ product_id: productId, discount });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

/* 👉 don’t forget to export */
module.exports = {
  /* …existing exports… */
  updateProductDiscountController,
  getProductDiscountController,
};


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
  updateImageController,
  addCategoryController,
  updatePriceController,
  updateProductDiscountController,
  getProductDiscountController,
};