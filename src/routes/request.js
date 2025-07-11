const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth"); // Import user authentication middleware

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const { user } = req;

  res.send(user.firstName + " sent an connection request!");
});

module.exports = requestRouter;
