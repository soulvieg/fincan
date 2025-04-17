const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin"); // Assuming Admin model includes overseeing admins

// POST /api/overseeing-admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if this is an overseeing admin
    if (admin.role !== "overseeing_admin") {
      return res.status(403).json({ message: "Not authorized as overseeing admin" });
    }

    // NOTE: In a real app you'd check hashed passwords!
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Store admin info in session
    req.session.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    res.status(200).json({ message: "Login successful", admin: req.session.admin });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

