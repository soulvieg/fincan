// models/associations.js
const User = require("./User");
const Order = require("./Order");
const Product = require("./Product");
const Card = require("./Card")

// Define associations after models are imported
User.hasMany(Order, { foreignKey: "customer_id" });
Order.belongsTo(User, { foreignKey: "customer_id" });

Order.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Order, { foreignKey: "product_id" });

// One user → one card
User.hasOne(Card, { foreignKey: "customer_id", as: "card" });
Card.belongsTo(User, { foreignKey: "customer_id" });