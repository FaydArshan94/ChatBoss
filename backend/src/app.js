const express = require('express');
const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const cors = require('cors');
const {app} = require('./lib/socket.js');

const cookieParser = require('cookie-parser');


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ],
    credentials: true,
  })
);



app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

module.exports = app;