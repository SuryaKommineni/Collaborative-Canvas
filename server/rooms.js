const { DrawingState } = require("./drawing-state");

class Room {
  constructor() {
    this.state = new DrawingState();
    this.clients = new Map(); // socket.id -> user info
    this.userCount = 0;
  }

  addClient(socketId) {
    this.userCount++;
    const color = Room.randomColor();
    const username = `User ${this.userCount}`;
    this.clients.set(socketId, { id: socketId, color, username });
  }

  removeClient(socketId) {
    this.clients.delete(socketId);
  }

  getClientList() {
    return Array.from(this.clients.values());
  }

  getUser(socketId) {
    return this.clients.get(socketId);
  }

  static randomColor() {
    const colors = [
      "#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
      "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomName -> Room
  }

  getOrCreate(roomName) {
    if (!this.rooms.has(roomName)) this.rooms.set(roomName, new Room());
    return this.rooms.get(roomName);
  }
}

module.exports = { RoomManager };
