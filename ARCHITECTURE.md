## 1. Data Flow Diagram — How Drawing Events Flow

The following diagram shows the flow of drawing operations starting from user interaction to final rendering on all connected canvases.

### 🖼️ Data Flow Diagram

![Data Flow Diagram](./docs/data_flow_detailed.png)

---

### 🔍 Explanation

| Step | Component | What happens |
|------|-----------|--------------|
| 1 | **User (mouse/touch)** | User drags mouse or finger to draw on canvas |
| 2 | **canvas.js** | Captures stroke points and generates draw operations |
| 3 | **websocket.js** | Sends events such as `draw`, `op`, `undo`, `redo` to server via WebSockets (Socket.IO) |
| 4 | **server.js (Socket.IO backend)** | Receives operations, assigns IDs, stores them, broadcasts to all clients |
| 5 | **drawing-state.js** | Maintains operation history, manages global Undo/Redo |
| 6 | **Other clients** | Receive operations and redraw them on their canvas |

---

### Types of events sent to server:

| Event name | Purpose |
|------------|----------|
| `draw` | Temporary real-time preview while user is drawing |
| `op` | Finalized stroke saved into shared history |
| `undo` / `redo` | Manipulates shared history and updates all clients |
| `pointer` | Sends cursor location and username to other users |

> ✅ Every client always gets the same consistent history, so all canvases stay in sync.

## 2. WebSocket Protocol — Messages Sent & Received

The project uses **Socket.IO (WebSockets)** for bi-directional communication between clients and the server.

---

### 🔄 Message Types and Payloads

| Event Name | Direction | Payload Example | Purpose |
|------------|------------|----------------|---------|
| `draw` | Client ➜ Server ➜ Other Clients | ```json { "tool": "brush", "color": "#000", "width": 4, "points": [[x1,y1],[x2,y2]], "temp": true } ``` | Live/temporary drawing preview while user is drawing (not saved in history). |
| `op` | Client ➜ Server ➜ All Clients | ```json { "tool": "rectangle", "color": "#ff0000", "startX": 100, "startY": 200, "endX": 300, "endY": 350, "active": true } ``` | Final drawing operation — stored in global state and broadcast to all users. |
| `undo` | Client ➜ Server ➜ All Clients | *(no payload)* | Removes last active operation from history (global undo). |
| `redo` | Client ➜ Server ➜ All Clients | *(no payload)* | Restores last undone operation (global redo). |
| `history` | Server ➜ Client | ```json [ {op1}, {op2}, {op3} ] ``` | Sends the complete list of **active drawing operations** to a newly joined client. |
| `pointer` | Client ➜ Server ➜ Other Clients | ```json { "clientId": "...", "x": 501, "y": 221, "color": "#4363d8", "username": "User-2" } ``` | Shares user's cursor location + username with others for real-time cursor display. |
| `userList` | Server ➜ All Clients | ```json [ {"id": "...", "username": "User-1", "color": "#e6194B"} ] ``` | Informs all clients about currently online users. |
| `removeCursor` | Server ➜ All Clients | ```json { "clientId": "..." } ``` | Removes a user cursor from the canvas when they disconnect. |

---

### 📡 Client-side WebSocket API (`websocket.js`)

```javascript
ws.sendOp(op);        // emits: 'op'
ws.sendDraw(segment); // emits: 'draw'
ws.sendUndo();        // emits: 'undo'
ws.sendRedo();        // emits: 'redo'
ws.sendPointer(data); // emits: 'pointer'
ws.on("event", fn);   // listen for events

---

### 🧠 Server-side Behavior (server.js)

```javascript
socket.on("draw", data => socket.broadcast.emit("draw", data));
socket.on("op", data => io.emit("op", savedOperation));
socket.on("undo", () => io.emit("history", updatedOps));
socket.on("redo", () => io.emit("history", updatedOps));
socket.on("pointer", data => socket.broadcast.emit("pointer", data));

---


