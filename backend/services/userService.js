// services/userService.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

/**
 * Create/register a new user
 * @param {object} userData - { name, email, homeAddress, password }
 * @returns {object} - The newly created user
 * @throws {Error} - If email is already taken or other issues occur
 */
async function registerUser(userData) {
  const { name, email, homeAddress, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const newUser = await User.create({
    name,
    email,
    homeAddress,
    password: hashedPassword,
  });

  return newUser;
}

/**
 * Login a user
 * @param {object} credentials - { email, password }
 * @returns {object} - The logged-in user data (minus password) or throws error if invalid
 * @throws {Error} - If user not found or password mismatch
 */
async function loginUser(credentials) {
  const { email, password } = credentials;

  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  // Return user data (omit the password field)
  const { id, name, homeAddress } = user;
  return { id, name, email, homeAddress };
}

/**
 * Retrieve a user's profile by ID
 * @param {number} userId - The user's ID
 * @returns {object} - The user object (minus password) if found
 * @throws {Error} - If user not found
 */
async function getUserById(userId) {
  // Optionally exclude password at the DB query level
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
}

/**
 * Update a user's profile fields (name, email, homeAddress)
 * @param {number} userId - The user's ID
 * @param {object} updates - { name?, email?, homeAddress? }
 * @returns {object} - The updated user object (minus password)
 * @throws {Error} - If user not found or email is already taken
 */
async function updateUserProfile(userId, updates) {
  const { name, email, homeAddress } = updates;

  // Find the user
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  // If changing email, verify uniqueness
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("This email is already in use.");
    }
  }

  // Update only the fields provided
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (homeAddress !== undefined) user.homeAddress = homeAddress;

  await user.save();

  // Exclude password from return
  const { password, ...updatedUser } = user.get({ plain: true });
  return updatedUser;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
};
