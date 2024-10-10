const { User } = require("../../models/user");
const { employeeMealSubscription } = require("../../models/employeeMealSub");
const { mealRecord } = require("../../models/mealRecord");
const { mealPrice } = require("../../models/mealPrice");
const constant = require("../../constants/constant");

exports.getdata = async (req, res) => {
  const date = new Date().getFullYear();
  const regex = new RegExp(date, "i");
  try {
    const monthlyMealReport = await mealRecord.aggregate([
      {
        $match: {
          date: { $regex: regex },
        },
      },
      {
        $addFields: {
          month: {
            $substr: ["$date", 5, 2],
          },
        },
      },
      {
        $addFields: {
          month_name: {
            $switch: {
              branches: [
                { case: { $eq: ["$month", "01"] }, then: "January" },
                { case: { $eq: ["$month", "02"] }, then: "February" },
                { case: { $eq: ["$month", "03"] }, then: "March" },
                { case: { $eq: ["$month", "04"] }, then: "April" },
                { case: { $eq: ["$month", "05"] }, then: "May" },
                { case: { $eq: ["$month", "06"] }, then: "June" },
                { case: { $eq: ["$month", "07"] }, then: "July" },
                { case: { $eq: ["$month", "08"] }, then: "August" },
                { case: { $eq: ["$month", "09"] }, then: "September" },
                { case: { $eq: ["$month", "10"] }, then: "October" },
                { case: { $eq: ["$month", "11"] }, then: "November" },
                { case: { $eq: ["$month", "12"] }, then: "December" },
              ],
              default: "Unknown",
            },
          },
        },
      },
      {
        $group: {
          _id: "$month",
          month_name: { $first: "$month_name" },
          totalEmpContDollar: { $sum: "$empContDollar" },
          totalCompanyContDollar: { $sum: "$companyContDollar" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          month_name: 1,
          totalEmpContDollar: 1,
          totalCompanyContDollar: 1,
        },
      },
    ]);

    const subscribed = await employeeMealSubscription.countDocuments({
      status: "Subscribed",
    });
    const lunch = await employeeMealSubscription.countDocuments({
      status: "Subscribed",
      mealTime: constant.lunch,
    });
    const dinner = await employeeMealSubscription.countDocuments({
      status: "Subscribed",
      mealTime: constant.dinner,
    });
    const sigleMealPrice = await mealPrice.find({});

    const { singleMealPrice } = sigleMealPrice[0];
    console.log("subscribed", subscribed);

    console.log("lunch", lunch);
    console.log("dinner", dinner);
    console.log("mealPrice", singleMealPrice);

    return res.send({
      subscribed,
      lunch,
      dinner,
      monthlyMealReport,
      singleMealPrice,
    });
  } catch (error) {
    console.log(error);
  }
};
