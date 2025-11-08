## 1. Data Flow Diagram — How Drawing Events Flow

The following diagram shows the flow of drawing operations starting from user interaction to final rendering on all connected canvases.

### 🖼️ Data Flow Diagram

![Data Flow Diagram](./data_flow_detailed.png)

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
