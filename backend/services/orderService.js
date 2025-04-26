const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");


/**
 * Place a new order if the user is "logged in"
 */
function isValidCard(cardInfo) {
  const { cardNumber, cardHolder, expiry, cvv } = cardInfo;

  // Check all fields are present
  if (!cardNumber || !cardHolder || !expiry || !cvv) {
    return { valid: false, message: "Missing card information." };
  }

  // Validate card number (16-digit numeric)
  const cardNumberStr = cardNumber.toString().replace(/\s+/g, '');
  if (!/^\d{16}$/.test(cardNumberStr)) {
    return { valid: false, message: "Invalid card number. Must be 16 digits." };
  }

  // Validate CVV (3 or 4 digits)
  if (!/^\d{3,4}$/.test(cvv)) {
    return { valid: false, message: "Invalid CVV. Must be 3 or 4 digits." };
  }

  // Validate expiry date
  const [expMonth, expYear] = expiry.split('/').map(s => s.trim());
  const month = parseInt(expMonth);
  let year = parseInt(expYear);
  if (expYear.length === 2) {
    year += 2000; // Convert YY to YYYY
  }

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
    return { valid: false, message: "Invalid expiry date format." };
  }

  const now = new Date();
  const expiryDate = new Date(year, month); // first of next month
  if (expiryDate <= now) {
    return { valid: false, message: "Card is expired." };
  }

  return { valid: true };
}


async function placeOrder(orderData) {
  const { customer_id, products, paymentInfo } = orderData;
  // products = [{ productId: 3, quantity: 1 }, { productId: 7, quantity: 2 }]

  // Check if user exists
  const customer = await User.findByPk(customer_id);
  if (!customer) {
    throw new Error("You must be logged in to place an order.");
  }

  // Validate payment (mock payment for now)
  const validation = isValidCard(paymentInfo);
  if (!validation.valid) {
    throw new Error(`Payment failed: ${validation.message}`);
  }

  let totalAmount = 0;
  const orderDate = new Date();

  const orderItems = [];

  // Loop through the products, validate each, and calculate the total amount
  for (const { productId, quantity } of products) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} does not exist.`);
    }

    totalAmount += product.price * quantity;

    orderItems.push({
      customer_id,
      product_id: productId,
      quantity,
      order_date: orderDate,
      order_status: "processing", // Initial status for all items
      total_amount: 0, // Placeholder for the final total amount
    });
  }

  // Set the total_amount on each item and insert all items in bulk
  const finalItems = orderItems.map(item => ({
    ...item,
    total_amount: totalAmount,
  }));

  const newOrder = await Order.bulkCreate(finalItems);

  return { order_id: newOrder[0].order_id, total_amount: totalAmount };
}



async function hasUserPurchasedProduct(userId, productId) {
  try {
    const match = await Order.findOne({
      where: {
        customer_id: userId,
        order_status: "processing",  // Ensure the order is delivered
      },
      include: [
        {
          model: Product,
          where: { product_id: productId }, // Ensure the product matches
          required: true, // Ensure this product must be part of the order
        },
      ],
    });

    return !!match;  // If a matching order exists, return true
  } catch (error) {
    console.error("Error checking user purchase:", error);
    throw error;
  }
}



module.exports = {
  placeOrder,
  hasUserPurchasedProduct,
};
