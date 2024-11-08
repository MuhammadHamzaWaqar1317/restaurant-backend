const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    email: { type: String, unique: true },
    otp: { type: String },
    expiresAt: { type: Date },
  },
  { timestamps: true, collection: "OTP" }
);

const Otp = mongoose.model("OTP", otpSchema);

module.exports = { Otp };
