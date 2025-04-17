// services/adminService.js
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const User = require("../models/User");

/**
 * Create/register a new admin
 * @param {object} adminData - An object containing admin info (name, email, password, role)
 * @returns {object} - The newly created admin
 * @throws {Error} - If email is already taken or other issues occur
 */
async function registerAdmin(adminData) {
  const { name, email, password, role } = adminData;

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ where: { email } });
  if (existingAdmin) {
    throw new Error("Admin with this email already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the admin
  const newAdmin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    role, // "productManager" or "salesManager"
  });

  return newAdmin;
}

/**
 * Login an admin
 * @param {object} credentials - An object containing { email, password }
 * @returns {object} - The logged-in admin data (minus password) or throws error if invalid
 * @throws {Error} - If admin not found or password mismatch
 */
async function loginAdmin(credentials) {
  const { email, password } = credentials;

  // Find admin by email
  const admin = await Admin.findOne({ where: { email } });
  if (!admin) {
    throw new Error("Invalid email or password.");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

    
  // Return admin data (omit the password field)
  const { id, name, role } = admin;
  return { id, name, email, role };
}





module.exports = {
  registerAdmin,
  loginAdmin,
};
