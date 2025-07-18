const express = require("express");
const { userAuth } = require("../middleware/auth"); // Import user authentication middleware
const { validateEditProfile, validateChangePassword } = require("../utils"); // Import validation utility function
const profileRouter = express.Router();
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

profileRouter.get("/view", userAuth, async (req, res) => {
  const { user } = req; // Get all cookies
  res.status(200).json(user);
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    validateEditProfile(req); // Validate the request body
    const { user } = req; // Get the user from the request
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key])); // Update user fields with the request body
    await user.save(); // Save the updated user to the database

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error editing profile:", error);
    res
      .status(400)
      .json({ message: "Error editing profile", error: error.message });
  }
});

profileRouter.patch("/changePassword", userAuth, async (req, res) => {
  try {
    validateChangePassword(req); // Validate the request body
    const { user } = req; // Get the user from the request
    const { oldPassword, newPassword } = req.body; // Destructure the request body
    const isPasswordValid = await user.validatePassword(oldPassword); // Validate the old password
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10); // Hash the new password
    user.password = newPasswordHash; // Update the user's password
    await user.save(); // Save the updated user to the database

    res.status(200).json({ message: "Password updated successfully", user });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error while updating password", error: error.message });
  }
});
module.exports = profileRouter;
