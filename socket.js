const express = require("express");
const http = require("http");
const app = express();
const socket = require("socket.io");
const server = http.createServer(app);
require("dotenv").config();
const io = socket(server, {
  cors: {
    origin: process.env.FRONTEND_LINK,
  },
});

module.exports = { socket, server, io, app };
