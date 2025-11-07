const socket = io("https://collaborative-canvas-abbg.onrender.com"  {
  transports: ["websocket"],
}); 


socket.on("connect", () => console.log("✅ Connected:", socket.id));
socket.on("disconnect", () => console.log("🔴 Disconnected"));

const ws = {
  sendOp: (op) => socket.emit("op", op),
  sendDraw: (segment) => socket.emit("draw", segment),
  sendUndo: () => socket.emit("undo"),
  sendRedo: () => socket.emit("redo"),
  sendPointer: (data) => socket.emit("pointer", data),
  on: (event, handler) => socket.on(event, handler),
};

window.ws = ws;
