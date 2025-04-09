// controllers/adminController.js
const { registerAdmin, loginAdmin, getSalesReport } = require("../services/adminService");

/**
 * Controller to handle admin signup
 * @route POST /api/admins/signup
 */
async function signupAdminController(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields (name, email, password, role) are required." });
    }

    // role should be either 'productManager' or 'salesManager'
    if (!["productManager", "salesManager"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be either 'productManager' or 'salesManager'.",
      });
    }

    const newAdmin = await registerAdmin({ name, email, password, role });
    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * Controller to handle admin login
 * @route POST /api/admins/login
 */
async function loginAdminController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const adminData = await loginAdmin({ email, password });
    return res.status(200).json({
      message: "Login successful",
      admin: adminData,
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

/**
 * Controller to generate sales report.
 * Expects query parameters: startDate and endDate.
 * @route GET /api/admins/salesReport
 */
async function getSalesReportController(req, res) {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Both startDate and endDate query parameters are required." });
    }
    const report = await getSalesReport({ startDate, endDate });
    return res.status(200).json({
      message: "Sales report generated successfully",
      report,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  signupAdminController,
  loginAdminController,
  getSalesReportController,
};
