// backend/services/userService.js

const bcrypt = require("bcryptjs");
const User   = require("../models/User");
const Card   = require("../models/Card");

const SALT_ROUNDS = 12;

/**
 * Register a new user.
 */
async function registerUser({ firstName, lastName, email, homeAddress, phoneNumber, password, userType }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("User with this email already exists.");

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return User.create({
    firstName,
    lastName,
    email,
    homeAddress,
    phoneNumber,
    password: hashed,
    userType,
  });
}

/**
 * Authenticate and return basic user info.
 */
async function loginUser({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid email or password.");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid email or password.");

  return {
    id:          user.id,
    firstName:   user.firstName,
    lastName:    user.lastName,
    email:       user.email,
    homeAddress: user.homeAddress,
    phoneNumber: user.phoneNumber,
    userType:    user.userType,
  };
}

/**
 * Fetch a user by ID, including their saved card.
 * Returns the card number masked as "**** **** **** 1234".
 */
async function getUserById(userId) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
    include:    [{ model: Card, as: "card" }],
  });
  if (!user) throw new Error("User not found.");

  const plain = user.get({ plain: true });
  const c     = plain.card;
  delete plain.card;

  let creditCard;
  if (c) {
    // Build masked number
    const last4 = c.card_last4;
    const masked = `**** **** **** ${last4}`;

    // Format expiration date MM/YY
    const exp = new Date(c.expiration_date);
    const mm  = String(exp.getMonth() + 1).padStart(2, "0");
    const yy  = String(exp.getFullYear()).slice(-2);

    creditCard = {
      cardNumber:     masked,
      expirationDate: `${mm}/${yy}`,
      cardholderName: c.card_name,
    };
  }

  return { ...plain, creditCard };
}

/**
 * Update user profile and upsert a partially-hashed credit card.
 * Stores bcrypt(prefix) in `card_number` and plaintext last 4 in `card_last4`.
 */
async function updateUserProfile(userId, updates) {
  const { firstName, lastName, email, homeAddress, phoneNumber, creditCard } = updates;
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found.");

  // Email uniqueness check
  if (email && email !== user.email) {
    const ex = await User.findOne({ where: { email } });
    if (ex) throw new Error("This email is already in use.");
  }

  // Update fields
  if (firstName   !== undefined) user.firstName   = firstName;
  if (lastName    !== undefined) user.lastName    = lastName;
  if (email       !== undefined) user.email       = email;
  if (homeAddress !== undefined) user.homeAddress = homeAddress;
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
  await user.save();

  // Handle creditCard upsert
  if (creditCard) {
    // Normalize digits
    const digits = creditCard.cardNumber.replace(/\D/g, "");
    const last4  = digits.slice(-4);
    const prefix = digits.slice(0, -4);

    // Hash the first 12 digits
    const hashedPrefix = await bcrypt.hash(prefix, SALT_ROUNDS);

    // Parse expiration MM/YY to Date
    const [mm, yy] = creditCard.expirationDate.split("/");
    const expDate  = new Date(2000 + Number(yy), Number(mm) - 1, 1);

    let card = await Card.findOne({ where: { customer_id: userId } });
    if (card) {
      card.card_number     = hashedPrefix;
      card.card_last4      = last4;
      card.expiration_date = expDate;
      card.card_name       = creditCard.cardholderName;
      await card.save();
    } else {
      await Card.create({
        customer_id:     userId,
        card_number:     hashedPrefix,
        card_last4:      last4,
        expiration_date: expDate,
        card_name:       creditCard.cardholderName,
      });
    }
  }

  return getUserById(userId);
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
};