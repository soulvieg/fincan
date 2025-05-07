const { promoteUserToAdmin, changeAdminRole, promoteAdminToOverseeingAdmin, demoteOverseeingAdmin } = require("../services/overseeingAdminService");
const { getUserById } = require("../services/userService"); // if needed to view customer details
const Admin = require("../models/Admin");
const User = require("../models/User");

/**
 * Promote a user (customer) to an admin (sales or product manager)
 * @route POST /api/overseeing-admins/promote-user
 */
async function promoteUserController(req, res) {
  try {
    const { userId, role } = req.body;
    if (!["salesManager", "productManager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await promoteUserToAdmin(userId, role);
    res.status(200).json({ message: "User promoted to admin successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Promote an existing admin to overseeing admin
 * @route POST /api/overseeing-admins/promote-admin
 */
async function promoteAdminController(req, res) {
  try {
    const { adminId } = req.body;
    await promoteAdminToOverseeingAdmin(adminId);
    res.status(200).json({ message: "Admin promoted to Overseeing Admin successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


/**
 * Demote an admin back to a customer
 * @route POST /api/admins/overseeing/demote-admin
 */
async function demoteAdminToUserController(req, res) {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({ message: "adminId is required." });
    }

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Check if a user with same ID already exists
    const userExists = await User.findByPk(adminId);
    if (!userExists) {
      await User.create({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        password: admin.password,
        role: "customer",
        homeAddress: "Default Address" // Or require this as input if needed
      });
    }

    // Delete admin record
    await admin.destroy();

    return res.status(200).json({ message: "Admin demoted to customer successfully." });
  } catch (error) {
    console.error("Error demoting admin:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}


/**
 * Change the role of an existing admin
 * @route PUT /api/overseeing-admins/change-role
 */
async function changeAdminRoleController(req, res) {
  try {
    const { adminId, newRole } = req.body;

    if (!["salesManager", "productManager"].includes(newRole)) {
      return res.status(400).json({ message: "Invalid new role" });
    }

    await changeAdminRole(adminId, newRole);
    res.status(200).json({ message: "Admin role updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * View all admins
 * @route GET /api/overseeing-admins/admins
 */
async function getAllAdminsController(req, res) {
  try {
    const admins = await Admin.findAll();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
}

/**
 * View all users (customers)
 * @route GET /api/overseeing-admins/users
 */
async function getAllUsersController(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

/**
 * View all overseeing admins
 * @route GET /api/overseeing-admins
 */
async function getAllOverseeingAdminsController(req, res) {
  try {
    const overseers = await Admin.findAll({
      where: { role: 'overseeingAdmin' }
    });
    res.status(200).json(overseers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch overseeing admins" });
  }
}

/**
 * Demote an overseeing admin back to regular admin
 * @route POST /api/overseeing-admins/demote
 */
async function demoteOverseeingAdminController(req, res) {
  try {
    const { overseerId, role } = req.body;
    if (!["salesManager", "productManager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await demoteOverseeingAdmin(overseerId, role);
    res.status(200).json({ message: "Overseeing admin demoted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// controllers/overseeingAdminController.js
const {
  // … other service functions …,
  findEntitiesByRole,
} = require("../services/overseeingAdminService");

/**
 * GET /api/overseeing-admins/search?role=<role>
 * → returns all customers or admins matching that role
 */
async function searchByRoleController(req, res) {
  try {
    const { role } = req.query;
    if (!role) {
      return res
        .status(400)
        .json({ message: "Please specify a `role` query parameter." });
    }

    const results = await findEntitiesByRole(role);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}



module.exports = {
  promoteUserController,
  demoteAdminToUserController,
  promoteAdminController,
  changeAdminRoleController,
  getAllAdminsController,
  getAllUsersController,
  getAllOverseeingAdminsController,
  demoteOverseeingAdminController,
  searchByRoleController,
};

