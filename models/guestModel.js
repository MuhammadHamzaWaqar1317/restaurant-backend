const mongoose = require("mongoose");

const guestSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: String,
    },
  },
  { timestamps: true, collection: "guestSchema" }
);

const guestModel = mongoose.model("guestSchema", guestSchema);

module.exports = { guestModel };
