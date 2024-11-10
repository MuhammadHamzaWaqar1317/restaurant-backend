const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

exports.sendEmail = async (email, OTP) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER, // sender address
    to: `${email}`, // list of receivers
    subject: "Man-o-salwa OTP ✔", // Subject line
    text: `${OTP}`, // plain text body
    html: `<b>${OTP}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
