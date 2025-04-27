// backend/services/orderService.js
const Order   = require("../models/Order");
const User    = require("../models/User");
const Product = require("../models/Product");

/**
 * Place a new order (group) for logged-in user.
 * @param {{ customer_id: number, products: { productId: number, quantity: number }[], paymentInfo: any }} orderData
 */
async function placeOrder({ customer_id, products, paymentInfo }) {
  // 1) Ensure user exists
  const customer = await User.findByPk(customer_id);
  if (!customer) {
    throw new Error("You must be logged in to place an order.");
  }

  // 2) (Optional) validate paymentInfo here…

  // 3) Compute next order_id
  const maxOrderId = await Order.max("order_id");
  const nextOrderId = (maxOrderId || 0) + 1;

  // 4) Build items and compute total
  const orderDate   = new Date();
  let totalAmount   = 0;
  const itemsToInsert = [];

  for (const { productId, quantity } of products) {
    const product = await Product.findByPk(productId);
    if (!product) throw new Error(`Product ${productId} not found.`);

    totalAmount += Number(product.price) * quantity;

    itemsToInsert.push({
      order_id:     nextOrderId,
      product_id:   productId,
      customer_id,
      quantity,
      order_date:   orderDate,
      order_status: "processing",
      total_amount: totalAmount,
    });
  }

  // 5) Bulk insert all lines
  await Order.bulkCreate(itemsToInsert);

  return { order_id: nextOrderId, total_amount: totalAmount };
}

/**
 * Check if a user has purchased a given product in any order group.
 */
async function hasUserPurchasedProduct(userId, productId) {
  const match = await Order.findOne({
    where: {
      customer_id:  userId,
      order_status: "processing",
      product_id:   productId,
    },
  });
  return !!match;
}

module.exports = {
  placeOrder,
  hasUserPurchasedProduct,
};