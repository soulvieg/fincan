// backend/routes/orderRoutes.js
const express = require("express");
const {
  getOrdersController,
  placeOrderController,
  updateOrderStatusController,
  cancelOrderController,
} = require("../controllers/purchaseController");

const router = express.Router();

router.get("/", getOrdersController);
router.post("/", placeOrderController);
router.patch("/:orderId/status", updateOrderStatusController);
router.patch("/:orderId/cancel", cancelOrderController);

module.exports = router;