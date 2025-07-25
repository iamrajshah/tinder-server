const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      required: true,
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    toUserId: {
      required: true,
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
