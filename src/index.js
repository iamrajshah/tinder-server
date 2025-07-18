const express = require("express");
const connectDb = require("./config/database"); // Ensure database connection is established
const cookieParser = require("cookie-parser"); // Import cookie-parser for handling cookies
const app = express();

const authRouter = require("./routes/auth"); // Import authentication routes
const profileRouter = require("./routes/profile"); // Import profile routes
const requestRouter = require("./routes/request"); // Import request routes
const userRouter = require("./routes/user"); // Import request routes
const cors = require("cors");

require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies from the request

app.use("/", authRouter); // Mount authentication routes
app.use("/profile", profileRouter); // Mount profile routes
app.use("/request", requestRouter); // Mount request routes
app.use("/user", userRouter); // Mount request routes

connectDb()
  .then(() => {
    console.log("Connected to MongoDB cluster");

    // Start application once the database connection is established
    app.listen(process.env.PORT, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
