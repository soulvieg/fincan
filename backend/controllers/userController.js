// controllers/userController.js
const {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
} = require("../services/userService");

// Signup controller
async function signupController(req, res) {
  try {
    const { firstName, lastName, email, homeAddress, password, userType } = req.body;

    if (!firstName || !lastName || !email || !homeAddress || !password) {
      return res.status(400).json({
        message: "All fields (firstName, lastName, email, homeAddress, password) are required.",
      });
    }

    const newUser = await registerUser({ firstName, lastName, email, homeAddress, password, userType });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        homeAddress: newUser.homeAddress,
        userType: newUser.userType,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Login controller
async function loginController(req, res) {
  try {
    const { email, password } = req.body;

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

// Get profile controller
async function getUserProfileController(req, res) {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    return res.status(200).json({
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

// Update profile controller
async function updateUserProfileController(req, res) {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, homeAddress } = req.body;

    const updatedUser = await updateUserProfile(id, { firstName, lastName, email, homeAddress });

    return res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  signupController,
  loginController,
  getUserProfileController,
  updateUserProfileController,
};
