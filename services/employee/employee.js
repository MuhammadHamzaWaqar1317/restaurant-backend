const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { employeeMealSubscription } = require("../../models/employeeMealSub");
const { mealComplaint } = require("../../models/mealComplaint");
const constant = require("../../constants/constant");
const { io } = require("../../socket");

require("dotenv").config();

exports.signUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const secPassword = await bcrypt.hash(password, constant.salt);
    console.log(secPassword);
    const user = await User.create({
      email,
      name,
      password: secPassword,
      level: "0",
      role: "user",
    });
    const authToken = jwt.sign(
      {
        email: user.email,
        role: user.role,
        name: user.name,
        level: user.level,
      },
      process.env.JWT_SECRET
    );
    console.log("Here SignUp", user);
    res.send(authToken);
  } catch (error) {
    console.log(error);
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Incorrect Username or Password" });
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res
        .status(401)
        .send({ message: "Incorrect Username or Password" });
    }
    const subscribedMealUser = await employeeMealSubscription.findOne({
      employeeId: user._id,
    });
    const authToken = jwt.sign(
      {
        email: user.email,
        role: user.role,
        name: user.name,
        level: user.level,
        mealTime: subscribedMealUser.mealTime,
      },
      process.env.JWT_SECRET
    );
    res.send(authToken);
  } catch (error) {
    console.log(error);
  }
};

exports.subscribe = async (req, res) => {
  // Add authnetication so user can only skip his meal
  try {
    // console.log(socket);
    console.log(io);

    // socket.on("newSubscriber", () => {
    //   console.log("socketon in subscribe");
    // });
    io.emit("newSubscriber", { message: "Hello from server" });
    // socket.emit("newSubscriber", { message: "Hello from server" });
    const { name, email, level, mealTime, status } = req.body;
    console.log("status", status);

    const user = await User.findOne({ email });
    console.log("user find", user);

    const alreadySubscribed = await employeeMealSubscription.findOne({
      employeeId: user._id,
      status: constant.subscribe,
    });
    console.log(alreadySubscribed);

    // console.log(reSubscribeUser);

    console.log("alreadySubbed", alreadySubscribed);

    if (alreadySubscribed) {
      return res
        .status(403)
        .send({ error: "User has already availed meal Subscription" });
    }

    const reSubscribeUser = await employeeMealSubscription.updateOne(
      {
        employeeId: user._id,
        status: constant.unsubscribe,
      },
      { mealTime, status: constant.subscribe }
    );
    console.log(reSubscribeUser, "resubUser");

    if (reSubscribeUser.modifiedCount >= 1) {
      console.log("in reSub if");

      return res.status(200).send({ message: "User Subscription Updated" });
    }
    const result = await employeeMealSubscription.create({
      employeeId: user._id,
      mealTime: mealTime,
      status: status,
      lunch: [],
      dinner: [],
    });

    socket.emit("newSubscriber", { message: "Hello from server" });
    return res.status(200).send({ message: "Record created successfully " });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "User with same email already exists" });
  }
};

