const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    // 'id' in DB => 'id' in model
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      // If your DB column is actually AUTO_INCREMENT, include this:
      autoIncrement: true,
      field: "product_id", // <-- the actual DB column name
    },

    // 'category_id' in DB => 'category_id' in model
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // 'sku' in DB => 'sku' in model
    sku: {
      type: DataTypes.STRING(10),
      allowNull: true, // or false, up to you
    },

    // 'name' in DB => 'name' in model
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // 'description' in DB => 'description' in model
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // 'price' in DB => 'price' in model
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    // 'stock' in DB => 'stock' in model
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true, // or false if you want to require it
    },
  },
  {
    tableName: "Products", // EXACT table name in DB
    timestamps: false,
    // disable auto-createdAt/updatedAt columns
  }
);

module.exports = Product;
