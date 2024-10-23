const express = require("express");
const constant = require("./constants/constant");
const cors = require("cors");
const cron = require("node-cron");

const { io, server, app } = require("./socket");
io.on("connection", (socket) => {
  io.to(socket.id).emit("connection", { socketId: socket.id });
});

const bodyParser = require("body-parser");

const { connectDB } = require("./config/database");

require("dotenv").config();

connectDB();
app.use(bodyParser.json());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(
  "/authenticated",
  require("./middleware/authToken"),
  require("./routes/authenticated")
);
app.use("/unauthenticated", require("./routes/unauthenticated"));

server.listen(process.env.PORT, () => console.log("server Started"));
