// server.js
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");     // Import user routes
const adminRoutes = require("./routes/adminRoutes");     // Import admin routes
const sequelize = require("./config/db");                // Import the Sequelize instance

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Product Routes
app.use("/api/products", productRoutes);

// User Routes
app.use("/api/users", userRoutes);

// Admin Routes
app.use("/api/admins", adminRoutes);

// Synchronize models and then start the server
sequelize
  .sync() // Optionally, use options like { force: false } or { alter: true }
  .then(() => {
    console.log("Database synchronized!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB sync error:", err);
  });