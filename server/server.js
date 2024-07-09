const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const { createServer } = http;
const { Server } = socketIo;
const app = express();
const cors = require("cors");
app.use(cors());
app.get("/", (req, res, next) => {
  res.send("Hello from the server");
});
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});
io.use((socket, next) => {
  next();
}); // we can have a middlewre too in the socket.io
io.on("connection", (socket) => {
  console.log("User connected");
  console.log("Id", socket.id);
  socket.emit("welcome", `Welcome to the server`);
  //what this will do is it will emit this message for all the client in the circuit except the one
  //trigger the event
  socket.broadcast.emit("welcome", `${socket.id} joined the server`);
  socket.on("disconnect", () => {
    console.log(`User with ${socket.id} disconnected`);
  });
  socket.on("message", (data) => {
    console.log(data);
    //io.emit("recieve-message", data); //to send to the entire circuit
    io.to(data.room).emit("recieve-message", data.message); //to send message to specific client
  });
  socket.on("join-room", (room) => {
    socket.join(room);
  });
});
const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
