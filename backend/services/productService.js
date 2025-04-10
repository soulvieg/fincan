// services/productService.js
const { Op } = require("sequelize");
const Product = require("../models/Product");

/**
 * Add a new product
 * @param {object} productData - The product data to create
 * @returns {object} - The newly created product
 * @throws {Error} - If creation fails
 */
async function addProduct(productData) {
  try {
    const newProduct = await Product.create(productData);
    return newProduct;
  } catch (error) {
    throw new Error("Failed to add product: ${error.message}");
  }
}

/**
 * Update the quantity in stock of a product
 * @param {number} productId - The product's primary key
 * @param {number} newQuantity - The new quantity value
 * @returns {object} - The updated product
 * @throws {Error} - If product is not found or save fails
 */
async function updateProductQuantity(productId, newQuantity) {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  product.quantityInStock = newQuantity;
  await product.save();

  return product;
}

/**
 * Delete a product by ID
 * @param {number} productId - The product's primary key
 * @returns {boolean} - True if the product was deleted, false otherwise
 * @throws {Error} - If deletion fails
 */
async function deleteProduct(productId) {
  try {
    const result = await Product.destroy({
      where: { id: productId },
    });
    if (result === 0) {
      throw new Error("Product not found");
    }
    return true;
  } catch (error) {
    throw new Error("Failed to delete product: ${error.message}");
  }
}

async function incrementStock(productId) {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  product.quantityInStock += 1;
  await product.save();
  return product;
}

async function decrementStock(productId) {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.quantityInStock > 0) {
    product.quantityInStock -= 1;
    await product.save();
    return product;
  } else {
    throw new Error("Cannot decrement below zero");
  }
}

/**
 * Search products by name or description
 * @param {string} query - The search query string.
 * @returns {Array} - List of matching products.
 * @throws {Error} - If search fails.
 */
async function searchProducts(query) {
  try {
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
    });
    return products;
  } catch (error) {
    throw new Error(`Failed to search products: ${error.message}`);
  }
}

module.exports = {
  addProduct,
  updateProductQuantity,
  deleteProduct,
  incrementStock,
  decrementStock,
  searchProducts,
};