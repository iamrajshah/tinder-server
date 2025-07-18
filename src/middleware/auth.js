const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token handling
const User = require("../models/user"); // Import User model

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; // Get all cookies
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const { _id } = decodedToken;

    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to the request object
    next();
  } catch (error) {
    res.status(400).json({
      message: "Error during authentication",
    });
  }
};

module.exports = { userAuth };
