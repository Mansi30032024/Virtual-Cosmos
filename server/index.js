const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const WORLD_WIDTH = 1340;
const WORLD_HEIGHT = 900;
const AVATAR_HALF = 46;

const OFFICE_AREAS = [
  { id: "work", x: 40, y: 120, width: 510, height: 350 },
  { id: "meeting", x: 600, y: 120, width: 700, height: 350 },
  { id: "lounge", x: 140, y: 540, width: 1060, height: 280 },
];
const CHAT_ENABLED_ZONES = new Set(["meeting", "lounge"]);

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let users = {};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const isValidPosition = (pos) =>
  pos &&
  typeof pos === "object" &&
  Number.isFinite(pos.x) &&
  Number.isFinite(pos.y);

const sanitizePosition = (pos) => ({
  x: clamp(pos.x, AVATAR_HALF, WORLD_WIDTH - AVATAR_HALF),
  y: clamp(pos.y, 96 + AVATAR_HALF, WORLD_HEIGHT - 60),
});

const getAreaForPosition = (pos) =>
  OFFICE_AREAS.find(
    (area) =>
      pos.x >= area.x &&
      pos.x <= area.x + area.width &&
      pos.y >= area.y &&
      pos.y <= area.y + area.height
  ) || null;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  users[socket.id] = { x: 190, y: 285, name: "Guest" };
  io.emit("updateUsers", users);

  socket.on("registerUser", (payload) => {
    const name = String(payload?.name || "").trim().slice(0, 24);
    if (!name || !users[socket.id]) return;

    users[socket.id] = {
      ...users[socket.id],
      name,
    };
    io.emit("updateUsers", users);
  });

  socket.on("move", (pos) => {
    if (!isValidPosition(pos)) return;

    users[socket.id] = {
      ...users[socket.id],
      ...sanitizePosition(pos),
    };
    io.emit("updateUsers", users);
  });

  socket.on("sendMessage", (msg) => {
    if (!msg || typeof msg !== "object") return;
    if (!CHAT_ENABLED_ZONES.has(getAreaForPosition(users[socket.id])?.id)) return;

    const cleanMsg = {
      text: String(msg.text || ""),
      sender: String(msg.sender || socket.id),
      senderName: String(users[socket.id]?.name || "Guest"),
    };

    if (!cleanMsg.text.trim()) return;

    Object.entries(users).forEach(([userId, user]) => {
      if (CHAT_ENABLED_ZONES.has(getAreaForPosition(user)?.id)) {
        io.to(userId).emit("receiveMessage", cleanMsg);
      }
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("updateUsers", users);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
