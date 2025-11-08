# 🖌️ Collaborative Real-Time Drawing Canvas

A real-time collaborative whiteboard built using **Node.js + Express + Socket.IO**.  
Multiple users can draw simultaneously, see each other’s cursors live, and perform **Undo / Redo** operations that affect the entire global canvas.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| Real-time drawing | All users see drawings instantly via WebSockets (Socket.IO)
| Multiple tools | Brush, Eraser, Rectangle, Circle, Text, Image Insert
| Undo / Redo (Global) | Undo/Redo applies to the shared canvas history (not per-client)
| Live Cursor Sharing | See other users’ mouse pointers + username label
| Persistent session state | Newly joined clients get complete drawing history
| Room-based setup (extensible) | Designed to support multiple rooms

---

## 🛠️ Setup Instructions (Run Locally)

### ✅ Prerequisites
- Node.js installed (v16+ recommended)
- npm installed

### ✅ Start Server + Client

```bash
# Install dependencies
npm install

# Start development server
npm start

After starting, open the browser and visit:

🔗 http://localhost:3000

The server automatically hosts the frontend from the /client folder.


## 👥 How to Test With Multiple Users

1. Start the application:

   ```bash
   npm start

2. Open the project in your browser:
   http://localhost:3000

3. To test multiple users, open the same URL in:
   Another browser tab/window, or
   Another different browser, or
   Another device connected to the same network

4. Start drawing in one window — the drawing appears instantly in the other.

✅ Expected Real-Time Behavior

✏️ Real-time strokes from all connected users

🎨 Unique cursor color + username shown for each user

🔄 Global undo/redo (affects everyone together)


Known Limitations / Bugs
| Issue / Limitation                    | Explanation                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| Undo/Redo is **global**, not per-user | Undo removes the most recent operation on the shared canvas, regardless of who drew it |
| Redo gets cleared                     | If a new drawing occurs after undoing, redo history is removed (intended behavior)     |
| Image operations are large            | Images are stored as Base64; too many images may affect performance                    |
| UI not fully mobile optimized         | Works on mobile but toolbar alignment needs improvement                                |


Time Spent on the Project
| Task                                      | Time      |
| ----------------------------------------- | --------- |
| Canvas drawing tools implementation       | **6 hrs** |
| WebSocket integration (real-time updates) | **5 hrs** |
| Undo/Redo logic (global shared history)   | **3 hrs** |
| UI/UX + bug fixing                        | **2 hrs** |
| Documentation                             | **1 hr**  |
✅ Total time spent: ~17 hours



📁 Project Structure
/client
  ├── index.html        # UI & canvas container
  ├── canvas.js         # Draw operations, toolbar tools
  ├── websocket.js      # WebSocket communication (socket.io client)
  ├── style.css         # Styling

/server
  ├── server.js         # Node.js + socket.io backend
  ├── drawing-state.js  # Global Undo/Redo implementation
  ├── rooms.js          # Room and user management


🧰 Tech Stack
| Component               | Technology                           |
| ----------------------- | ------------------------------------ |
| Frontend                | HTML Canvas API + Vanilla JavaScript |
| Backend                 | Node.js + Express                    |
| Real-time Communication | Socket.IO (WebSockets)               |


