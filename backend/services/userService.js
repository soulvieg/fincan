// services/userService.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Register new user
async function registerUser(userData) {
  const { firstName, lastName, email, homeAddress, password, userType } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("User with this email already exists.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    homeAddress,
    password: hashedPassword,
    userType,
  });

  return newUser;
}

// Login
async function loginUser(credentials) {
  const { email, password } = credentials;

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid email or password.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password.");

  const { id, firstName, lastName, homeAddress, userType } = user;
  return { id, firstName, lastName, email, homeAddress, userType };
}

// Get user by ID
async function getUserById(userId) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new Error("User not found.");
  return user;
}

// Update user profile
async function updateUserProfile(userId, updates) {
  const { firstName, lastName, email, homeAddress } = updates;

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found.");

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error("This email is already in use.");
  }

  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (email !== undefined) user.email = email;
  if (homeAddress !== undefined) user.homeAddress = homeAddress;

  await user.save();
  const { password, ...updatedUser } = user.get({ plain: true });
  return updatedUser;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
};
