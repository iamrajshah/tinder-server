const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ fromUserId, toUserId }) => {
      const roomId = [fromUserId, toUserId].sort().join("_");
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, fromUserId, toUserId, text }) => {
        const roomId = [fromUserId, toUserId].sort().join("_");
        try {
          let chat = await Chat.findOne({
            participants: {
              $all: [fromUserId, toUserId],
            },
          });
          if (!chat) {
            // create new
            chat = new Chat({
              participants: [fromUserId, toUserId],
              messages: [],
            });
          }
          // append
          chat.messages.push({
            senderId: fromUserId,
            text,
          });

          await chat.save();

          // Sending to room
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (error) {
          console.log(error);
        }
      }
    );
    socket.on("disconnect", () => {});
  });

  io.on("sendMessage", ({}) => {});
};

module.exports = initSocket;
