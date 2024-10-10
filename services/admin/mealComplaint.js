const { mealComplaint } = require("../../models/mealComplaint");

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
      email: { $arrayElemAt: ["$employeeDetails.email", 0] },
    },
  },
  { $unset: "employeeDetails" },
];

exports.getComplaint = async (req, res) => {
  try {
    const result = await mealComplaint.aggregate([
      {
        $match: { status: "unResolve" },
      },
      ...query,
    ]);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
};

exports.resolveComplaint = async (req, res) => {
  const { id } = req.body;
  console.log(id, "patching mealComplaint");
  try {
    const result = await mealComplaint.updateOne(
      { _id: id },
      { $set: { status: "Resolved" } }
    );

    res.send(result);
  } catch (error) {
    console.log(error);
  }
};
