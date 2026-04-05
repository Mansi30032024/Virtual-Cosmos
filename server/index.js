const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  users[socket.id] = { x: 300, y: 200 };

  socket.on("move", (pos) => {
    users[socket.id] = pos;
    io.emit("updateUsers", users);
  });

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", {
      id: socket.id,
      text: msg,
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("updateUsers", users);
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server running on port 5000");
});