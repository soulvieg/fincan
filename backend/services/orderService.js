// backend/services/orderService.js
const sequelize = require("../config/db");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Refund = require("../models/Refund");

/* -------------------------------------------------- */
/*  Place order                                       */
/* -------------------------------------------------- */
async function placeOrder({ customer_id, products /*, paymentInfo */ }) {
  const customer = await User.findByPk(customer_id);
  if (!customer) throw new Error("You must be logged in to place an order.");

  const nextOrderId = ((await Order.max("order_id")) || 0) + 1;

  let total = 0;
  const lines = [];

  for (const { productId, quantity } of products) {
    const prod = await Product.findByPk(productId);
    if (!prod) throw new Error(`Product ${productId} not found`);
    if (prod.quantity_in_stock < quantity) {
      throw new Error(`Not enough stock for product ${productId}`);
    }

    prod.quantity_in_stock -= quantity;
    await prod.save();

    total += Number(prod.price) * quantity;

    lines.push({
      order_id: nextOrderId,
      customer_id,
      product_id: productId,
      quantity,
      order_date: new Date(),
      order_status: "processing",
      total_amount: total,
    });
  }

  await Order.bulkCreate(lines);
  return { order_id: nextOrderId, total_amount: total };
}

/* -------------------------------------------------- */
/*  Cancel order (auto-refund request)                */
/* -------------------------------------------------- */
async function cancelOrder(orderId) {
  const t = await sequelize.transaction();
  try {
    const items = await Order.findAll({
      where: { order_id: orderId },
      transaction: t,
    });

    let amount = 0;
    for (const line of items) {
      const prod = await Product.findByPk(line.product_id, { transaction: t });
      if (!prod) throw new Error(`Product ${line.product_id} not found`);
      prod.quantity_in_stock += line.quantity;
      await prod.save({ transaction: t });
      amount += Number(prod.price) * line.quantity;
    }

    await Order.update(
      { order_status: "cancelled" },
      { where: { order_id: orderId }, transaction: t }
    );

    await Refund.create(
      { order_id: orderId, refund_status: "Waiting for Refund", amount },
      { transaction: t }
    );

    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/* -------------------------------------------------- */
/*  Manual refund request (for delivered orders)      */
/* -------------------------------------------------- */
async function requestRefund(orderId) {
  const t = await sequelize.transaction();
  try {
    const existing = await Refund.findOne({
      where: { order_id: orderId },
      transaction: t,
    });
    if (existing) throw new Error("Refund already requested for this order.");

    const [[{ customerId, refundAmount }]] = await sequelize.query(
      `
      SELECT o.customer_id AS customerId,
             SUM(p.price * o.quantity) AS refundAmount
      FROM Orders o
      JOIN Products p ON p.product_id = o.product_id
      WHERE o.order_id = ?
      GROUP BY o.order_id, o.customer_id
      `,
      { replacements: [orderId], transaction: t }
    );

    const refund = await Refund.create(
      {
        order_id: orderId,
        customer_id: customerId,
        amount: refundAmount,
        refund_status: "Waiting for Refund",
      },
      { transaction: t }
    );

    await t.commit();
    return refund;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/* -------------------------------------------------- */
/*  Update refund status + optional restock           */
/* -------------------------------------------------- */
async function updateRefundStatus(orderId, newStatus) {
  const VALID = ["Waiting for Refund", "Refunded", "Refund Denied"];
  const normalized = VALID.find(
    (v) => v.toLowerCase() === String(newStatus).trim().toLowerCase()
  );
  if (!normalized) throw new Error(`Invalid refund status: "${newStatus}"`);

  // Everything—including optional restock—inside one transaction
  const t = await sequelize.transaction();
  try {
    const [refundRow, created] = await Refund.findOrCreate({
      where: { order_id: orderId },
      defaults: { refund_status: normalized },
      transaction: t,
    });

    // If no change, we’re done
    if (!created && refundRow.refund_status === normalized) {
      await t.commit();
      return refundRow;
    }

    // --- OPTIONAL STOCK RETURN ------------------------------------------
    // Only when transitioning *to* "Refunded" for the first time
    const becomingRefunded =
      normalized === "Refunded" && refundRow.refund_status !== "Refunded";

    if (becomingRefunded) {
      const items = await Order.findAll({
        where: { order_id: orderId },
        transaction: t,
      });
      for (const line of items) {
        const prod = await Product.findByPk(line.product_id, {
          transaction: t,
        });
        if (!prod) throw new Error(`Product ${line.product_id} not found`);
        prod.quantity_in_stock += line.quantity;
        await prod.save({ transaction: t });
      }
    }
    // --------------------------------------------------------------------

    refundRow.refund_status = normalized;
    await refundRow.save({ transaction: t });

    await t.commit();
    return refundRow;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/* -------------------------------------------------- */
/*  Utility                                           */
/* -------------------------------------------------- */
async function getRefundByOrderId(orderId) {
  return Refund.findOne({ where: { order_id: orderId } });
}
async function hasUserPurchasedProduct(customerId, productId) {
  const result = await Order.findOne({
    where: {
      customer_id: customerId,
      product_id: productId,
    },
  });
  return !!result;
}

module.exports = {
  placeOrder,
  cancelOrder,
  requestRefund,
  updateRefundStatus,
  getRefundByOrderId,
  hasUserPurchasedProduct,
};
