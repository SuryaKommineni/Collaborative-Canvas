const { v4: uuidv4 } = require("uuid");

class DrawingState {
  constructor() {
    this.ops = [];         // all drawing operations
    this.undoneStack = []; // stores undone ops for redo
  }

  appendOp(op, socketId) {
    const newOp = { ...op, id: uuidv4(), clientId: socketId, active: true };
    this.ops.push(newOp);
    this.undoneStack = []; // reset redo stack
    return newOp;
  }

  getActiveOps() {
    return this.ops.filter((o) => o.active);
  }

  undo() {
    for (let i = this.ops.length - 1; i >= 0; i--) {
      if (this.ops[i].active) {
        this.ops[i].active = false;
        this.undoneStack.push(this.ops[i]); // ✅ save op to redo stack
        return true;
      }
    }
    return false;
  }

  redo() {
    const op = this.undoneStack.pop();
    if (!op) return false;

    op.active = true;  // ✅ just activate it again (do NOT push to ops again)
    return true;
  }
}

module.exports = { DrawingState };
