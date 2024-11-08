const bcrypt = require("bcryptjs");

exports.salt = bcrypt.genSaltSync(10);

exports.roles = {
  admin: "admin",
  user: "user",
  passwordReset: "passwordReset",
};

exports.lunch = "Lunch";
exports.dinner = "Dinner";
exports.subscribe = "Subscribed";
exports.unsubscribe = "Unsubscribed";
