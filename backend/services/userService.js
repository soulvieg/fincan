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

module.exports = {
  registerUser,
  loginUser,
};
