const { mealRecord } = require("../../models/mealRecord");

const query = [
  {
    $lookup: {
      from: "employee",
      localField: "employeeId",
      foreignField: "_id",
      as: "employeeDetails",
    },
  },
  {
    $addFields: {
      name: "$employeeDetails.name",
      email: "$employeeDetails.email",
    },
  },
  {
    $lookup: {
      from: "guestSchema",
      localField: "employeeId",
      foreignField: "_id",
      as: "guestDetails",
    },
  },
  {
    $addFields: {
      name: {
        $cond: {
          if: { $gt: [{ $size: "$employeeDetails" }, 0] },
          then: { $arrayElemAt: ["$employeeDetails.name", 0] },
          else: { $arrayElemAt: ["$guestDetails.name", 0] },
        },
      },
      email: {
        $cond: {
          if: { $gt: [{ $size: "$employeeDetails" }, 0] },
          then: { $arrayElemAt: ["$employeeDetails.email", 0] },
          else: { $arrayElemAt: ["$guestDetails.email", 0] },
        },
      },
      level: {
        $cond: {
          if: { $gt: [{ $size: "$employeeDetails" }, 0] },
          then: { $arrayElemAt: ["$employeeDetails.level", 0] },
          else: { $arrayElemAt: ["$guestDetails.level", 0] },
        },
      },
    },
  },
  { $unset: "guestDetails" },
  { $unset: "employeeDetails" },
];

exports.getMealData = async (req, res) => {
  try {
    const result = await mealRecord.aggregate([...query]);
    return res.send(result);
  } catch (error) {
    console.log("Meal Record Get: ", error);
  }
};

exports.getDropdownFilterData = async (req, res) => {
  try {
    const filterObj = req.query;
    const { year, month, rangeStart, rangeEnd } = filterObj;
    console.log(filterObj);
    let { mealTime } = filterObj;
    let { search } = filterObj;
    const regex = new RegExp(search, "i");
    if (mealTime == "ALL" || mealTime == "undefined") {
      mealTime = false;
    }
    if (search == "undefined") {
      search = false;
    }
    console.log(rangeStart, rangeEnd);

    if (search) {
      try {
        const result = await mealRecord.aggregate([
          ...query,
          {
            $match: {
              $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
            },
          },
        ]);
        return res.send(result);
      } catch (error) {
        console.log(error);
      }
    }

    if (rangeStart && mealTime) {
      const result = await mealRecord.aggregate([
        {
          $match: {
            mealTime: mealTime,
            date: {
              $gte: rangeStart,
              $lte: rangeEnd,
            },
          },
        },
        ...query,
      ]);
      console.log("MEALTIME");
      return res.send(result);
    }
    if (rangeStart) {
      const result = await mealRecord.aggregate([
        {
          $match: {
            date: {
              $gte: rangeStart,
              $lte: rangeEnd,
            },
          },
        },
        ...query,
      ]);
      console.log("result", result);
      console.log(filterObj);
      return res.send(result);
    }
  } catch (error) {
    console.log(error);
  }
};
