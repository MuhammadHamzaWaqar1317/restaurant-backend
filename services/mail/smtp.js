const axios = require("axios");
const HttpException = require("./HttpException");
const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "prince.corkery43@ethereal.email",
    pass: "jCPcqPhvzdwCs9E3RX",
  },
});

exports.sendEmail = async (email, OTP) => {
  const info = await transporter.sendMail({
    from: "prince.corkery43@ethereal.email", // sender address
    to: `${email}`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `${OTP}`, // plain text body
    html: `<b>${OTP}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
