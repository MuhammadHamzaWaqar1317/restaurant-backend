const mongoose = require("mongoose");

const branchSchema = mongoose.Schema(
  {
    address: { type: String },
    contactNum: { type: String },
    tables: { type: [] },
  },
  { timestamps: true, collection: "branch" }
);

const Branch = mongoose.model("branch", branchSchema);

module.exports = { Branch };
