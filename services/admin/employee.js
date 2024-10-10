const { User } = require("../../models/user");
const { employeeMealSubscription } = require("../../models/employeeMealSub");
const { employeeCalculations } = require("../../Utils/employeeCalculations");

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
      name: { $arrayElemAt: ["$employeeDetails.name", 0] },
      email: { $arrayElemAt: ["$employeeDetails.email", 0] },
      level: { $arrayElemAt: ["$employeeDetails.level", 0] },
    },
  },
  { $unset: "employeeDetails" },
];

exports.getEmployeeData = async (req, res) => {
  try {
    const resultUser = await employeeMealSubscription.aggregate([...query]);
    const calculation = await employeeCalculations(resultUser);
    res.send(calculation);
    console.log(calculation);
  } catch (error) {
    console.log(error);
  }
};

exports.updateSubscription = async (req, res) => {
  const { employeeId, status, mealTime = false } = req.body;
  console.log("update Sub", employeeId, "mealTime", mealTime);

  try {
    if (mealTime) {
      const result = await employeeMealSubscription.updateOne(
        { employeeId }, // Filter criteria to find the document with the specific email
        { $set: { status, mealTime } } // Update operation to set the status to "Unsub"
      );
      if (result.modifiedCount > 0) {
        console.log("Status Updated");
        return res
          .status(200)
          .send({ message: "Email status updated to Unsubscribe" });
      } else {
        return res.status(404).send({ message: "Email not found " });
      }
    }

    const result = await employeeMealSubscription.updateOne(
      { employeeId }, // Filter criteria to find the document with the specific email
      { $set: { status: status } } // Update operation to set the status to "Unsub"
    );
    if (result.modifiedCount > 0) {
      console.log("Status Updated");
      return res
        .status(200)
        .send({ message: "Email status updated to Unsubscribe" });
    } else {
      return res.status(404).send({ message: "Email not found " });
    }
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

exports.getDropdownFilterData = async (req, res) => {
  let { level, mealTime, status, search } = req.query;
  if (status == "false") {
    status = false;
  }
  if (level == "false") {
    level = false;
  }
  if (mealTime == "false") {
    mealTime = false;
  }
  if (search == "undefined") {
    search = false;
  }
  try {
    if (search) {
      try {
        const regex = new RegExp(search, "i");
        const resultUser = await employeeMealSubscription.aggregate([
          ...query,
          {
            $match: {
              $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
            },
          },
        ]);
        if (resultUser.length == 0) {
          return res.send(resultUser);
        } else {
          const resultCalculations = await employeeCalculations(resultUser);
          return res.send(resultCalculations);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (level && mealTime && status) {
      console.log(level, mealTime, status);
      const resultUser = await employeeMealSubscription.aggregate([
        ...query,
        {
          $match: {
            $and: [
              { level: level },
              { mealTime: { $elemMatch: { $eq: mealTime } } },
              { status: status },
            ],
          },
        },
      ]);
      console.log("Filter employee admin side", resultUser);
      if (resultUser.length == 0) {
        return res.send(resultUser);
      } else {
        const resultCalculations = await employeeCalculations(resultUser);
        return res.send(resultCalculations);
      }
    }
    if (mealTime && status) {
      const resultUser = await employeeMealSubscription.aggregate([
        {
          $match: {
            $and: [
              { mealTime: { $elemMatch: { $eq: mealTime } } },
              { status: status },
            ],
          },
        },
        ...query,
      ]);
      if (resultUser.length == 0) {
        return res.send(resultUser);
      } else {
        const resultCalculations = await employeeCalculations(resultUser);
        return res.send(resultCalculations);
      }
    }
    if (level && mealTime) {
      const resultUser = await employeeMealSubscription.aggregate([
        ...query,
        {
          $match: {
            $and: [
              { level: level },
              { mealTime: { $elemMatch: { $eq: mealTime } } },
            ],
          },
        },
      ]);
      if (resultUser.length == 0) {
        return res.send(resultUser);
      } else {
        const resultCalculations = await employeeCalculations(resultUser);
        return res.send(resultCalculations);
      }
    }
    if (level && status) {
      const resultUser = await employeeMealSubscription.aggregate([
        ...query,
        {
          $match: {
            $and: [{ level: level }, { status: status }],
          },
        },
      ]);
      if (resultUser.length == 0) {
        return res.send(resultUser);
      } else {
        const resultCalculations = await employeeCalculations(resultUser);
        return res.send(resultCalculations);
      }
    }
    if (mealTime) {
      const resultUser = await employeeMealSubscription.aggregate([
        {
          $match: {
            mealTime: { $elemMatch: { $eq: mealTime } },
          },
        },
        ...query,
      ]);
      if (resultUser.length == 0) {
        return res.send(resultUser);
      } else {
        const resultCalculations = await employeeCalculations(resultUser);
        return res.send(resultCalculations);
      }
    }
    if (status) {
      const resultUser = await employeeMealSubscription.aggregate([
        {
          $match: {
            status: status,
          },
        },
        ...query,
      ]);
      if (resultUser.length == 0) {
        return res.send(resultUser);
      } else {
        const resultCalculations = await employeeCalculations(resultUser);
        return res.send(resultCalculations);
      }
    }
    if (level) {
      const resultUser = await employeeMealSubscription.aggregate([
        ...query,
        {
          $match: {
            level: level,
          },
        },
      ]);
      if (resultUser.length == 0) {
        return res.send(resultUser);
      } else {
        const resultCalculations = await employeeCalculations(resultUser);
        return res.send(resultCalculations);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
