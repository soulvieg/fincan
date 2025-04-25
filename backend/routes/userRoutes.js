// routes/userRoutes.js
const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  signupController,
  loginController,
  getUserProfileController,
  updateUserProfileController,
} = require("../controllers/userController");

const router = express.Router();

// POST /api/users/signup
router.post("/signup", signupController);

// POST /api/users/login
router.post("/login", loginController);

router.use(authenticate);

// GET /api/users/:id/profile
router.get("/:id/profile", getUserProfileController);

// PUT /api/users/:id/profile
router.put("/:id/profile", updateUserProfileController);

module.exports = router;
