const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth"); // Import user authentication middleware
const ConnectionRequestModel = require("../models/connectionRequest");

const userAllowedField = "firstName lastName skills about photoUrl";
// get all pending conenction requests
userRouter.get("/connections/received", userAuth, async (req, res) => {
  try {
    const { user: loggedInUser } = req;

    const allRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", userAllowedField);
    console.log(allRequest);
    res.status(200).json({ allRequest });
    return;
  } catch (error) {
    res.send("Error occured:" + error.message);
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const { user: loggedInUser } = req;

    const allRequest = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("toUserId", userAllowedField)
      .populate("fromUserId", userAllowedField);
    console.log(allRequest);

    const data = allRequest.map((userData) => {
      if (userData.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return userData.toUserId;
      }
      return userData.fromUserId;
    });
    res.status(200).json({ data });
    return;
  } catch (error) {
    res.send("Error occured:" + error.message);
  }
});

module.exports = userRouter;
