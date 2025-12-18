const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../lib/utils");
const cloudinary = require("../lib/cloudinary");

async function register(req, res) {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).send("All fields are required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Username already taken");
    }

    if (password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: "User registered successfully",
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).send({ message: "invalid user data" });
    }
  } catch (error) {
    res.status(500).send("Error registering user");
    console.error("Registration error:", error);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }

    generateToken(user._id, res);

    res.status(200).json({
      message: "User logged in successfully",
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).send("Error registering user");
    console.error("Registration error:", error);
  }
}

async function logout(req, res) {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).send("User logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Error logging out user");
  }
}

async function updateProfile(req, res) {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id;

    if (!profilePicture) {
      return res.status(400).send("Profile picture is required");
    }

    const uploadPicture = await cloudinary.uploader.upload(
      profilePicture
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadPicture.secure_url },
      { new: true }
    );

    res.status(200).json({
      updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).send("Error updating profile");
  }
}

async function getMe(req, res) {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).send("Error retrieving user data");
  }
}

module.exports = {
  register,
  login,
  logout,
  updateProfile,
  getMe
};
