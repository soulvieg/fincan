const User = require("../models/User");
const Admin = require("../models/Admin");

/**
 * Promote a user to an admin (product/sales) with a specified role.
 */
async function promoteUserToAdmin(userId, role) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const existingAdmin = await Admin.findByPk(userId);
  if (existingAdmin) throw new Error("User is already an admin");
  await Admin.create({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password, // retain existing password
    role: role,
  });
  // Delete the user record after promoting
  await user.destroy();
  return { message: `User promoted to ${role} and removed from users.` };
}

/**
 * Demote an admin back to customer
 */
async function demoteAdminToUser(adminId) {
  const admin = await Admin.findByPk(adminId);
  if (!admin) throw new Error("Admin not found");

  // Ensure the user exists in the User table
  const userExists = await User.findByPk(adminId);
  if (!userExists) {
    await User.create({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      password: admin.password,
    });
  }

  await admin.destroy();
  return { message: "Admin demoted to customer" };
}

/**
 * Promote a customer to overseeing admin
 */
async function promoteToOverseeingAdmin(userId) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const existing = await Admin.findOne({
    where: {
      id: userId,
      role: "overseeingAdmin" // Ensure the role matches "overseeingAdmin"
    }
  });
  if (existing) throw new Error("User is already an overseeing admin");

  await Admin.create({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role:'overseeingAdmin'
  });
  await user.destroy();
  return { message: "User promoted to Overseeing Admin" };
}

/**
 * Promote an existing admin (sales or product manager) to Overseeing Admin.
 * This assumes the Admin already exists and is valid.
 */
async function changeAdminRole(adminId, newRole) {
  const admin = await Admin.findByPk(adminId);
  if (!admin) throw new Error("Admin not found");

  if(newRole !== "salesManager" && newRole !== "productManager") throw new Error("Invalid Role");
  
  admin.role = newRole;
  await admin.save();  
  return { message: "Admin promoted to Overseeing Admin" };
}



/**
 * Promote an existing admin (sales or product manager) to Overseeing Admin.
 * This assumes the Admin already exists and is valid.
 */
async function promoteAdminToOverseeingAdmin(adminId) {
  const admin = await Admin.findByPk(adminId);
  if (!admin) throw new Error("Admin not found");

  admin.role = 'overseeingAdmin';
  await admin.save();  
  return { message: "Admin promoted to Overseeing Admin" };
}

/**
 * List all users
 */
async function listAllUsers() {
  return await User.findAll();
}

/**
 * List all admins
 */
async function listAllAdmins() {
  return await Admin.findAll();
}

/**
 * List all overseeing admins
 */
async function listAllOverseeingAdmins() {
  try {
    // Find all admins with the role "overseeingAdmin"
    const overseeingAdmins = await Admin.findAll({
      where: {
        role: "overseeingAdmin" // Filter for admins with the "overseeingAdmin" role
      }
    });

    return overseeingAdmins;
  } catch (error) {
    console.error("Error fetching overseeing admins:", error);
    throw error;
  }
}

/* category search for role*/

const { Op } = require("sequelize");
const User = require("../models/User");
const Admin = require("../models/Admin");

async function findEntitiesByRole(role) {
  switch (role) {
    case "customer":
      // all users
      return await User.findAll({
        attributes: [ "id", "firstName", "lastName", "email", "homeAddress", "userType" ]
      });

    case "salesManager":
    case "productManager":
    case "overseeingAdmin":
      // only admins with exactly that role
      return await Admin.findAll({ where: { role } });

    case "admin":
      // shorthand for both salesManager + productManager (if you want)
      return await Admin.findAll({
        where: { role: { [Op.in]: ["salesManager", "productManager"] } }
      });

    default:
      throw new Error(`Unknown role: ${role}`);
  }
}



module.exports = {
  promoteUserToAdmin,
  demoteAdminToUser,
  promoteToOverseeingAdmin,
  changeAdminRole,
  promoteAdminToOverseeingAdmin,
  listAllUsers,
  listAllAdmins,
  listAllOverseeingAdmins,
  findEntitiesByRole,
};

