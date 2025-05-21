// backend/services/orderService.js
const sequelize = require("../config/db");
const Order     = require("../models/Order");
const User      = require("../models/User");
const Product   = require("../models/Product");
const Refund    = require("../models/Refund");

/**
 * Place a new order…
 */
async function placeOrder({ customer_id, products, paymentInfo }) {
  const customer = await User.findByPk(customer_id);
  if (!customer) throw new Error("You must be logged in to place an order.");

  const maxOrderId  = await Order.max("order_id");
  const nextOrderId = (maxOrderId || 0) + 1;

  let totalAmount = 0;
  const lines     = [];

  for (const { productId, quantity } of products) {
    const prod = await Product.findByPk(productId);
    if (!prod) throw new Error(`Product ${productId} not found.`);
    if (prod.quantity_in_stock < quantity) {
      throw new Error(`Not enough stock for product ${productId}.`);
    }
    prod.quantity_in_stock -= quantity;
    await prod.save();
    totalAmount += Number(prod.price) * quantity;
    lines.push({
      order_id:     nextOrderId,
      customer_id,
      product_id:   productId,
      quantity,
      order_date:   new Date(),
      order_status: "processing",
      total_amount: totalAmount,
    });
  }

  await Order.bulkCreate(lines);
  return { order_id: nextOrderId, total_amount: totalAmount };
}

/**
 * Cancel an order group…
 */
async function cancelOrder(orderId) {
  const t = await sequelize.transaction();
  try {
    const items = await Order.findAll({ where: { order_id: orderId }, transaction: t });
    let refundAmount = 0;

    for (const line of items) {
      const prod = await Product.findByPk(line.product_id, { transaction: t });
      if (!prod) throw new Error(`Product ${line.product_id} not found`);
      prod.quantity_in_stock += line.quantity;
      await prod.save({ transaction: t });
      refundAmount += Number(prod.price) * line.quantity;
    }

    await Order.update(
      { order_status: "cancelled" },
      { where: { order_id: orderId }, transaction: t }
    );

    await Refund.create(
      { order_id: orderId, refund_status: "Waiting for Refund", amount: refundAmount },
      { transaction: t }
    );

    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * Request a refund (separate from cancellation)…
 */
async function requestRefund(orderId) {
  const t = await sequelize.transaction();
  try {
    const existing = await Refund.findOne({ where: { order_id: orderId }, transaction: t });
    if (existing) throw new Error("Refund already requested for this order.");

    const [[{ customerId, refundAmount }]] = await sequelize.query(
      `
      SELECT
        o.customer_id            AS customerId,
        SUM(p.price * o.quantity) AS refundAmount
      FROM Orders o
      JOIN Products p ON p.product_id = o.product_id
      WHERE o.order_id = ?
      GROUP BY o.order_id, o.customer_id
      `,
      { replacements: [orderId], transaction: t }
    );

    const refund = await Refund.create(
      { order_id: orderId, customer_id: customerId, amount: refundAmount, refund_status: "Waiting for Refund" },
      { transaction: t }
    );
    await t.commit();
    return refund;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * Update refund status…
 */
async function updateRefundStatus(orderId, newStatus) {
  const VALID = ["Waiting for Refund", "Refunded", "Refund Denied"];
  const normalized = VALID.find(
    v => v.toLowerCase() === String(newStatus).trim().toLowerCase()
  );
  if (!normalized) throw new Error(`Invalid refund status: "${newStatus}"`);

  const [row, created] = await Refund.findOrCreate({
    where:    { order_id: orderId },
    defaults: { refund_status: normalized }
  });

  if (!created) {
    row.refund_status = normalized;
    await row.save();
  }
  return row;
}

/**
 * Lookup a refund by order_id
 */
async function getRefundByOrderId(orderId) {
  return await Refund.findOne({ where: { order_id: orderId } });
}

module.exports = {
  placeOrder,
  cancelOrder,
  requestRefund,
  updateRefundStatus,
  getRefundByOrderId,
};