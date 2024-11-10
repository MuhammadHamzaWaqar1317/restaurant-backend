const bcrypt = require("bcryptjs");

exports.salt = bcrypt.genSaltSync(10);

exports.roles = {
  admin: "admin",
  user: "user",
  passwordReset: "passwordReset",
};
