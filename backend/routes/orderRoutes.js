const express = require("express");
const { checkPurchaseController,placeOrderController } = require("../controllers/purchaseController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// GET /api/orders/check-purchase?userId=...&productId=...
router.get("/check-purchase", checkPurchaseController);
router.post("/",authenticate,placeOrderController);

module.exports = router;
