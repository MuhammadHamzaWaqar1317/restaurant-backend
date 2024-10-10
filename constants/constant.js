const bcrypt = require("bcryptjs");

exports.salt = bcrypt.genSaltSync(10);

exports.lunch = "Lunch";
exports.dinner = "Dinner";
exports.subscribe = "Subscribed";
exports.unsubscribe = "Unsubscribed";
