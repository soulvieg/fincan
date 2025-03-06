// server.js
const express = require("express");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");     // Import user routes
const adminRoutes = require("./routes/adminRoutes");     // Import admin routes

const app = express();

app.use(express.json()); // Parse JSON in requests

// Product Routes
app.use("/api/products", productRoutes);

// User Routes
app.use("/api/users", userRoutes);

// Admin Routes
app.use("/api/admins", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
