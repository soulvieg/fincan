// routes/productRoutes.js
const express = require("express");
const { updateQuantityInStockController,
        addProductController,
        deleteProductController} = require("../controllers/productController");

const router = express.Router();

// POST /api/products - Add a new product
router.post("/", addProductController);

// PUT /api/products/:productId/quantity
router.put("/:productId/quantity", updateQuantityInStockController);

// DELETE /api/products/:productId - Delete a product
router.delete("/:productId", deleteProductController);

module.exports = router;
