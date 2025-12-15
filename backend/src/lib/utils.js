const jwt = require("jsonwebtoken");

async function generateToken(userId, res) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "Strict",
  });
  return token;
}
module.exports = {
  generateToken,
};
