const express = require("express");
const { userAuth } = require("../middleware/auth");
const instance = require("../utils/razorpay");
const PaymentModel = require("../models/payment");
const { membershipAmount } = require("../utils/constant");
const {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

const paymentRouter = express.Router();

paymentRouter.post("/order", userAuth, async (req, res) => {
  try {
    const { plan } = req.body;
    const { _id, firstName, lastName, emailId } = req.user;
    const allDetails = await instance.orders.create({
      amount: membershipAmount[plan],
      currency: "INR",
      receipt: "#1",
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        plan,
        emailId,
      },
    });

    const {
      amount,
      id: orderId,
      status,
      currency,
      notes,
      receipt,
    } = allDetails;
    const newPaymentOrder = new PaymentModel({
      amount,
      orderId,
      currency,
      notes,
      receipt,
      status,
      userId: _id,
    });

    const data = await newPaymentOrder.save();

    res
      .status(200)
      .json({ message: "Done!!", data, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.log(error);
  }
});

paymentRouter.post("/webhook", async (req, res) => {
  try {
    const signature = req.get["X-Razorpay-Signature"];
    const { event, payload } = req.body;
    const { order_id, status } = payload?.payment.entity;
    console.log(req.body);
    const result = validatePaymentVerification(
      JSON.stringify(req.body),
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!result) res.status(400).json({ message: "Validation failed" });

    const paymentfromDB = await PaymentModel.findOne({
      orderId: order_id,
    });
    paymentfromDB.status = status;

    console.log("Getting payment from db", paymentfromDB);
    await paymentfromDB.save();

    const user = User.findOne({ _id: paymentfromDB.userId });
    console.log("Updating user ", user);
    user.isPremium = true;
    user.plan = paymentfromDB.notes.plan;

    await user.save();
    if (event === "payment.captured") {
    }
    if (event === "payment.failed") {
    }

    res.status(200).json({ message: "Webhook called" });
  } catch (error) {
    console.log("Error while validating payment", error);
  }
});
module.exports = paymentRouter;
