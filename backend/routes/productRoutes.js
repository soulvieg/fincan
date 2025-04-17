// routes/productRoutes.js
const express = require("express");
const { updateQuantityInStockController,
        addProductController,
        deleteProductController,
        incrementStockController,
        decrementStockController,
        approveCommentController,
        rejectCommentController,
        searchProductsController,
     } = require("../controllers/productController");

const router = express.Router();

// POST /api/products - Add a new product
router.post("/", addProductController);

// PUT /api/products/:productId/quantity
router.put("/:productId/quantity", updateQuantityInStockController);

// DELETE /api/products/:productId - Delete a product
router.delete("/:productId", deleteProductController);

// GET /api/products/search?query=coffee
router.get("/search", searchProductsController);

// PATCH /api/products/:productId/increment
router.patch('/:productId/increment', incrementStockController);

// PATCH /api/products/:productId/decrement
router.patch('/:productId/decrement', decrementStockController);

// PUT /api/comments/:commentId/approve - Approve a comment
router.put("/comments/:commentId/approve", approveCommentController);

// PUT /api/comments/:commentId/reject - Reject a comment
router.put("/comments/:commentId/reject", rejectCommentController);

module.exports = router;
