// services/productService.js
const { Op, fn, col, literal } = require("sequelize");
const Product                  = require("../models/Product");
const Rating                   = require("../models/Rating");

/**
 * Add a new product
 */
async function addProduct(data) {
  return await Product.create({
    category_id:       data.category_id,
    sku:               data.sku,
    name:              data.name,
    model:             data.model,
    serial_number:     data.serial_number,
    description:       data.description,
    quantity_in_stock: data.quantity_in_stock,
    price:             data.price,
    warranty_status:   data.warranty_status,
    distributor_info:  data.distributor_info,
    image_url:         data.image_url,
    is_best_seller:    data.is_best_seller || false,
  });
}

/**
 * Fetch products with optional category filter, sorting,
 * and include average approved rating.
 */
async function getProducts({ categoryFilter = "All", sortMethod = "default" }) {
  const where = {};
  if (categoryFilter !== "All") {
    if (categoryFilter === "Best Sellers") {
      where.is_best_seller = true;
    } else {
      where.category_id = categoryFilter;
    }
  }

  // build ORDER clause
  const order = [];
  switch (sortMethod) {
    case "priceAsc":
      order.push(["price", "ASC"]);
      break;
    case "priceDesc":
      order.push(["price", "DESC"]);
      break;
    case "ratingDesc":
      order.push([literal("rating"), "DESC"]);
      break;
    default:
      order.push(["product_id", "DESC"]);
  }

  const products = await Product.findAll({
    where,
    attributes: {
      include: [
        // average of only approved Ratings.score
        [fn("AVG", col("Ratings.score")), "rating"],
      ],
    },
    include: [
      {
        model:      Rating,
        attributes: [],
        where:      { approval: true },
        required:   false, // still include products with zero reviews
      },
    ],
    group: ["Product.product_id"],
    order,
  });

  return products.map(p => {
    const plain = p.get({ plain: true });
    return {
      ...plain,
      // coerce to JS numbers
      rating:            plain.rating !== null ? parseFloat(plain.rating) : null,
      price:             parseFloat(plain.price),
      quantity_in_stock: Number(plain.quantity_in_stock),
    };
  });
}

/**
 * Update the quantity in stock of a product
 */
async function updateProductQuantity(productId, newQuantity) {
  const p = await Product.findByPk(productId);
  if (!p) throw new Error("Product not found");
  p.quantity_in_stock = newQuantity;
  await p.save();
  return p;
}

async function incrementStock(productId) {
  const p = await Product.findByPk(productId);
  if (!p) throw new Error("Product not found");
  p.quantity_in_stock += 1;
  await p.save();
  return p;
}

async function decrementStock(productId) {
  const p = await Product.findByPk(productId);
  if (!p) throw new Error("Product not found");
  if (p.quantity_in_stock === 0) throw new Error("Stock already at zero");
  p.quantity_in_stock -= 1;
  await p.save();
  return p;
}

/**
 * Search products by name or description (case-insensitive)
 */
async function searchProducts(query) {
  const likePattern = `%${query}%`;
  return await Product.findAll({
    where: {
      [Op.or]: [
        { name:        { [Op.iLike]: likePattern } },
        { description: { [Op.iLike]: likePattern } },
      ],
    },
  });
}

/**
 * Delete a product by ID
 */
async function deleteProduct(productId) {
  const count = await Product.destroy({ where: { product_id: productId } });
  if (!count) throw new Error("Product not found");
  return true;
}

module.exports = {
  addProduct,
  getProducts,
  updateProductQuantity,
  deleteProduct,
  incrementStock,
  decrementStock,
  searchProducts,
};