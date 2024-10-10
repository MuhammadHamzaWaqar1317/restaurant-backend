const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String },
    password: { type: String },
    email: { type: String, unique: true },
    level: { type: String },
    role: { type: String },
  },
  { timestamps: true, collection: "employee" }
);

const User = mongoose.model("employee", userSchema);

module.exports = { User };
