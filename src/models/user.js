const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token handling
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: (email) => {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      // It will only run when document is created
      validate: (password) => {
        if (!validator.isStrongPassword(password)) {
          throw new Error(
            "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
          );
        }
      },
    },
    age: {
      type: Number,
      required: false,
      min: 18,
      max: 50,
    },
    gender: {
      type: String,
      required: false,
      enum: ["M", "F", "O"],
    },
    photoUrl: {
      type: String,
      validate: (url) => {
        if (!validator.isURL(url)) {
          throw new Error("Invalid URL"); // InValid URL
        }
      },
      default:
        "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2463868853.jpg",
    },
    about: {
      type: String,
      default: "This is my bio",
    },
    skills: {
      type: [String],
      max: 10, // Maximum of 10 skills
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

userSchema.index({ firstName: 1, lastName: 1 }); // Create an index on firstName and lastName for faster queries
userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, "VERYSECRETPA$$WORD", {
    expiresIn: "1h",
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  // Compare the provided password with the stored password
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
// This model can be used to interact with the 'users' collection in the MongoDB database
