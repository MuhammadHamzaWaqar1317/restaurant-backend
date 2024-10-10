const mongoose = require("mongoose");

const meal_Price_schema = mongoose.Schema(
  {
    singleMealPrice: {
      // type: String,
    },
  },
  { timestamps: true, collection: "mealPrice" }
);
const mealPrice = mongoose.model("mealPrice", meal_Price_schema);

module.exports = { mealPrice };
