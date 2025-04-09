// routes/adminRoutes.js
const express = require("express");
const {
  signupAdminController,
  loginAdminController,
  getSalesReportController,
} = require("../controllers/adminController");

const router = express.Router();

// POST /api/admins/signup
router.post("/signup", signupAdminController);

// POST /api/admins/login
router.post("/login", loginAdminController);

// Sales report endpoint
router.get("/salesReport", getSalesReportController);

module.exports = router;
