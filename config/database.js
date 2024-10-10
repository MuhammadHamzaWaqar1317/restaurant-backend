const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  mongoose
    .connect(process.env.DB_LINK)
    .then(() => console.log("Connected"))
    .catch((err) => {
      console.log(err);
      setInterval(() => {
        connectDB();
      }, [5000]);
    });
};

module.exports = { connectDB };
