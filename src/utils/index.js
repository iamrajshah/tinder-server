const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
    );
  }
};

const validateLogin = (req) => {
  console.log(req.body);
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    throw new Error("Email and password are required");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
    );
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format");
  }
};

module.exports = {
  validateSignup,
  validateLogin,
};
