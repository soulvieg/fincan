const express = require("express");
const authorizeOverseeingAdmin = require("../middlewares/authorizeOverseeingAdmin"); // Import middleware
const {
  promoteUserController,
  promoteAdminController,
  demoteAdminToUserController,
  changeAdminRoleController,
  getAllAdminsController,
  getAllUsersController,
  getAllOverseeingAdminsController,
  demoteOverseeingAdminController,
} = require("../controllers/overseeingAdminController");

const router = express.Router();

// Apply the middleware to all routes for overseeing admins
router.use(authorizeOverseeingAdmin); // Protect all routes below with middleware

// Promote a user to an admin (sales/product manager)
router.post("/promote-user", promoteUserController);

// Promote an existing admin to overseeing admin
router.post("/promote-admin", promoteAdminController);

// Demote admin
router.post("/demote-admin", demoteAdminToUserController);

// Change role of an existing admin
router.put("/change-role", changeAdminRoleController);

// Get all admins
router.get("/admins", getAllAdminsController);

// Get all users (customers)
router.get("/users", getAllUsersController);

// Get all overseeing admins
router.get("/", getAllOverseeingAdminsController);

// Demote an overseeing admin
router.post("/demote", demoteOverseeingAdminController);

module.exports = router;

