const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const constant = require("../../constants/constant");
const { io } = require("../../socket");
const { sendOtp, verifyOtp } = require("../OTP/Otp");

require("dotenv").config();

exports.signUp = async (req, res) => {
  try {
    const { admin, user } = constant.roles;
    const { email, name, password, socketId } = req.body;
    console.log("socket ID ", socketId);

    const secPassword = await bcrypt.hash(password, constant.salt);

    const userPresent = await User.findOne();

    const newUser = await User.create({
      email,
      name,
      password: secPassword,
      role: !userPresent ? admin : user,
      address: "",
      contactNum: "49",
    });
    const authToken = jwt.sign(
      {
        _id: newUser._id,
        role: !userPresent ? admin : user,
      },
      process.env.JWT_SECRET
    );
    io.to(socketId).emit("sign_up_successfull", {
      message: "SignUp Successfull",
    });
    res.send(authToken);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Email already in Use" });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: "Incorrect Username or Password" });
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(401).send({ error: "Incorrect Username or Password" });
    }
    const authToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET
    );
    res.send(authToken);
  } catch (error) {
    console.log(error);
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { admin } = constant.roles;

    if (res.locals.role == admin) {
      const result = await User.find({});
      res.status(200).send(result);
    } else {
      const result = await User.findOne({ _id: res.locals._id });
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    const found = await User.findOne({ email });
    if (!found) {
      return res.status(404).send({ error: "Email does not exists" });
    }

    await sendOtp(email);

    res.send({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    await verifyOtp(req, res);
  } catch (error) {
    console.log(error);
  }
};

exports.createNewPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(email, newPassword);

    const secPassword = await bcrypt.hash(newPassword, constant.salt);

    const result = await User.updateOne({ email }, { password: secPassword });

    res.status(200).send({ message: "Password Reset Successfull" });
  } catch (error) {
    console.log(error);
  }
};
