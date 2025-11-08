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
    this.rooms = new Map();
  }

  getOrCreate(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        state: new DrawingState(),
        clients: new Map(),   // ✅ Map ensures unique socket IDs

        addClient(user) {
          this.clients.set(user.id, user);
        },

        removeClient(id) {
          this.clients.delete(id);
        },

        getClientList() {
          return [...this.clients.values()];
        },

        getUser(id) {
          return this.clients.get(id);
        }
      });
    }
    return this.rooms.get(roomId);
  }
}

module.exports = { RoomManager };

