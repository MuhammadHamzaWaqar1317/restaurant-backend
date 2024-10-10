const express = require("express");
const http = require("http");
const app = express();
const socket = require("socket.io");
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

module.exports = { socket, server, io, app };
