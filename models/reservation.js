const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema(
  {
    customerId: {},
    branchId: {},
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    peopleQty: {},
  },
  { timestamps: true, collection: "reservation" }
);

const Reservation = mongoose.model("reservation", reservationSchema);

module.exports = { Reservation };
