const mongoose = require("mongoose");

const mealRecordSchema = mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    companyContPercent: {},
    empContPercent: {},
    companyContDollar: {},
    empContDollar: {},
    date: {
      type: String,
    },
    mealTime: {
      type: [],
    },
  },
  { timestamps: true, collection: "mealRecord" }
);

const mealRecord = mongoose.model("mealRecord", mealRecordSchema);

module.exports = { mealRecord };
