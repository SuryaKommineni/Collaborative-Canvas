# 🖌️ Collaborative Real-Time Drawing Canvas

A real-time collaborative whiteboard built using **Node.js + Express + Socket.IO**.

Multiple users can draw simultaneously, see each other’s cursors live, and perform **Undo / Redo** operations that affect the entire global canvas.

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://collaborative-canvas-1.onrender.com)

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| Real-time drawing | All users see drawings instantly via WebSockets (Socket.IO) |
| Multiple tools | Brush, Eraser, Rectangle, Circle, Text, Image Insert |
| Undo / Redo (Global) | Undo/Redo applies to the shared canvas history (not per-client) |
| Live Cursor Sharing | See other users’ mouse pointers + username label |
| Persistent session state | Newly joined clients get complete drawing history |
| Room-based setup (extensible) | Designed to support multiple rooms |
