const jwt = require("jsonwebtoken");

function generateToken(userId, res) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // REQUIRED on Railway (HTTPS)
    sameSite: "none",    // REQUIRED for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
}

module.exports = { generateToken };
