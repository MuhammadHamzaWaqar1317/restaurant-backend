const mongoose = require("mongoose");

const mealSkipObj = {
  start: { type: String },
  end: { type: String },
};
const employeeMealSubSchema = mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealTime: { type: [] },
    status: { type: String },
    lunch: {
      type: [mealSkipObj],
    },
    dinner: {
      type: [mealSkipObj],
    },
  },
  { timestamps: true, collection: "employeeMealSub" }
);

const employeeMealSubscription = mongoose.model(
  "employeeMealSub",
  employeeMealSubSchema
);

module.exports = { employeeMealSubscription };
