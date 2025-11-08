const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { RoomManager } = require("./rooms");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://collaborative-canvas-1.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});


// Manage rooms & drawing state
const rooms = new RoomManager();

app.use("/", express.static(path.join(__dirname, "..", "client")));

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  const currentRoom = "main";
  const room = rooms.getOrCreate(currentRoom);

 room.addClient(socket.id);

  // Send initial state
  socket.emit("history", room.state.getActiveOps());

  // ✅ Send updated user list (only active users)
  io.emit("userList", room.getClientList());

  // Live drawing
  socket.on("draw", (segment) => {
    socket.broadcast.emit("draw", segment);
  });

  // Operation commit
  socket.on("op", (op) => {
    if (!op) return;
    const newOp = room.state.appendOp(op, socket.id);
    io.emit("op", newOp);
  });

  // Undo / Redo
 socket.on("undo", () => {
  const ok = room.state.undo();
  console.log("UNDO:", ok, "remaining undo:", room.state.undoneStack.length);
  if (ok) io.emit("history", room.state.getActiveOps());
});

socket.on("redo", () => {
  const op = room.state.redo();
  console.log("REDO OP:", op);
  if (op) io.emit("history", room.state.getActiveOps());
});


  // Live pointer sharing
  socket.on("pointer", (data) => {
    const user = room.getUser(socket.id);
    if (!user) return;

    socket.broadcast.emit("pointer", {
      clientId: socket.id,
      color: user.color,
      username: user.username,
      x: data.x,
      y: data.y,
    });
  });

  // On disconnect
  socket.on("disconnect", () => {
    room.removeClient(socket.id);
    io.emit("userList", room.getClientList());
    socket.broadcast.emit("removeCursor", { clientId: socket.id });
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Serve client
app.use(express.static(path.join(__dirname, "../client")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// ✅ ONLY ONE LISTEN CALL
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
