const mongoose = require("mongoose");

const skipMealAllSchema = mongoose.Schema(
  {
    mealTime: {
      type: String,
    },
    date: {
      type: [],
    },
  },
  { timestamps: true, collection: "skipMealAll" }
);

const skipMealAll = mongoose.model("skipMealAll", skipMealAllSchema);

module.exports = { skipMealAll };
