const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth"); // Import user authentication middleware
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const userAllowedField =
  "firstName lastName skills about photoUrl age gender isPremium";
// get all pending conenction requests
userRouter.get("/connections/received", userAuth, async (req, res) => {
  try {
    const { user: loggedInUser } = req;

    const allRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", userAllowedField);
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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const { user: loggedInUser } = req;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;

    limit = limit > 50 ? 50 : limit;

    const allRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const skip = (page - 1) * limit;
    const hideUsers = new Set();

    allRequest.forEach((request) => {
      hideUsers.add(request.fromUserId.toString());
      hideUsers.add(request.toUserId.toString());
    });

    const feedItems = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(userAllowedField)
      .skip(skip)
      .limit(limit);
    res.status(200).send(feedItems);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

module.exports = userRouter;
