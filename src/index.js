const express = require("express");
const connectDb = require("./config/database"); // Ensure database connection is established
const { validateSignup, validateLogin } = require("./utils"); // Import utility functions if needed
const User = require("./models/user");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

// We can have multiple middleware functions for the same route
// Remember to call `next()` to pass control to the next middleware

// app.use(
//   "/hellp",
//   (req, res, next) => {
//     res.send("Hello, Hello!");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Middleware executed after /hellp route");
//   }
// );

// app.use("/test", (req, res) => {
//   res.send("Hello, Test!");
// });

// app.use("/", (req, res) => {
//   res.send("Server is running!");
// });

app.post("/signup", async (req, res) => {
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
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    validateLogin(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      res.status(200).json({ message: "Login successful", user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while login", error: error.message });
  }
});

// Get user by emailId
app.get("/user", async (req, res) => {
  const { emailId } = req.body;

  try {
    const result = await User.findOne({
      emailId,
    });
    console.log(result);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
});

// Get feed of users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Delete user by ID
app.delete("/user", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
});

// Update user by ID
app.patch("/user/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    const VALID_UPDATE_FIELDS = ["photoUrl", "about", "skills"];
    const isAllowedUpdate = Object.keys(req.body).every((key) =>
      VALID_UPDATE_FIELDS.includes(key)
    );

    if (!isAllowedUpdate) {
      throw new Error("Invalid update fields");
    }

    if (req.body.skills && req.body.skills.length > 10) {
      throw new Error("Maximum of 10 skills allowed");
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated documen
      runValidators: true, // Run validation on the updated fields
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
});

connectDb()
  .then(() => {
    console.log("Connected to MongoDB cluster");

    // Start application once the database connection is established
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
