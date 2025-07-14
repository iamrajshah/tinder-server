const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth"); // Import user authentication middleware
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { _id: fromUserId } = req.user;
    const { toUserId, status } = req.params;

    const allowedStatus = ["ignored", "interested"];

    const toUserExist = await User.findById(toUserId);

    if (fromUserId === toUserId) {
      res
        .status(400)
        .json({ message: `Can't send request to self ${fromUserId}` });
    }
    // User exist
    if (!toUserExist) {
      return res.status(400).json({ message: `User not found: ${toUserId}` });
    }

    // Status is valid
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    // Check if request already exist
    const connectionExist = await ConnectionRequestModel.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          toUserId,
          fromUserId,
        },
      ],
    });
    if (connectionExist) {
      res.status(400).json({ message: "Request exist already!" });
      return;
    }

    // Create one
    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.json({ message: "Connection request send succesfully", data });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Something went wrong + ${error.message}` });
  }
});

module.exports = requestRouter;
