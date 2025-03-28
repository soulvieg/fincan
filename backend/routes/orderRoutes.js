const express = require("express");
const { checkPurchaseController } = require("../controllers/purchaseController");

const router = express.Router();

// GET /api/orders/check-purchase?userId=...&productId=...
router.get("/check-purchase", checkPurchaseController);

module.exports = router;
