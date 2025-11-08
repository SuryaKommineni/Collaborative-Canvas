// ====== Setup ======
const canvas = document.getElementById("c");
const cursorCanvas = document.createElement("canvas");
document.body.appendChild(cursorCanvas);

canvas.width = cursorCanvas.width = window.innerWidth;
canvas.height = cursorCanvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
const cursorCtx = cursorCanvas.getContext("2d");

let drawing = false;
let points = [];
let ops = [];

let startX, startY, currentX, currentY;
let color = "#000000";
let widthVal = 3;
let tool = "brush";

// ====== Toolbar Controls ======
const toolbar = document.createElement("div");
toolbar.id = "toolbar";
toolbar.innerHTML = `
  <input type="color" id="color" value="#000000">
  <label for="width">Stroke:</label>
  <input type="range" id="width" min="1" max="20" value="3">
  
  <label for="fontSize">Text:</label>
  <input type="range" id="fontSize" min="10" max="100" value="30">
  
  <button id="brush">Brush</button>
  <button id="eraser">Eraser</button>
  <button id="rectangle">Rectangle</button>
  <button id="circle">Circle</button>
  <button id="text">Text</button>
  <input type="file" id="imageLoader" accept="image/*" style="display:none;">
  <button id="addImage">Image</button>
  <button id="undo">Undo</button>
  <button id="redo">Redo</button>
`;
document.body.appendChild(toolbar);


// ====== Event Handlers ======
document.getElementById("color").addEventListener("input", (e) => (color = e.target.value));
document.getElementById("width").addEventListener("input", (e) => (widthVal = +e.target.value));
document.getElementById("brush").addEventListener("click", () => (tool = "brush"));
document.getElementById("eraser").addEventListener("click", () => (tool = "eraser"));
document.getElementById("rectangle").addEventListener("click", () => (tool = "rectangle"));
document.getElementById("circle").addEventListener("click", () => (tool = "circle"));
document.getElementById("text").addEventListener("click", () => (tool = "text"));
document.getElementById("addImage").addEventListener("click", () => imageLoader.click());
document.getElementById("undo").addEventListener("click", () => ws.sendUndo());
let fontSize = 30; // default text size

document.getElementById("fontSize").addEventListener("input", (e) => {
  fontSize = parseInt(e.target.value);
  console.log("📝 Text size set to:", fontSize);
});


const imageLoader = document.getElementById("imageLoader");
imageLoader.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      const x = 100, y = 100;
      ctx.drawImage(img, x, y, 150, 150);
      const op = { tool: "image", src: evt.target.result, x, y, width: 150, height: 150, active: true };
      ops.push(op);
      ws.sendOp(op);
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

// ====== Mouse Events ======
canvas.addEventListener("mousedown", (e) => {
  startX = e.clientX;
  startY = e.clientY;
  drawing = true;
  if (tool === "text") {
  const text = prompt("Enter text:");
  if (text) {
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, startX, startY);
    const op = { 
      tool: "text", 
      text, 
      x: startX, 
      y: startY, 
      color, 
      fontSize,  
      active: true 
    };
    ops.push(op);
    ws.sendOp(op);
  }
  drawing = false;
} else if (tool === "brush" || tool === "eraser") {
    points = [[e.clientX, e.clientY]];
  }
});

canvas.addEventListener("mousemove", (e) => {
  ws.sendPointer({ x: e.clientX, y: e.clientY });

  if (!drawing) return;
  currentX = e.clientX;
  currentY = e.clientY;

  if (tool === "brush" || tool === "eraser") {
    const p = [currentX, currentY];
    points.push(p);
    const seg = { color, width: widthVal, tool, points: points.slice(-2), temp: true };
    drawStroke(seg);
    ws.sendDraw(seg);
  } else if (tool === "rectangle" || tool === "circle") {
    cursorCtx.clearRect(0, 0, canvas.width, canvas.height);
    cursorCtx.setLineDash([5]);
    cursorCtx.lineWidth = widthVal;
    cursorCtx.strokeStyle = color;
    cursorCtx.globalAlpha = 0.6;
    if (tool === "rectangle") {
      cursorCtx.strokeRect(startX, startY, currentX - startX, currentY - startY);
    } else {
      const r = Math.hypot(currentX - startX, currentY - startY);
      cursorCtx.beginPath();
      cursorCtx.arc(startX, startY, r, 0, Math.PI * 2);
      cursorCtx.stroke();
    }
    cursorCtx.setLineDash([]);
    cursorCtx.globalAlpha = 1;

    ws.sendDraw({
      tool,
      color,
      width: widthVal,
      startX,
      startY,
      endX: currentX,
      endY: currentY,
      temp: true,
    });
  }
});

