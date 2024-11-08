const { Otp } = require("../../models/otp");
const { sendEmail } = require("../mail/smtp");
const constant = require("../../constants/constant");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const generateOtp = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

exports.sendOtp = async (email) => {
  try {
    await Otp.deleteMany({ email });

    const generatedOtp = generateOtp();

    await sendEmail(email, generatedOtp);

    const hashOtp = await bcrypt.hash(generatedOtp, constant.salt);

    await Otp.create({
      email,
      otp: hashOtp,
      expiresAt: Date.now() + 60000,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const findOtp = await Otp.findOne({ email });

    if (Date.now() > findOtp.expiresAt) {
      return res.status(404).send({ error: "OTP expired" });
    }

    if (!findOtp) {
      throw Error("Error occured");
    }
    const validateOtp = await bcrypt.compare(otp, findOtp.otp);
    if (!validateOtp) {
      return res.status(404).send({ error: "Incorrect OTP" });
    }

    const passwordResetToken = jwt.sign(
      {
        role: "passwordReset",
      },
      process.env.JWT_SECRET
    );

    res.send(passwordResetToken);
  } catch (error) {
    console.log(error);
  }
};
