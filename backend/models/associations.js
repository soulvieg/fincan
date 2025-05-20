// models/associations.js
const User     = require("./User");
const Order    = require("./Order");
const Product  = require("./Product");
const Card     = require("./Card");
const Rating   = require("./Rating");
const Comment  = require("./Comment");
const Category = require("./Category");

// User ↔ Order
User.hasMany(Order,   { foreignKey: "customer_id" });
Order.belongsTo(User, { foreignKey: "customer_id" });

// Order ↔ Product
Order.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany( Order,   { foreignKey: "product_id" });

// User ↔ Card
User.hasOne(Card,       { foreignKey: "customer_id", as: "card" });
Card.belongsTo(User,   { foreignKey: "customer_id" });

// Ratings ↔ User, Product
User.hasMany(Rating,   { foreignKey: "customer_id" });
User.hasMany(Rating,   { foreignKey: "manager_id" });
Product.hasMany(Rating,{ foreignKey: "product_id" });
Rating.belongsTo(User,   { foreignKey: "customer_id", as: "Customer" });
Rating.belongsTo(User,   { foreignKey: "manager_id", as: "Manager" });
Rating.belongsTo(Product,{ foreignKey: "product_id" });

// Comments ↔ User, Product
User.hasMany(Comment,   { foreignKey: "customer_id" });
User.hasMany(Comment,   { foreignKey: "manager_id" });
Product.hasMany(Comment,{ foreignKey: "product_id" });
Comment.belongsTo(User,   { foreignKey: "customer_id", as: "Customer" });
Comment.belongsTo(User,   { foreignKey: "manager_id", as: "Manager" });
Comment.belongsTo(Product,{ foreignKey: "product_id" , as: "Product"});

// Product ↔ Category
Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });