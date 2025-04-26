// backend/controllers/userController.js
const jwt           = require("jsonwebtoken");
const {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
} = require("../services/userService");

// POST /api/users/signup
async function signupController(req, res) {
  try {
    const newUser = await registerUser(req.body);
    return res.status(201).json({ message: "Created", user: newUser });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

// POST /api/users/login
async function loginController(req, res) {
  try {
    const u = await loginUser(req.body);
    const token = jwt.sign({ id: u.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ message: "Logged in", user: u, token });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}

// GET /api/users/me
async function getMeController(req, res) {
  try {
    const u = await getUserById(req.user.id);
    return res.status(200).json({ message: "Me", user: u });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

// GET /api/users/:id/profile
async function getUserProfileController(req, res) {
  try {
    const u = await getUserById(req.params.id);
    return res.status(200).json({ message: "Profile", user: u });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

// PUT /api/users/:id/profile
async function updateUserProfileController(req, res) {
  try {
    const updated = await updateUserProfile(req.params.id, req.body);
    return res.status(200).json({ message: "Updated", user: updated });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = {
  signupController,
  loginController,
  getMeController,
  getUserProfileController,
  updateUserProfileController,
};