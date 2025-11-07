const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { RoomManager } = require("./rooms");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

// Manage rooms & drawing state
const rooms = new RoomManager();

app.use("/", express.static(path.join(__dirname, "..", "client")));

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // All users join one shared "main" room
  const currentRoom = "main";
  const room = rooms.getOrCreate(currentRoom);
  room.addClient(socket.id);

  // Send full drawing history to new user
  socket.emit("history", room.state.getActiveOps());
  io.emit("userList", room.getClientList());

  // Handle live draw (real-time)
  socket.on("draw", (segment) => {
    socket.broadcast.emit("draw", segment);
  });

  // Handle completed drawing operation
  socket.on("op", (op) => {
    if (!op) return;
    const newOp = room.state.appendOp(op, socket.id);
    io.emit("op", newOp);
  });

  // Handle undo/redo
  socket.on("undo", () => {
    const result = room.state.undo();
    if (result) io.emit("history", room.state.getActiveOps());
  });

  socket.on("redo", () => {
    const result = room.state.redo();
    if (result) io.emit("history", room.state.getActiveOps());
  });

  // Handle cursor movement
socket.on("pointer", (data) => {
  const user = room.getUser(socket.id);
  if (!user) return;

  // Broadcast cursor position, color, and username
  socket.broadcast.emit("pointer", {
    clientId: socket.id,
    color: user.color,
    username: user.username,
    x: data.x,
    y: data.y,
  });
});

// Handle disconnect
socket.on("disconnect", () => {
  room.removeClient(socket.id);
  io.emit("userList", room.getClientList());
  socket.broadcast.emit("removeCursor", { clientId: socket.id });
  console.log("🔴 User disconnected:", socket.id);
});
});

app.use(express.static(path.join(__dirname, "../client")));

// 🚀 Express v5 compatible catch-all route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});


server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
