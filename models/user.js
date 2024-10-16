const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String },
    password: { type: String },
    email: { type: String, unique: true },
    role: { type: String },
    address: { type: String },
    contactNum: {},
  },
  { timestamps: true, collection: "User" }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
