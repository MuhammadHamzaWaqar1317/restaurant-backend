const mongoose = require("mongoose");

const additionalMealSchema = mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "guestModel",
      required: true,
    },

    mealTime: {
      type: [],
    },
    date: {
      type: String,
    },
  },
  { timestamps: true, collection: "additionalMeal" }
);

const additionalMeal = mongoose.model("additionalMeal", additionalMealSchema);

module.exports = { additionalMeal };
