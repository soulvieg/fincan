// backend/routes/userRoutes.js
const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  signupController,
  loginController,
  getMeController,
  getUserProfileController,
  updateUserProfileController,
} = require("../controllers/userController");

const router = express.Router();

// Public routes
router.post("/signup", signupController);
router.post("/login", loginController);

// Everything below requires a valid JWT
router.use(authenticate);

// “Who am I?” endpoint
router.get("/me", getMeController);

// Profile by ID
router.get("/:id/profile", getUserProfileController);
router.put("/:id/profile", updateUserProfileController);

module.exports = router;