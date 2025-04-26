// backend/services/userService.js
const bcrypt = require("bcryptjs");
const User   = require("../models/User");
const Card   = require("../models/Card");

/**
 * Register a new user.
 */
async function registerUser({ firstName, lastName, email, homeAddress, password, userType }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("User with this email already exists.");
  const hashed = await bcrypt.hash(password, 10);
  return User.create({ firstName, lastName, email, homeAddress, password: hashed, userType });
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
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    homeAddress: user.homeAddress,
    userType: user.userType,
  };
}

/**
 * Fetch a user by ID, including their saved card.
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
  return {
    ...plain,
    creditCard: c
      ? {
          cardNumber:     c.cardNumber,  // hashed
          expirationDate: `${String(c.expirationDate.getMonth()+1).padStart(2,'0')}/${String(c.expirationDate.getFullYear()).slice(-2)}`,
          cardholderName: c.cardName,
        }
      : null,
  };
}

/**
 * Update user profile and upsert hashed credit card.
 */
async function updateUserProfile(userId, updates) {
  const { firstName, lastName, email, homeAddress, phoneNumber, creditCard } = updates;
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found.");

  if (email && email !== user.email) {
    const ex = await User.findOne({ where: { email } });
    if (ex) throw new Error("This email is already in use.");
  }

  if (firstName   !== undefined) user.firstName   = firstName;
  if (lastName    !== undefined) user.lastName    = lastName;
  if (email       !== undefined) user.email       = email;
  if (homeAddress !== undefined) user.homeAddress = homeAddress;
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
  await user.save();

  if (creditCard) {
    const [mm, yy] = creditCard.expirationDate.split("/");
    const expDate  = new Date(2000 + Number(yy), Number(mm) - 1);
    const hashNum  = await bcrypt.hash(creditCard.cardNumber, 12);

    let card = await Card.findOne({ where: { customer_id: userId } });
    if (card) {
      card.cardNumber     = hashNum;
      card.expirationDate = expDate;
      card.cardName       = creditCard.cardholderName;
      await card.save();
    } else {
      await Card.create({
        customer_id:     userId,
        cardNumber:      hashNum,
        expirationDate:  expDate,
        cardName:        creditCard.cardholderName,
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