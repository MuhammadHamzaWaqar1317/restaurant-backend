const { Reservation } = require("../../models/reservation");
const { Branch } = require("../../models/branch");
const { User } = require("../../models/user");
const { io } = require("../../socket");
const ObjectId = require("mongodb").ObjectId;

const checkCapacity = async (body, updateReservation) => {
  try {
    const { branchId, startTime, endTime, date, peopleQty, _id } = body;
    const branchData = await Branch.findOne({ _id: branchId });

    let conditions = {
      branchId,
      date,
      $and: [
        { startTime: { $lte: endTime } },
        { endTime: { $gte: startTime } },
      ],
    };

    if (updateReservation) {
      const obj_id = new ObjectId(_id);
      conditions = { ...conditions, _id: { $ne: obj_id } };
    }

    let seatingCapacity = 0;
    let reservedseats = 0;
    branchData.tables?.forEach(({ seatingSize, qty }) => {
      seatingCapacity += seatingSize * qty;
    });

    const reservationData = await Reservation.aggregate([
      {
        $match: {
          ...conditions,
        },
      },
    ]);

    reservationData?.forEach(({ peopleQty }) => {
      console.log(peopleQty);

      reservedseats += peopleQty;
    });
    reservedseats += peopleQty;

    if (reservedseats > seatingCapacity) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.getReservation = async (req, res) => {
  try {
    let fetchData = [
      {
        $addFields: {
          customerId: { $toObjectId: "$customerId" },
          branchId: { $toObjectId: "$branchId" },
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: { path: "$customerDetails" },
      },
      {
        $addFields: {
          customerName: "$customerDetails.name",
        },
      },
      { $unset: "customerDetails" },
      {
        $lookup: {
          from: "branch",
          localField: "branchId",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      {
        $unwind: { path: "$branchDetails" },
      },
      {
        $addFields: {
          branchAddress: "$branchDetails.address",
        },
      },
      { $unset: "branchDetails" },
    ];
    if (res.locals.role == "user") {
      const userFetch = {
        $match: {
          customerId: res.locals._id,
        },
      };
      fetchData = [{ ...userFetch }, ...fetchData];
    }
    const result = await Reservation.aggregate([...fetchData]);
    console.log(result);

    // result.forEach((item) => {
    //   item.toObject();
    // });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
};

exports.addReservation = async (req, res) => {
  const { branchId, startTime, endTime, date, peopleQty } = req.body;

  try {
    const capacity = await checkCapacity(req.body, false);
    if (capacity) {
      return res.status(404).send({
        error:
          "All seats are reserved at the moment Kindly try a different time slot",
      });
    } else {
      const reservationSuccessfull = await Reservation.create({
        customerId: res.locals._id,
        branchId,
        startTime,
        endTime,
        date,
        peopleQty,
      });

      const user = await User.findOne({ _id: res.locals._id });
      console.log(user);

      io.emit("reservation_added", {
        ...reservationSuccessfull.toObject(),
        customerName: user.name,
      });
      res.status(200).send({
        message: "Reservation Created Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error });
  }
};

exports.updateReservation = async (req, res) => {
  const {
    branchId,
    customerId,
    customerName,
    startTime,
    endTime,
    date,
    peopleQty,
    _id,
  } = req.body;

  try {
    //                            REFER to later I think clash :)
    const checkDateChange = await Reservation.findOne({ _id });

    if (checkDateChange.date != date) {
      console.log("date change");

      const capacity = await checkCapacity(req.body, false);
      if (capacity) {
        return res.status(404).send({
          error:
            "All seats are reserved at the moment Kindly try a different time slot",
        });
      } else {
        const reservationupdated = await Reservation.updateOne(
          { _id },
          {
            branchId,
            startTime,
            endTime,
            date,
            peopleQty,
          }
        );
        io.emit("reservation_updated", {
          branchId,
          startTime,
          endTime,
          date,
          peopleQty,
          customerId,
          customerName,
          _id,
        });
        res.status(200).send({
          message: "Reservation updated Successfully",
        });
      }
    } else {
      const capacity = await checkCapacity(req.body, true);
      if (capacity) {
        return res.status(404).send({
          error:
            "All seats are reserved at the moment Kindly try a different time slot",
        });
      } else {
        const reservationupdated = await Reservation.updateOne(
          { _id },
          {
            branchId,
            startTime,
            endTime,
            date,
            peopleQty,
          }
        );

        io.emit("reservation_updated", {
          branchId,
          startTime,
          endTime,
          date,
          peopleQty,
          customerId,
          customerName,
          _id,
        });

        res.status(200).send({
          message: "Reservation updated Successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { _id, customerId } = req.query;

    const result = await Reservation.deleteOne({ _id });

    io.emit("reservation_deleted", { _id, customerId });

    res.status(200).send({ message: "Reservation deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};
