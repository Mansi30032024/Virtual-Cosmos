const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  users[socket.id] = { x: 300, y: 200 };
  io.emit("updateUsers", users);

  socket.on("move", (pos) => {
    users[socket.id] = pos;
    io.emit("updateUsers", users);
  });

  socket.on("sendMessage", (msg) => {
    if (!msg || typeof msg !== "object") return;

    const cleanMsg = {
      text: String(msg.text || ""),
      sender: String(msg.sender || socket.id),
    };
    io.emit("receiveMessage", cleanMsg);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("updateUsers", users);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}...`));