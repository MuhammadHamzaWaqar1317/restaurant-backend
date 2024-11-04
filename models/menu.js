const mongoose = require("mongoose");

const menuSchema = mongoose.Schema(
  {
    name: { type: String },
    categoryId: { type: String },
    description: { type: String },
    price: { type: String },
    size: { type: String },
    img: { type: String },
  },
  { timestamps: true, collection: "menu" }
);

const Menu = mongoose.model("menu", menuSchema);

module.exports = { Menu };
