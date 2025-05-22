// backend/models/Product.js
const { DataTypes } = require("sequelize");
const sequelize     = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    /* ───────────────────────── primary key ─────────────────────────── */
    product_id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true,
      field:         "product_id",
    },

    /* ───────────────────────── foreign keys / basic info ───────────── */
    category_id: {
      type:      DataTypes.INTEGER,
      allowNull: true,          // matches table definition (NULL allowed)
      field:     "category_id",
    },
    sku:            { type: DataTypes.STRING(50),  field: "sku"            },
    name:           { type: DataTypes.STRING(255), allowNull:false, field:"name" },
    model:          { type: DataTypes.STRING(255), field: "model"          },
    serial_number:  { type: DataTypes.STRING(255), field: "serial_number"  },
    description:    { type: DataTypes.TEXT,        field: "description"    },

    /* ───────────────────────── inventory & pricing ─────────────────── */
    quantity_in_stock: {
      type:         DataTypes.INTEGER,
      allowNull:    false,
      defaultValue: 0,
      field:        "quantity_in_stock",
    },
    price: {
      type:      DataTypes.DECIMAL(10,2),
      allowNull: false,
      field:     "price",
    },

    /* NEW – fractional discount (0 ≤ discount ≤ 1)  —────────────────── */
    discount: {
      type:         DataTypes.DECIMAL(3,2),
      allowNull:    false,
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 1,
      },
      field: "discount",
    },

    /* ───────────────────────── misc. fields ────────────────────────── */
    warranty_status: { type: DataTypes.STRING(100), field: "warranty_status" },
    distributor_info:{ type: DataTypes.STRING(512), field: "distributor_info"},
    image_url:       { type: DataTypes.STRING(512), field: "image_url"       },

    is_best_seller: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: false,
      field:        "is_best_seller",
    },
  },
  {
    tableName:  "Products",
    timestamps: false,
  }
);

module.exports = Product;