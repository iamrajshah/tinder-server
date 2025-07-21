const express = require("express");
const { userAuth } = require("../middleware/auth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/history/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const { _id: userId } = req.user;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json("ERROR: occured");
  }
});

module.exports = chatRouter;
