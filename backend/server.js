// server.js
require('dotenv').config(); 

const express = require("express");
const session = require("express-session");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes"); // Import user routes
const adminRoutes = require("./routes/adminRoutes"); // Import admin routes
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const overseeingAdminRoutes = require("./routes/overseeingAdminRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const authRoutes = require("./routes/authRoutes");

const sequelize = require("./config/db"); // Import the Sequelize instance

const app = express();
const PORT = process.env.PORT || 5000;

// Session middleware configuration
app.use(
  session({
    secret: "TesterKey", // Secret key used for signing the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
      secure: false, // Set to true if using https (not needed in development with http)
      httpOnly: true, // Prevent client-side JavaScript from accessing session cookie
      maxAge: 1000 * 60 * 60 * 24, // Set cookie expiration (1 day here)
    },
  })
);

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost", "http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

// Product Routes
app.use("/api/products", productRoutes);

// Review Routes
app.use("/api/products", reviewRoutes);

// User Routes
app.use("/api/users", userRoutes);

// Admin Routes
app.use("/api/admins", adminRoutes);

app.use("/api/admins/overseeing", overseeingAdminRoutes);

// Order Routes
app.use("/api/orders", orderRoutes);

// Cart Routes
app.use("/api/cart", cartRoutes);

// Wishlist routes
app.use("/api/wishlist", wishlistRoutes);

// Synchronize models and then start the server
// DB Sync and Auto-increment setup
sequelize
  .sync()
  .then(async () => {
    // Set starting ID for Users table
    await sequelize.query("ALTER TABLE Users AUTO_INCREMENT = 1000;"); // Users => Customers 
    console.log("Database synced and User ID auto-increment set to 1000");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database sync error:", err);
  });
