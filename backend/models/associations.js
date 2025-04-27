// models/associations.js
const User = require("./User");
const Order = require("./Order");
const Product = require("./Product");
const Card = require("./Card");
const Rating = require("./Rating");
const Comment = require("./Comment");

// Define associations after models are imported
User.hasMany(Order, { foreignKey: "customer_id" });
Order.belongsTo(User, { foreignKey: "customer_id" });

Order.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Order, { foreignKey: "product_id" });

// One user → one card
User.hasOne(Card, { foreignKey: "customer_id", as: "card" });
Card.belongsTo(User, { foreignKey: "customer_id" });

// Associations for Ratings
User.hasMany(Rating, { foreignKey: "customer_id" });
User.hasMany(Rating, { foreignKey: "manager_id" });
Product.hasMany(Rating, { foreignKey: "product_id" });

Rating.belongsTo(User, { foreignKey: "customer_id", as: "Customer" });
Rating.belongsTo(User, { foreignKey: "manager_id", as: "Manager" });
Rating.belongsTo(Product, { foreignKey: "product_id" });

// Associations for Comments
User.hasMany(Comment, { foreignKey: "customer_id" });
User.hasMany(Comment, { foreignKey: "manager_id" });
Product.hasMany(Comment, { foreignKey: "product_id" });

Comment.belongsTo(User, { foreignKey: "customer_id", as: "Customer" });
Comment.belongsTo(User, { foreignKey: "manager_id", as: "Manager" });
Comment.belongsTo(Product, { foreignKey: "product_id" });