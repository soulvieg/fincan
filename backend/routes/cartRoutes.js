// routes/cartRoutes.js
const express = require("express");
const {
  addToCartController,
  getCartController,
} = require("../controllers/cartController");

const router = express.Router();

// POST /api/cart
router.post("/", addToCartController);

// GET /api/cart
router.get("/", getCartController);

module.exports = router;
