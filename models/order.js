const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    customerId: { type: String },
    branchId: { type: String },
    type: { type: String },
    status: { type: String },
    order: { type: [] },
    totalBill: { type: Number },
  },
  { timestamps: true, collection: "Order" }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
