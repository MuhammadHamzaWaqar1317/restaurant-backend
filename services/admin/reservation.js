const { Reservation } = require("../../models/reservation");
const { Branch } = require("../../models/branch");
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
    const result = await Reservation.find({});
    result.forEach((item) => {
      item.toObject();
    });
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
        branchId,
        startTime,
        endTime,
        date,
        peopleQty,
      });

      res.status(200).send({
        ...reservationSuccessfull.toObject(),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error });
  }
};

exports.updateReservation = async (req, res) => {
  const { branchId, startTime, endTime, date, peopleQty, _id } = req.body;

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
    const { _id } = req.query;

    const result = await Reservation.deleteOne({ _id });

    res.status(200).send({ message: "Branch deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};
