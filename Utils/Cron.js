const mail = require("../services/mail/smtp");

const { skipMealAll } = require("../models/skipMealAll");
const { User } = require("../models/user");
const { employeeMealSubscription } = require("../models/employeeMealSub");
const { additionalMeal } = require("../models/additionalMeal");
const { mealPrice } = require("../models/mealPrice");
const { PriceCont } = require("../models/priceCont");
const { mealRecord } = require("../models/mealRecord");

const Cron = async (mealSkip, mealTime) => {
  function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const sysDate = `${year}-${month}-${day}`;
    return sysDate;
  }
  const date = getCurrentDate();

  const allSkipMeal = await skipMealAll.find({
    mealTime: mealTime,
    date: {
      $elemMatch: {
        start: { $gte: date },
        end: { $lte: date },
      },
    },
  });

  if (allSkipMeal.length != 0) {
    console.log("all employees meal Skip");
    return;
  }

  const employees = await employeeMealSubscription.aggregate([
    {
      $match: {
        mealTime: mealTime,
        status: "Subscribed",
        [mealSkip]: {
          $not: {
            $elemMatch: {
              start: { $gte: date },
              end: { $lte: date },
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "employee",
        localField: "employeeId",
        foreignField: "_id",
        as: "employeeDetails",
      },
    },
    { $unwind: "$employeeDetails" },
    {
      $addFields: {
        employeeId: "$employeeDetails._id",
        level: "$employeeDetails.level",
      },
    },
    { $unset: ["employeeDetails", "_id"] },

    {
      $project: {
        "employeeDetails.name": 1,
        employeeId: 1,
        mealTime: 1,
        level: 1,
      },
    },
  ]);

  if (employees.length == 0) {
    console.log("After all employees meal Skip");
    return;
  }

  const additionalMealReq = await additionalMeal.aggregate([
    {
      $match: {
        date: date, //date,
        mealTime: mealTime,
      },
    },
    {
      $lookup: {
        from: "guestSchema",
        localField: "guestId",
        foreignField: "_id",
        as: "guestDetails",
      },
    },
    { $unwind: "$guestDetails" },
    {
      $addFields: {
        employeeId: "$guestDetails._id",
      },
    },
    { $unset: ["guestDetails", "_id"] },

    {
      $project: {
        "employeeDetails.name": 1,
        employeeId: 1,
        mealTime: 1,
        level: 1,
      },
    },
  ]);
  console.log(additionalMealReq);

  console.log("additional  Meal Req", additionalMealReq);
  if (additionalMealReq.length != 0) {
    additionalMealReq.map((item) => {
      employees.push(item);
    });
  }

  console.log("After addtional meal", employees);

  const sigleMealPrice = await mealPrice.find({});

  const { singleMealPrice } = sigleMealPrice[0];

  const contributionPercent = await PriceCont.find(
    {},
    { companyContPercent: 1, empContPercent: 1, level: 1, _id: 0 }
  );
  console.log(contributionPercent);

  const contributionLevelsObj = contributionPercent.reduce((acc, item) => {
    acc[item.level] = {
      companyContPercent: item.companyContPercent,
      empContPercent: item.empContPercent,
      companyContDollar: item.companyContPercent * singleMealPrice,
      empContDollar: item.empContPercent * singleMealPrice,
      date: date, //date, //Change to SYSTEM Date
      mealTime: [mealTime],
    };
    return acc;
  }, {});

  const employeeMealRecord = employees.map((item) => {
    updatedItem = { ...item, ...contributionLevelsObj[item.level ?? "0"] };
    return updatedItem;
  });
  console.log("employeeRecord", employeeMealRecord);

  const size = employeeMealRecord.length;
  console.log("size", size);

  // mail(size); //send Mail to vendor
  console.log("ardgerweasrdgrer", size, employeeMealRecord);

  try {
    const Res = await mealRecord.insertMany(employeeMealRecord);
    console.log(Res);
  } catch (error) {
    console.log(error, "ERROR in mealRecord");
  }
};

module.exports = { Cron };
