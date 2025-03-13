// routes/productRoutes.js
const express = require("express");
const { updateQuantityInStockController,
        addProductController,
        deleteProductController,
        incrementStockController,
        decrementStockController } = require("../controllers/productController");

const router = express.Router();

// POST /api/products - Add a new product
router.post("/", addProductController);

// PUT /api/products/:productId/quantity
router.put("/:productId/quantity", updateQuantityInStockController);

// DELETE /api/products/:productId - Delete a product
router.delete("/:productId", deleteProductController);

// PATCH /api/products/:productId/increment
router.patch('/:productId/increment', incrementStockController);

// PATCH /api/products/:productId/decrement
router.patch('/:productId/decrement', decrementStockController);

module.exports = router;