exports.skipMeal = async (req, res) => {
  console.log("In API SkipMeal");
  const skipMealObj = req.body;
  let { email, lunch, dinner } = skipMealObj;
  console.log(lunch);
  console.log(dinner);

  if (lunch.length != 0) {
    console.log("in lunch condtioj");

    let [dateObj] = lunch;
    dateObj = { ...dateObj, _id: uuidv4() };
    lunch = [dateObj];
  }
  if (dinner.length != 0) {
    console.log("in dinner condtioj");
    let [dateObj] = dinner;
    dateObj = { ...dateObj, _id: uuidv4() };
    dinner = [dateObj];
  }

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      try {
        if (res.locals.email != email && res.locals.role == "user") {
          return res
            .status(404)
            .send({ error: "Cannot Skip Meal of another user" });
        }
        const subscribedEmployee = await employeeMealSubscription.findOne({
          employeeId: user._id,
        });
        console.log("subscribed employee", subscribedEmployee);
        if (!subscribedEmployee) {
          return res
            .status(403)
            .send({ error: "User has not availed meal Subscription" });
        }

        if (
          !subscribedEmployee.mealTime.includes(constant.lunch) &&
          lunch.length != 0
        ) {
          return res
            .status(404)
            .send({ error: "User is not Subscribed to Lunch" });
        }
        if (
          !subscribedEmployee.mealTime.includes(constant.dinner) &&
          dinner.length != 0
        ) {
          return res
            .status(404)
            .send({ error: "User is not Subscribed to Dinner" });
        }
        if (subscribedEmployee?.lunch.length != 0 && lunch.length != 0) {
          subscribedEmployee?.lunch?.forEach(({ start, end }) => {
            if (start == lunch[0].start && end == lunch[0].end) {
              lunch = [];
              return;
            }
          });
        }

        if (subscribedEmployee?.dinner.length != 0 && dinner.length != 0) {
          subscribedEmployee?.dinner?.forEach(({ start, end }) => {
            if (start == dinner[0].start && end == dinner[0].end) {
              dinner = [];
              return;
            }
          });
        }

        try {
          const update = await employeeMealSubscription.updateOne(
            { employeeId: user._id },
            [
              {
                $set: {
                  lunch: {
                    $cond: {
                      if: { $in: [constant.lunch, "$mealTime"] },
                      then: { $setUnion: ["$lunch", lunch] },
                      else: "$lunch",
                    },
                  },
                  dinner: {
                    $cond: {
                      if: { $in: [constant.dinner, "$mealTime"] },
                      then: { $setUnion: ["$dinner", dinner] },
                      else: "$dinner",
                    },
                  },
                },
              },
            ]
          );
          console.log(update);
          return res
            .status(200)
            .send({ message: "Record Created Successfully" });
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }

      return res.send({ message: "Found" });
    } else {
      return res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    console.log("Error skipMeal Post", error);
    return res.status(404).send({ error: "An error Occurred" });
  }
};

exports.getSkipMealDates = async (req, res) => {
  try {
    const email = res.locals.email;

    const user = await User.findOne({ email });
    const subscribedUser = await employeeMealSubscription.findOne({
      employeeId: user._id,
      status: constant.subscribe,
    });
    console.log("in get skip Datess", subscribedUser);

    res.send(subscribedUser);
  } catch (error) {
    console.log("in error");

    console.log(error);
  }
};

exports.deleteSkipMealDate = async (req, res) => {
  try {
    // console.log(req.body);

    const { email, _id } = req.query;
    console.log(email, _id, "req.query");

    // let { mealTime } = req.body;
    // mealTime = mealTime?.map((item) => item.toLowerCase());
    console.log(email);

    // console.log(mealTime);
    console.log("in Delete skip Meal ");
    console.log(_id);

    const user = await User.findOne({ email });
    const subscribedUser = await employeeMealSubscription.updateOne(
      {
        employeeId: user._id,
      },
      {
        $pull: { lunch: { _id }, dinner: { _id } },
      }
    );
    if (subscribedUser.modifiedCount >= 1) {
      res.status(200).send({ message: "Meal Deleted Successfully" });
    }
    console.log(subscribedUser);
  } catch (error) {
    console.log(error);
  }
};

exports.mealComplaint = async (req, res) => {
  try {
    const { email, ...remainingObj } = req.body;

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (res.locals.email != email && res.locals.role == "user") {
      return res
        .status(404)
        .send({ error: "Cannot Issue Meal Complaint of another user" });
    }
    const subscribedEmployee = await employeeMealSubscription.findOne({
      employeeId: user._id,
    });

    if (!subscribedEmployee) {
      return res
        .status(403)
        .send({ error: "User has not availed meal Subscription" });
    }
    const result = await mealComplaint.create({
      employeeId: user._id,
      ...remainingObj,
    });
    return res.status(200).send({ message: "Record created Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: "An error occurred " });
  }
};
