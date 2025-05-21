// backend/services/orderService.js
const sequelize = require("../config/db");
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
    if (product.stock < quantity) throw new Error(`Product ${productId} doesn't have enough quantity for this order.`);

    // Decrease the products from the store:
    product.stock = product.stock - quantity;
    await product.save();
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

/**
 * Cancel an existing order group and restock its products.
 * @param {number} orderId
 */
async function cancelOrder(orderId) {
  const t = await sequelize.transaction();
  try {
    // fetch all items for this order
    const items = await Order.findAll({
      where: { order_id: orderId },
      transaction: t,
    });

    // restock each product
    for (const line of items) {
      const prod = await Product.findByPk(line.product_id, { transaction: t });
      if (!prod) throw new Error(`Product ${line.product_id} not found`);
      prod.quantity_in_stock += line.quantity;
      await prod.save({ transaction: t });
    }

    // mark the order rows cancelled
    await Order.update(
      { order_status: "cancelled" },
      { where: { order_id: orderId }, transaction: t }
    );

    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

module.exports = {
  placeOrder,
  hasUserPurchasedProduct,
  cancelOrder,
};
