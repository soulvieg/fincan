// routes/productRoutes.js
const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  addProductController,
  getProductsController,
  updateQuantityInStockController,
  deleteProductController,
  incrementStockController,
  decrementStockController,
  searchProductsController,
  approveCommentController,
  rejectCommentController,
  updateImageController,
  addCategoryController,
  updatePriceController,
} = require("../controllers/productController");

const router = express.Router();

// Create
router.post("/", addProductController);

// Read (all)
router.get("/", getProductsController);

// Search
router.get("/search", searchProductsController);

// Update quantity
router.put("/:productId/quantity", updateQuantityInStockController);

// Stock adjustments
router.patch("/:productId/increment", incrementStockController);
router.patch("/:productId/decrement", decrementStockController);

// Image upload
router.patch("/:productId/image", updateImageController);

// Add category
router.post("/categories", addCategoryController);

// Set price (no auth)
router.patch("/:productId/price", updatePriceController);


// Comment moderation
router.put("/comments/:commentId/approve", approveCommentController);
router.put("/comments/:commentId/reject", rejectCommentController);

// Delete
router.delete("/:productId", deleteProductController);

module.exports = router;
