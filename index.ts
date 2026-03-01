const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { jwtVerify } = require("jose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = 5000;

const app = express();
const server = createServer(app);

const corsOptions = {
  origin: "*", // Update with your client origin
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (token) {
      console.log(process.env.JWT_SECRET);
      let { payload: user } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || "")) as any;
      if (!user) next(new Error("Authentciation error"));
      console.log(user);
      socket.data.user = user;
      next();
    } else {
      next(new Error('Authentication error'));
    }
  } catch (e: any) {
    console.error(e);
    next(new Error('Authentication error'));
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
    socket.on('draw', (...args) => {
      socket.broadcast.to(socket.data.room).emit('draw', ...args);
    });
    socket.on("join", async (room: string) => {
      if (io.sockets.adapter.rooms.get(room)) {
        socket.data.room = room;
        socket.join(room);
        let users = (await io.in(room).fetchSockets()).map(socket => socket.data.user);
        socket.emit("joined", room, users);
        socket.broadcast.to(room).emit("update-users", users);
        io.in(room).emit("get-canvas-data");
      } else {
        socket.emit("rejected")
      }
    });
    socket.on('canvas-data', (data) => {
      if (!socket.data.admin) return;
      socket.broadcast.to(socket.data.room).emit("canvas-data", data);
    });
    socket.on("cursor-move", (data) => {
      socket.broadcast.to(socket.data.room).emit("cursor-move", data);
    });
    socket.on("cursor-leave", (data) => {
      socket.broadcast.to(socket.data.room).emit("cursor-leave", data);
    });
    socket.on("create", () => {
      socket.data.admin = true;
      const room = "id_" + (new Date()).getTime();
      console.log(room);
      socket.join(room);
      socket.data.room = room;
      socket.emit("joined", room, [socket.data.user]);
    });
    socket.on('disconnect', async () => {
      console.log(`${socket.id} disconnected`);
      let users = (await io.in(socket.data.room).fetchSockets()).map(socket => socket.data.user);
      console.log(socket.data.user, socket.data.admin);
      if (socket.data.admin) socket.broadcast.to(socket.data.room).emit("admin-disconnected");
      socket.broadcast.to(socket.data.room).emit("update-users", users);
    });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})