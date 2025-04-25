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
  const { userId, productId, quantity, paymentInfo} = orderData;

  // Check if user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("You must be logged in to place an order.");
  }
  // Check if product exists
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("The product you're referring to doesn't exist.");
  }
  
  // Validate payment here(Mock payment for now)
  const validation = isValidCard(paymentInfo);
if (!validation.valid) {
  throw new Error(`Payment failed: ${validation.message}`);
}  

  const newOrder = await Order.create({
    userId,
    productId,
    quantity,
    status: "processing", // initial status
  });

  return newOrder;
}






/**
 * Check if a user has purchased a given product.
 * Only orders with status "delivered" count as a valid purchase.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 * @returns {boolean} - True if an order exists, false otherwise.
 * @throws {Error} - If a query error occurs.
 */
async function hasUserPurchasedProduct(userId, productId) {
  const order = await Order.findOne({
    where: {
      userId: userId,
      productId: productId,
      status: "processing",  // "delivered"
    },
  });
  return !!order;
}

module.exports = {
  placeOrder,
  hasUserPurchasedProduct,
};
