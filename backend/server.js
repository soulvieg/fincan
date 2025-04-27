// server.js
require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const session = require("express-session");

const cartRoutes      = require("./routes/cartRoutes");
const userRoutes      = require("./routes/userRoutes");
const categoryRoutes  = require("./routes/categoryRoutes");
const productRoutes   = require("./routes/productRoutes");
const reviewRoutes    = require("./routes/reviewRoutes");
const orderRoutes     = require("./routes/orderRoutes");       // ← import order routes
// … import your other routes here …

const sequelize = require("./config/db");

// Load all of your models so associations get registered
require("./models/User");
require("./models/Category");
require("./models/Product");
require("./models/Card");
require("./models/Order");
require("./models/cartItem");
require("./models/Rating");
require("./models/Comment");
// …any other models…

// Wire up associations
require("./models/associations");

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Fail fast if SESSION_SECRET missing ----
if (!process.env.SESSION_SECRET) {
  console.error("❌  SESSION_SECRET is not defined. Add it to your .env");
  process.exit(1);
}

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// ---- Session middleware (needs a secret) ----
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS-only in prod
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ---- Mount your routes ----
app.use("/api/users",      userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products",   productRoutes);
app.use("/api/cart",       cartRoutes);
app.use("/api/products",   reviewRoutes);
app.use("/api/orders",     orderRoutes);

// ---- Sync & start ----
sequelize
  .sync()
  .then(() => {
    console.log("✔️  Database synced");
    app.listen(PORT, () => console.log(`🚀  Listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌  Database sync error:", err);
  });