const { skipMealAll } = require("../../models/skipMealAll");
const { employeeMealSubscription } = require("../../models/employeeMealSub");
const constant = require("../../constants/constant");
const { v4: uuidv4 } = require("uuid");

exports.excludeAllMeals = async (req, res) => {
  let { date, mealTime } = req.body;
  let [dateObj1] = date;
  dateObj1 = [{ ...dateObj1, _id: uuidv4() }];
  date = dateObj1;

  let [dateObj2] = date;
  dateObj2 = [{ ...dateObj2, _id: uuidv4() }];

  try {
    const docCount = await skipMealAll.find();
    if (docCount.length == 0) {
      const res = await skipMealAll.create([
        { mealTime: constant.lunch, date: [] },
        { mealTime: constant.dinner, date: [] },
      ]);
    }

    docCount?.map((dates) => {
      if (dates.date.length != 0) {
        const duplicateDates = dates.date?.some(
          ({ start, end }) => start == date[0].start && end == date[0].end
        );
        if (duplicateDates) {
          if (dates.mealTime == constant.lunch) {
            dateObj1 = [];
          } else {
            dateObj2 = [];
          }
        }
      }
    });
    console.log(dateObj1, "dateObj1", dateObj2, "dateObj2");

    if (mealTime.length != 2) {
      const dateToInsert = mealTime[0] === constant.lunch ? dateObj1 : dateObj2;

      const result = await skipMealAll.updateOne(
        { mealTime: mealTime[0] },
        { $addToSet: { date: { $each: dateToInsert } } }
      );
      console.log(result);

      if (result.modifiedCount > 0) {
        return res.status(200).send({
          message: `${mealTime[0]} updated skip date of ALL employee`,
        });
      } else {
        return res.status(404).send({ message: "Error occured " });
      }
    } else {
      await skipMealAll.updateOne(
        { mealTime: constant.lunch },
        { $addToSet: { date: { $each: dateObj1 } } }
      );

      await skipMealAll.updateOne(
        { mealTime: constant.dinner },
        { $addToSet: { date: { $each: dateObj2 } } }
      );
      return res.status(200).send({
        message: ` updated skiped date of ALL employee`,
      });
      // const result = await skipMealAll.updateMany(
      //   {},
      //   { $addToSet: { date: { $each: date } } }
      // );
      // if (result.modifiedCount > 0) {
      //   return res.status(200).send({
      //     message: ` updated skiped date of ALL employee`,
      //   });
      // } else {
      //   return res.status(404).send({ message: "Error occured " });
      // }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getAllMealSkips = async (req, res) => {
  try {
    const result = await skipMealAll.find();
    console.log("here get all meal skip dates", result);
    const data = result?.map(({ mealTime, date }) => {
      const newDates = date?.map((dateArr) => {
        console.log(dateArr);

        return { ...dateArr, mealTime };
      });
      console.log(newDates, "newDates");

      return newDates;
    });
    const combineAllObjInSingleArray = data?.flat();
    res.send(combineAllObjInSingleArray);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteSingleAllMealSkip = async (req, res) => {
  try {
    const { mealTime, skipDateId } = req.query;
    // console.log(employeeId, skipDateId);

    const result = await skipMealAll.updateOne(
      {
        mealTime,
      },
      {
        $pull: { date: { _id: skipDateId } },
      }
    );
    if (result.modifiedCount >= 1) {
      res.status(200).send({ message: "Meal Deleted Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getEmployeeMealSkips = async (req, res) => {
  try {
    console.log("here");

    const user = await employeeMealSubscription.aggregate([
      {
        $match: {
          status: constant.subscribe,
          $or: [{ lunch: { $ne: [] } }, { dinner: { $ne: [] } }],
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
          name: "$employeeDetails.name",
          email: "$employeeDetails.email",
          level: "$employeeDetails.level",
        },
      },
      { $unset: "employeeDetails" },
    ]);

    const userDataWithMealSkips = user?.map((userData) => {
      const { mealTime, dinner: dinnerSkip, lunch: lunchSkip } = userData;
      if (
        mealTime.includes(constant.lunch) &&
        mealTime.includes(constant.dinner)
      ) {
        const dinner = dinnerSkip?.map((item) => {
          return { ...item, mealTime: [constant.dinner] };
        });
        const lunch = lunchSkip?.map((item) => {
          return { ...item, mealTime: [constant.lunch] };
        });
        console.log(lunch, dinner);
        return { ...userData, mealSkips: [...lunch, ...dinner] };
        // setMealSkips([...lunch, ...dinner]);
        // state.userSkipMealDates = [...lunch, ...dinner];
      } else if (mealTime.includes(constant.lunch)) {
        console.log("lunch ");
        const lunch = lunchSkip?.map((item) => {
          return { ...item, mealTime: [constant.lunch] };
        });
        return { ...userData, mealSkips: [...lunch] };
        // state.userSkipMealDates = lunch;
      } else if (mealTime.includes(constant.dinner)) {
        console.log(" Dinner");
        const dinner = dinnerSkip?.map((item) => {
          return { ...item, mealTime: [constant.dinner] };
        });
        return { ...userData, mealSkips: [...dinner] };
        // state.userSkipMealDates = dinner;
      }
    });

    console.log(userDataWithMealSkips);

    res.send(userDataWithMealSkips);
    // console.log(user);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteEmployeeMealSkip = async (req, res) => {
  console.log("here in admin skipdate delete");

  try {
    const { employeeId, skipDateId } = req.query;
    console.log(employeeId, skipDateId);

    const subscribedUser = await employeeMealSubscription.updateOne(
      {
        employeeId,
      },
      {
        $pull: { lunch: { _id: skipDateId }, dinner: { _id: skipDateId } },
      }
    );
    if (subscribedUser.modifiedCount >= 1) {
      res.status(200).send({ message: "Meal Deleted Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};
