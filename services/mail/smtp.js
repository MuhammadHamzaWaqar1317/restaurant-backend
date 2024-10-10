function mail(mealNumber) {
  const axios = require("axios");
  const HttpException = require("./HttpException");

  require("dotenv").config();

  const sendEmail = async (to, obj) => {
    try {
      const response = await axios.post(
        `${process.env.MAILING_SERVER}/sendEmail`,
        {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: "false",
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
          from: process.env.SMTP_FROM,
          to,
          subject: obj.msg,
          html: obj.html,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, "ResponseCode.BAD_REQUEST");
    }
  };

  // Usage example
  const mailData = {
    msg: "Sofit meal request",
    html: `Today meal numbers :${mealNumber} `,
  };
  const sendMealReq = async () => {
    try {
      const result = await sendEmail("hamzawaqar1317@gmail.com", mailData);
      console.log("mail sent");
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  sendMealReq();
}

module.exports = mail;
