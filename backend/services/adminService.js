// services/adminService.js
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
// const OrderItem = require("../models/OrderItem");

/**
 * Create/register a new admin
 */
/*
async function registerAdmin(adminData) {
  const { name, email, password, role } = adminData;

  const existingAdmin = await Admin.findOne({ where: { email } });
  if (existingAdmin) {
    throw new Error("Admin with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return newAdmin;
}
*/
/**
 * Login an admin
 */
/*
async function loginAdmin(credentials) {
  const { email, password } = credentials;

  const admin = await Admin.findOne({ where: { email } });
  if (!admin) throw new Error("Invalid email or password.");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid email or password.");

  const { id, name, role } = admin;
  return { id, name, email, role };
}
*/
/**
 * Generate sales report
 */
async function getSalesReport({ startDate, endDate }) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const orders = await Order.findAll({
    where: {
      order_date: { [Op.between]: [start, end] },
      order_status: "delivered",
    },
  });

  let totalRevenue = 0;
  let totalCost = 0;

  for (const order of orders) {
    const orderItems = await OrderItem.findAll({
      where: { order_id: order.order_id },
    });

    for (const item of orderItems) {
      const product = await Product.findByPk(item.product_id);
      if (product) {
        const revenue = parseFloat(product.price) * item.quantity;
        const cost = revenue * 0.5;

        totalRevenue += revenue;
        totalCost += cost;
      }
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
  getSalesReport,
};
