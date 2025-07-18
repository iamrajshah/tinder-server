const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  orderId: {
    type: String,
  },
  orderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  receipt: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  notes: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    plan: {
      type: String,
    },
  },
});

const PaymentModel = new mongoose.model("Payment", paymentSchema);
module.exports = PaymentModel;
