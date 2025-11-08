const { DrawingState } = require("./drawing-state");

class Room {
  constructor() {
    this.state = new DrawingState();
    this.clients = new Map();
    this.userCount = 0;
  }

  addClient(socketId) {
    this.userCount++;
    const user = {
      id: socketId,
      username: `User-${this.userCount}`,
      color: Room.randomColor(),
    };
    this.clients.set(socketId, user);
  }

  removeClient(socketId) {
    this.clients.delete(socketId);
  }

  getClientList() {
    return [...this.clients.values()];
  }

  getUser(socketId) {
    return this.clients.get(socketId);
  }

  static randomColor() {
    const colors = ["#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  getOrCreate(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Room());
    }
    return this.rooms.get(roomId);
  }
}

module.exports = { RoomManager };
