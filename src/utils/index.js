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

const validateEditProfile = (req) => {
  const allowedFields = [
    "photoUrl",
    "about",
    "skills",
    "firstName",
    "lastName",
    "age",
    "gender",
  ];
  const result = Object.keys(req.body).every((key) =>
    allowedFields.includes(key)
  );
  if (!result) {
    throw new Error("Invalid fields in request body");
  }
  if (req.body.photoUrl && !validator.isURL(req.body.photoUrl)) {
    throw new Error("Invalid photo URL format");
  }
};

const validateChangePassword = (req) => {
  const { oldPassword, newPassword } = req.body;
  const { user } = req;
  if (!oldPassword || !newPassword) {
    throw new Error("Old password and new password are required");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      "New password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
    );
  }
};

module.exports = {
  validateSignup,
  validateLogin,
  validateEditProfile,
  validateChangePassword,
};
