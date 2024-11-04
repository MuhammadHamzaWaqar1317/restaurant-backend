const mongoose = require("mongoose");

const menuCategorySchema = mongoose.Schema(
  {
    category: { type: String, unique: true },
  },
  { timestamps: true, collection: "menuCategory" }
);

const MenuCategory = mongoose.model("menuCategory", menuCategorySchema);

module.exports = { MenuCategory };
