// backend/routes/orderRoutes.js
const express = require("express");
const {
  getOrdersController,
  placeOrderController,
  updateOrderStatusController,
  cancelOrderController,
  markOrderDeliveredController,
  requestRefundController,
  updateRefundStatusController,

  getRefundStatusController,
} = require("../controllers/purchaseController");

const router = express.Router();

router.get("/", getOrdersController);
router.post("/", placeOrderController);
router.patch("/:orderId/status",        updateOrderStatusController);
router.patch("/:orderId/cancel",        cancelOrderController);
router.patch("/:orderId/mark-delivered",markOrderDeliveredController);

// Refund endpoints
router.patch("/:orderId/refund-request",    requestRefundController);
router.patch("/:orderId/refund-status",     updateRefundStatusController);
router.get  ("/:orderId/refund",           getRefundStatusController);

module.exports = router;