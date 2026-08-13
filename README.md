# 🖌️ Collaborative Real-Time Drawing Canvas

A real-time collaborative whiteboard built using **Node.js + Express + Socket.IO**.

Multiple users can draw simultaneously, see each other’s cursors live, and perform **Undo / Redo** operations that affect the entire global canvas.

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

---

## Tech Stack

| Technology | Role |
| --- | --- |
| React.js | Front-end user interface |
| HTML5 Canvas | Drawing and rendering |
| CSS3 | Styling and responsive design |
| JavaScript | Application logic |
| Node.js | Server-side runtime |
| Express.js | REST API and server management |
| Socket.IO | Real-time communication between clients |
| Git | Version control |
| GitHub | Source code hosting |

---

## Project Structure

```text
Collaborative-Canvas
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── App.jsx
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── socket/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

- **client/** → React front-end
- **server/** → Express and Socket.IO back-end
- **components/** → Reusable UI components
- **hooks/** → Custom React hooks
- **socket/** → Real-time communication logic

---

## Installation & Setup

### Prerequisites

- Node.js
- npm
- Git

### Clone the repository

```bash
git clone https://github.com/SuryaKommineni/Collaborative-Canvas.git
```

### Install client dependencies

```bash
cd client
npm install
```

### Install server dependencies

```bash
cd ../server
npm install
```

### Start the server

```bash
cd server
npm run dev
```

### Start the client

```bash
cd client
npm run dev
```

---

## Usage

1. Start the server.
2. Start the client.
3. Open the application in the browser.
4. Create or join a collaboration room.
5. Draw on the canvas.
6. Invite another user to join the same room.
7. Observe real-time synchronization.

---

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://collaborative-canvas-1.onrender.com)

---

## Engineering Decisions

### Why Socket.IO?

Socket.IO was chosen because it provides low-latency, bidirectional communication, which is essential for real-time collaboration.

### Why HTML5 Canvas?

HTML5 Canvas provides direct pixel manipulation and efficient rendering for drawing applications.

### Why a Room-Based Architecture?

A room-based design isolates drawing sessions and prevents data from being shared across unrelated users.

---

## Testing

The application was tested for:

- Real-time synchronization
- Drawing performance
- Cursor updates
- Room creation and joining
- Cross-browser compatibility

Manual testing was performed using multiple browser tabs and separate devices.

---

## Limitations

- Undo and redo synchronization can be improved.
- Shape tools are currently disabled.
- Large images may affect performance.

## Future Improvements

- Add persistent storage.
- Add user authentication.
- Add voice and video communication.
- Add drawing layers.
- Add shape tools with improved synchronization.

---

