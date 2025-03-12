// routes/userRoutes.js
const express = require("express");
const {
  signupController,
  loginController,
} = require("../controllers/userController");

const router = express.Router();

// POST /api/users/signup
router.post("/signup", signupController);

// POST /api/users/login
router.post("/login", loginController);

module.exports = router;

