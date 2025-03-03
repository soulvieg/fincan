// services/productService.js
const Product = require("../models/Product");

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

module.exports = {
  updateProductQuantity,
};
