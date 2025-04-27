// routes/userRoutes.js
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

// public
router.post("/signup", signupController);
router.post("/login", loginController);

// protected
router.use(authenticate);
router.get("/me", getMeController);
router.get("/:id/profile", getUserProfileController);
router.put("/:id/profile", updateUserProfileController);

module.exports = router;