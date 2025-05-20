// backend/controllers/userController.js
const jwt = require("jsonwebtoken");
const {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
} = require("../services/userService");

// POST /api/users/signup
async function signupController(req, res) {
  try {
    const { firstName, lastName, email, homeAddress, phoneNumber, password, userType } = req.body;
    if (!firstName || !lastName || !email || !homeAddress || !password) {
      return res.status(400).json({
        message:
          "All fields (firstName, lastName, email, homeAddress, phoneNumber, password) are required.",
      });
    }
    if(!phoneNumber) console.log("Heck");
    const newUser = await registerUser({
      firstName,
      lastName,
      email,
      homeAddress,
      phoneNumber,
      password,
      userType,
    });
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        homeAddress: newUser.homeAddress,
        phoneNumber: newUser.phoneNumber,
        userType: newUser.userType,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// POST /api/users/login
async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // check credentials
    const creds = await loginUser({ email, password });

    // fetch full profile (with phone & card)
    const fullUser = await getUserById(creds.id);

    // sign token
    const token = jwt.sign(
      { id: creds.id, email: creds.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: fullUser,
      token,
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

// GET /api/users/me
async function getMeController(req, res) {
  try {
    const me = await getUserById(req.user.id);
    return res.status(200).json({ user: me });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

// GET /api/users/:id/profile
async function getUserProfileController(req, res) {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

// PUT /api/users/:id/profile
async function updateUserProfileController(req, res) {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      homeAddress,
      phoneNumber,
      creditCard,
    } = req.body;

    const updatedUser = await updateUserProfile(id, {
      firstName,
      lastName,
      email,
      homeAddress,
      phoneNumber,
      creditCard,
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  signupController,
  loginController,
  getMeController,
  getUserProfileController,
  updateUserProfileController,
};