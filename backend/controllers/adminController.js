// controllers/adminController.js
const { getSalesReport } = require("../services/adminService");
/**
 * Controller to handle admin signup
 * @route POST /api/admins/signup
 */
/*
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
    if (!["productManager", "salesManager","overseeingAdmin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be either 'productManager' or 'salesManager' or 'overseeingAdmin'.",
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
*/

/**
 * Controller to handle admin login
 * @route POST /api/admins/login
 */
/*
async function loginAdminController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const adminData = await loginAdmin({ email, password });
    
    req.session.admin = {
      id: adminData.id,
      name: adminData.name,
      email: adminData.email,
      role: adminData.role, // This is crucial
    };
    console.log("Logged in as:", adminData.role);
    return res.status(200).json({
      message: "Login successful",
      admin: adminData,
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}
*/
/**
  * Controller to generate sales report.
  * Expects query parameters: startDate and endDate.
  * @route GET /api/admins/salesReport
  */
async function getSalesReportController(req, res) {
  try {

    //Check if user is logged in AND is a sales manager
    if (!req.session.user || req.session.user.userType !== "salesManager") {
      return res.status(403).json({ message: "Access denied. Sales managers only." });
    }
    
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Both startDate and endDate query parameters are required." });
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
  getSalesReportController,
};
