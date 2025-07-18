const razorPay = require("razorpay");

const instance = new razorPay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  //   headers: "",
  //   oauthToken: "",
});

module.exports = instance;
