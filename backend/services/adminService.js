// services/adminService.js
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Admin = require("../models/Admin");
const Order = require("../models/Order");
const Product = require("../models/Product");

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

/**
 * Generate sales report for a given date range.
 * Revenue is calculated as product.price * order.quantity.
 * Cost defaults to 50% of revenue.
 * Profit/Loss is revenue minus cost.
 *
 * @param {object} params - { startDate, endDate }
 * @returns {object} - { totalRevenue, totalCost, profitOrLoss, startDate, endDate }
 */
async function getSalesReport({ startDate, endDate }) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Find orders with status "delivered" within the date range.
  const orders = await Order.findAll({
    where: {
      createdAt: { [Op.between]: [start, end] },
      status: "delivered",
    },
  });
  
  let totalRevenue = 0;
  let totalCost = 0;
  
  // For each order, retrieve the product to get its price and compute totals.
  for (const order of orders) {
    const product = await Product.findByPk(order.productId);
    if (product) {
      const salePrice = product.price;
      const orderRevenue = salePrice * order.quantity;
      totalRevenue += orderRevenue;
      totalCost += 0.5 * orderRevenue; // cost defaults to 50% of revenue
    }
  }
  
  const profitOrLoss = totalRevenue - totalCost;
  
  return {
    totalRevenue,
    totalCost,
    profitOrLoss,
    startDate,
    endDate,
  };
}

module.exports = {
  registerAdmin,
  loginAdmin,
  getSalesReport,
};