canvas.addEventListener("mouseup", () => {
  if (!drawing) return;
  drawing = false;

  if (tool === "brush" || tool === "eraser") {
    const op = { color, width: widthVal, tool, points, active: true };
    ops.push(op);
    ws.sendOp(op);
  } else if (tool === "rectangle" || tool === "circle") {
    const op = { tool, color, width: widthVal, startX, startY, endX: currentX, endY: currentY, active: true };
    ops.push(op);
    ws.sendOp(op);
    cursorCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
  points = [];
});

// ====== Draw Functions ======
function drawStroke(op) {
  ctx.save();
  ctx.setLineDash([]);
  ctx.lineWidth = op.width;
  ctx.lineCap = ctx.lineJoin = "round";
  ctx.strokeStyle = op.color;
  if (op.tool === "eraser") ctx.globalCompositeOperation = "destination-out";
  else ctx.globalCompositeOperation = "source-over";

  if (op.tool === "brush" || op.tool === "eraser") {
    ctx.beginPath();
    ctx.moveTo(op.points[0][0], op.points[0][1]);
    for (let i = 1; i < op.points.length; i++) ctx.lineTo(op.points[i][0], op.points[i][1]);
    ctx.stroke();
  } else if (op.tool === "rectangle") {
    ctx.strokeRect(op.startX, op.startY, op.endX - op.startX, op.endY - op.startY);
  } else if (op.tool === "circle") {
    const r = Math.hypot(op.endX - op.startX, op.endY - op.startY);
    ctx.beginPath();
    ctx.arc(op.startX, op.startY, r, 0, Math.PI * 2);
    ctx.stroke();
  } else if (op.tool === "text") {
  ctx.font = `${op.fontSize || 30}px Arial`;
  ctx.fillStyle = op.color;
  ctx.fillText(op.text, op.x, op.y);
  } else if (op.tool === "image") {
    const img = new Image();
    img.src = op.src;
    img.onload = () => ctx.drawImage(img, op.x, op.y, op.width, op.height);
  }
  ctx.restore();
}

function redrawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ops.forEach((op) => drawStroke(op)); // ✅ correct function
}


// ====== WebSocket Listeners ======
ws.on("draw", (seg) => {
  if (seg.temp) {
    cursorCtx.clearRect(0, 0, canvas.width, canvas.height);
    cursorCtx.setLineDash([5]);
    cursorCtx.lineWidth = seg.width;
    cursorCtx.strokeStyle = seg.color;
    cursorCtx.globalAlpha = 0.6;

    if (seg.tool === "rectangle") {
      cursorCtx.strokeRect(seg.startX, seg.startY, seg.endX - seg.startX, seg.endY - seg.startY);
    } else if (seg.tool === "circle") {
      const r = Math.hypot(seg.endX - seg.startX, seg.endY - seg.startY);
      cursorCtx.beginPath();
      cursorCtx.arc(seg.startX, seg.startY, r, 0, Math.PI * 2);
      cursorCtx.stroke();
    } else {
      drawStroke(seg);
    }

    cursorCtx.setLineDash([]);
    cursorCtx.globalAlpha = 1;
  }
});

ws.on("op", (op) => {
  ops.push(op);
  drawStroke(op);
});

ws.on("history", (opsFromServer) => {
  console.log("🔄 Received history:", opsFromServer.length);

  ops = [...opsFromServer]; // Replace local ops
  redrawAll(); // ✅ Clear canvas + redraw all ops
});


ws.on("userList", (list) => {
  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = "<strong>Online Users:</strong><br>" +
    list.map((u) => `<span style="color:${u.color}">●</span> ${u.username}`).join("<br>");
});


// ===== USER CURSORS =====
const cursors = {}; // Track all user cursors

// Listen for pointer updates
ws.on("pointer", ({ clientId, x, y, color, username }) => {
  cursors[clientId] = { x, y, color, username };
  drawCursors();
});

// Remove cursor when user leaves
ws.on("removeCursor", ({ clientId }) => {
  delete cursors[clientId];
  drawCursors();
});

// Draw all cursors + names
function drawCursors() {
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  Object.entries(cursors).forEach(([id, { x, y, color, username }]) => {
    // draw colored dot
    cursorCtx.beginPath();
    cursorCtx.arc(x, y, 5, 0, Math.PI * 2);
    cursorCtx.fillStyle = color || "#ff0000";
    cursorCtx.fill();

    // label (username)
    cursorCtx.font = "12px Arial";
    cursorCtx.fillStyle = color || "#000";
    cursorCtx.fillText(username || id.slice(0, 4), x + 10, y + 4);
  });
}
