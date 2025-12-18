const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const getSocketUsersMap = {};

function getSocketReceiverId(userId) {
  return getSocketUsersMap[userId];
}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) getSocketUsersMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(getSocketUsersMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete getSocketUsersMap[userId];
    io.emit("getOnlineUsers", Object.keys(getSocketUsersMap));
  });
});

module.exports = {
  app,
  server,
  io,
  getSocketReceiverId,
};
