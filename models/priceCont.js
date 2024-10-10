const mongoose = require("mongoose");

const priceContSchema = mongoose.Schema(
  {
    companyContPercent: {
      // type: String,
    },
    empContPercent: {
      // type: String,
    },
    level: {
      // type: String,
    },
    mealTime: {},
  },
  { timestamps: true, collection: "priceContribution" }
);
const PriceCont = mongoose.model("priceContribution", priceContSchema);

module.exports = { PriceCont };
