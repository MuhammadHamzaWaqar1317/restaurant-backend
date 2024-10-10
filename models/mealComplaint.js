const mongoose = require("mongoose");

const mealComplaintSchema = mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
    },
    complainNature: {
      type: String,
    },

    complainDescription: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true, collection: "mealComplaint" }
);

const mealComplaint = mongoose.model("mealComplaint", mealComplaintSchema);

module.exports = { mealComplaint };
