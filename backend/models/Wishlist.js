// models/Wishlist.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      field: "whishlist_id", // Note: "whishlist" is misspelled in your table name. Fix to "wishlist" if needed.
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "customer_id",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "product_id",
    },
  },
  {
    tableName: "Wishlists",
    timestamps: false,
  }
);

// Optional: define associations if needed
// Wishlist.belongsTo(Customer, { foreignKey: "customerId" });
// Wishlist.belongsTo(Product, { foreignKey: "productId" });

module.exports = Wishlist;

