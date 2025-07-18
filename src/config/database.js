const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(process.env.CONNECTION_STRING);
};

module.exports = connectDb;
