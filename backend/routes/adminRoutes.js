// routes/adminRoutes.js
const express = require("express");
const {
  signupAdminController,
  loginAdminController,
} = require("../controllers/adminController");

const router = express.Router();

// POST /api/admins/signup
router.post("/signup", signupAdminController);

// POST /api/admins/login
router.post("/login", loginAdminController);

module.exports = router;
