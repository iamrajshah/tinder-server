const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://shahrajesh2113:ejIZpwETDPkYo29r@namastenode.nbk2lth.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
