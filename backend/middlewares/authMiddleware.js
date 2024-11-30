const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, "secret"); // Ensure "secret" is consistent
    req.user = await User.findById(decoded.userId);

    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
};
