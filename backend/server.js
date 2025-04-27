// server.js
require('dotenv').config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");

const productRoutes         = require("./routes/productRoutes");
const reviewRoutes          = require("./routes/reviewRoutes");
const userRoutes            = require("./routes/userRoutes");
const adminRoutes           = require("./routes/adminRoutes");
const overseeingAdminRoutes = require("./routes/overseeingAdminRoutes");
const orderRoutes           = require("./routes/orderRoutes");
const cartRoutes            = require("./routes/cartRoutes");
const wishlistRoutes        = require("./routes/wishlistRoutes");

const sequelize = require("./config/db");

// Import models
require("./models/User");
require("./models/Product");
require("./models/Card");
require("./models/Order");  // ← load your new Order model
require("./models/cartItem");       // ← if you have a separate Cart model
// …any other models…

// Import associations (after all models)
require("./models/associations");

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());

// CORS
app.use(
  cors({
    origin: ["http://localhost", "http://localhost:3000"],
    credentials: true,
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "TesterKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Routes
app.use("/api/users",    userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products", reviewRoutes);
app.use("/api/admins",   adminRoutes);
app.use("/api/admins/overseeing", overseeingAdminRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Sync DB & start server
sequelize
  .sync()
  .then(async () => {
    await sequelize.query("ALTER TABLE Customers AUTO_INCREMENT = 1000;");
    console.log("Database synced; Customer ID auto-increment set to 1000");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database sync error:", err);
  });