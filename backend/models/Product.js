const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Product Model
 *
 * Required fields (from the project specs):
 * - id:                Primary key, auto-increment
 * - name:              Name of the product
 * - model:             Model name/number
 * - serialNumber:      Unique serial number
 * - description:       Description of the product
 * - quantityInStock:   Current stock quantity
 * - price:             Product price
 * - warrantyStatus:    Warranty details/status
 * - distributor:       Distributor information
 */
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  serialNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Typically, serial numbers are unique
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  quantityInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },

  warrantyStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    // e.g. "1 year", "2 years", "Lifetime", etc.
  },

  distributor: {
    type: DataTypes.STRING,
    allowNull: true,
    // Alternatively, you could have a "distributorId" if you keep distributor info in another table
  },
});

module.exports = Product;
