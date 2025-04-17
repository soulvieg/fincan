// routes/cartRoutes.js
const express = require("express");
const {
  addToCartController,
  getCartController,
  mergeCartController,
} = require("../controllers/cartController");

const router = express.Router();

// POST /api/cart
router.post("/", addToCartController);

// GET /api/cart
router.get("/", getCartController);

// Merge guest cart into user cart
router.post("/merge", mergeCartController);

module.exports = router;
