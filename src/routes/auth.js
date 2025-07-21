const express = require("express");
const { validateSignup, validateLogin } = require("../utils"); // Import utility functions if needed
const User = require("./../models/user"); // Import User model
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // Validate the request body
  try {
    validateSignup(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hashSync(password, 10); // Hash the password
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await newUser.save();

    const token = await newUser.getJWT(); // Generate JWT token using the method defined in the User model
    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000), // 1 hour
    });
    res
      .status(201)
      .json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLogin(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      const token = await user.getJWT(); // Generate JWT token using the method defined in the User model
      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000), // 1 hour
      });
      res.status(200).json({ message: "Login successful", user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while login", error: error.message });
  }
});

authRouter.post("/logout", (req, res) => {
  //   res.clearCookie("token"); // Clear the cookie
  res.cookie("token", null, { expires: new Date(Date.now()) }); // Clear the cookie
  res.status(200).json({ message: "Logout successful" });
});

module.exports = authRouter;
