// backend/models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "product_id",
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "category_id",
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "sku",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "name",
    },
    model: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "model",
    },
    serial_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "serial_number",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "description",
    },
    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "quantity_in_stock",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "price",
    },
    warranty_status: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "warranty_status",
    },
    distributor_info: {
      type: DataTypes.STRING(512),
      allowNull: true,
      field: "distributor_info",
    },
    image_url: {
      type: DataTypes.STRING(512),
      allowNull: true,
      field: "image_url",
    },
    is_best_seller: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_best_seller",
    },
    // if you later add a rating column, define it here; for now it's computed
  },
  {
    tableName: "Products",
    timestamps: false,
  }
);

module.exports = Product;