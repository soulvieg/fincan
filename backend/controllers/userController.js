// controllers/userController.js
const { registerUser, loginUser } = require("../services/userService");

/**
 * Controller to handle user signup
 * @route POST /api/users/signup
 */
async function signupController(req, res) {
  try {
    const { name, email, homeAddress, password } = req.body;

    // Basic validation
    if (!name || !email || !homeAddress || !password) {
      return res.status(400).json({
        message: "All fields (name, email, homeAddress, password) are required.",
      });
    }

    const newUser = await registerUser({ name, email, homeAddress, password });
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        homeAddress: newUser.homeAddress,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * Controller to handle user login
 * @route POST /api/users/login
 */
async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const userData = await loginUser({ email, password });
    return res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

module.exports = {
  signupController,
  loginController,
};
