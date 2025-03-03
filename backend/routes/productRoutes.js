// routes/productRoutes.js
const express = require("express");
const { updateQuantityInStockController } = require("../controllers/productController");

const router = express.Router();

// PUT /api/products/:productId/quantity
router.put("/:productId/quantity", updateQuantityInStockController);

module.exports = router;
