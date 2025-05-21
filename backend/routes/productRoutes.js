// routes/productRoutes.js
const express = require("express");
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
  updateImageController
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

// Delete
router.delete("/:productId", deleteProductController);

// Comment moderation
router.put("/comments/:commentId/approve", approveCommentController);
router.put("/comments/:commentId/reject", rejectCommentController);

//image upload
router.patch("/:productId/image", updateImageController);

router.post("/categories", addCategoryController);

module.exports = router;