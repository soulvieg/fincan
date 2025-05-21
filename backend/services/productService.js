// backend/services/productService.js
const { Op, fn, col, literal } = require("sequelize");
const Product                  = require("../models/Product");
const Rating                   = require("../models/Rating");
const Category                 = require("../models/Category");

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
 *
 * Returns each product with `price` as a Number and `rating` as a Number|null.
 */
async function getProducts({ categoryFilter = "All", sortMethod = "default" }) {
  const where = {};

  // filtering
  if (categoryFilter !== "All") {
    if (categoryFilter === "Best Sellers") {
      where.is_best_seller = true;
    } else {
      where.category_id = categoryFilter;
    }
  }

  // sorting
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

  // pull in avg rating
  const rows = await Product.findAll({
    where,
    attributes: {
      include: [
        [fn("AVG", col("Ratings.score")), "rating"]
      ],
    },
    include: [
      {
        model:      Rating,
        attributes: [],            // we only want the aggregate
        where:      { approval: true },
        required:   false,         // still include products w/o ratings
      },
    ],
    group: ["Product.product_id"],
    order,
  });

  // map to plain objects, coercing DECIMAL/string fields to numbers
  return rows.map(r => {
    const p = r.get({ plain: true });
    return {
      ...p,
      price:   parseFloat(p.price),               // DECIMAL -> number
      rating:  p.rating !== null ? parseFloat(p.rating) : null,
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
  const pattern = `%${query}%`;
  const rows = await Product.findAll({
    where: {
      [Op.or]: [
        { name:        { [Op.like]: pattern } },
        { description: { [Op.like]: pattern } },
      ],
    },
  });

  // also coerce price here
  return rows.map(r => {
    const p = r.get({ plain: true });
    return {
      ...p,
      price: parseFloat(p.price),
    };
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

async function updateProductImage(productId, imageUrl) {
  const p = await Product.findByPk(productId);
  if (!p) throw new Error("Product not found");
  p.image_url = imageUrl;
  await p.save();
  return p;
}

async function addCategory(name) {
  if (!name || typeof name !== "string") {
    throw new Error("Category name is required");
  }
  // optional duplicate check
  const exists = await Category.findOne({ where: { name } });
  if (exists) {
    throw new Error("Category already exists");
  }
  return await Category.create({ name });
}

module.exports = {
  addProduct,
  getProducts,
  updateProductQuantity,
  incrementStock,
  decrementStock,
  searchProducts,
  deleteProduct,
  updateProductImage,
  addCategory,
};