// backend/controllers/purchaseController.js
const sequelize = require("../config/db");
const {
  placeOrder,
  cancelOrder,
  requestRefund,
  updateRefundStatus,
  getRefundByOrderId,
} = require("../services/orderService");
const Product = require("../models/Product");

/**
 * GET /api/orders
 */
async function getOrdersController(req, res) {
  try {
    const { startDate, endDate } = req.query;
    let whereClause = "";
    const replacements = [];

    if (startDate) {
      whereClause += " AND o.order_date >= ?";
      replacements.push(startDate);
    }
    if (endDate) {
      const inc = new Date(endDate);
      inc.setDate(inc.getDate() + 1);
      whereClause += " AND o.order_date < ?";
      replacements.push(inc.toISOString().slice(0, 10));
    }

    const [rows] = await sequelize.query(
      `
      SELECT
        o.order_id      AS id,
        o.customer_id   AS customerId,
        o.order_date    AS date,
        o.total_amount  AS total,
        o.order_status  AS status,
        u.address       AS address,
        CONCAT(u.first_name, ' ', u.last_name) AS customer,
        o.product_id    AS productId,
        o.quantity      AS quantity,
        p.name          AS name,
        p.price         AS price,
        p.image_url     AS image
      FROM Orders o
      JOIN Customers u ON u.customer_id = o.customer_id
      LEFT JOIN Products p ON p.product_id = o.product_id
      WHERE 1=1 ${whereClause}
      ORDER BY o.order_id ASC, p.product_id ASC;
      `,
      { replacements }
    );

    const orders = rows.reduce((acc, row) => {
      let ord = acc.find((o) => o.id === row.id);
      if (!ord) {
        ord = {
          id: row.id,
          customerId: row.customerId,
          date: row.date,
          total: Number(row.total),
          status: row.status,
          address: row.address,
          customer: row.customer,
          items: [],
        };
        acc.push(ord);
      }
      ord.items.push({
        productId: row.productId,
        name: row.name,
        price: Number(row.price),
        quantity: row.quantity,
        image: row.image,
      });
      return acc;
    }, []);

    return res.json(orders);
  } catch (err) {
    console.error("getOrdersController error:", err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * POST /api/orders
 */
async function placeOrderController(req, res) {
  try {
    const { customer_id, products, paymentInfo } = req.body;
    if (
      typeof customer_id !== "number" ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: "customer_id and at least one product are required.",
      });
    }

    const { order_id, total_amount } = await placeOrder({
      customer_id,
      products,
      paymentInfo,
    });

    // Build full Order response
    const items = await Promise.all(
      products.map(async ({ productId, quantity }) => {
        const prod = await Product.findByPk(productId);
        return {
          productId,
          name: prod.name,
          price: Number(prod.price),
          quantity,
          image: prod.image_url,
        };
      })
    );

    return res.status(201).json({
      id: order_id,
      customerId: customer_id,
      date: new Date().toISOString(),
      total: total_amount,
      status: "processing",
      address: "",
      customer: "",
      items,
    });
  } catch (err) {
    console.error("placeOrderController error:", err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * PATCH /api/orders/:orderId/status
 */
async function updateOrderStatusController(req, res) {
  try {
    const { orderId } = req.params;
    const { status }  = req.body;

    await sequelize.query(
      `UPDATE Orders SET order_status = ? WHERE order_id = ?`,
      { replacements: [status, orderId] }
    );

    // re-fetch and return the updated order…
    const [rows] = await sequelize.query(
      `
      SELECT
        o.order_id      AS id,
        o.customer_id   AS customerId,
        o.order_date    AS date,
        o.total_amount  AS total,
        o.order_status  AS status,
        u.address       AS address,
        CONCAT(u.first_name, ' ', u.last_name) AS customer,
        o.product_id    AS productId,
        o.quantity      AS quantity,
        p.name          AS name,
        p.price         AS price,
        p.image_url     AS image
      FROM Orders o
      JOIN Customers u ON u.customer_id = o.customer_id
      LEFT JOIN Products p ON p.product_id = o.product_id
      WHERE o.order_id = ?
      ORDER BY p.product_id ASC;
      `,
      { replacements: [orderId] }
    );

    const order = rows.reduce((acc, row) => {
      if (!acc) {
        acc = {
          id: row.id,
          customerId: row.customerId,
          date: row.date,
          total: Number(row.total),
          status: row.status,
          address: row.address,
          customer: row.customer,
          items: [],
        };
      }
      acc.items.push({
        productId: row.productId,
        name: row.name,
        price: Number(row.price),
        quantity: row.quantity,
        image: row.image,
      });
      return acc;
    }, null);

    return res.json(order);
  } catch (err) {
    console.error("updateOrderStatusController error:", err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * PATCH /api/orders/:orderId/cancel
 */
async function cancelOrderController(req, res) {
  try {
    const { orderId } = req.params;
    await cancelOrder(Number(orderId));
    req.body.status = "cancelled";
    return updateOrderStatusController(req, res);
  } catch (err) {
    console.error("cancelOrderController error:", err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * PATCH /api/orders/:orderId/mark-delivered
 */
async function markOrderDeliveredController(req, res) {
  try {
    req.body.status = "delivered";
    return updateOrderStatusController(req, res);
  } catch (err) {
    console.error("markOrderDeliveredController error:", err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * PATCH /api/orders/:orderId/refund-request
 */
async function requestRefundController(req, res) {
  try {
    const { orderId } = req.params;
    const refund = await requestRefund(Number(orderId));
    return res.status(201).json(refund);
  } catch (err) {
    console.error("requestRefundController error:", err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * PATCH /api/orders/:orderId/refund-status
 */
async function updateRefundStatusController(req, res) {
  try {
    const { orderId } = req.params;
    const newStatus  = req.body.refundStatus ?? req.body.status;
    if (!newStatus) {
      return res.status(400).json({ message: "Missing refund status" });
    }
    const refundRow = await updateRefundStatus(Number(orderId), newStatus);
    return res.status(200).json({ refund_status: refundRow.refund_status });
  } catch (err) {
    console.error("updateRefundStatusController error:", err);
    return res.status(400).json({ message: err.message });
  }
}

/**
 * GET /api/orders/:orderId/refund
 */
async function getRefundStatusController(req, res) {
  try {
    const orderId = Number(req.params.orderId);
    const refund  = await getRefundByOrderId(orderId);
    if (!refund) {
      return res.status(404).json({ message: "No refund record found" });
    }
    return res.status(200).json(refund.get({ plain: true }));
  } catch (err) {
    console.error("getRefundStatusController error:", err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getOrdersController,
  placeOrderController,
  updateOrderStatusController,
  cancelOrderController,
  markOrderDeliveredController,
  requestRefundController,
  updateRefundStatusController,
  getRefundStatusController,
};