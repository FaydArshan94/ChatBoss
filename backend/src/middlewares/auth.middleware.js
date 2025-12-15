const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const protectRoute = async (req, res, next) => { // Renamed for consistency
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // FIX: In utils.js you signed the token with 'id', so use 'decoded.id' here
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Error verifying token" });
  }
};

// EXPORT THE FUNCTION HERE
module.exports = { protectRoute };