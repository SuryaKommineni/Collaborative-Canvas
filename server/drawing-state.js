const { v4: uuidv4 } = require("uuid");

class DrawingState {
  constructor() {
    this.ops = [];          // All operations (active + undone)
    this.undoneStack = [];  // Stores undone ops for redo
  }

  appendOp(op, socketId) {
    const newOp = { ...op, id: uuidv4(), clientId: socketId, active: true };
    this.ops.push(newOp);

    // ✅ Reset redo stack — new operation deletes redo history
    this.undoneStack = [];
    return newOp;
  }

  getActiveOps() {
    return this.ops.filter((o) => o.active);
  }

  undo() {
    // Find last ACTIVE operation
    for (let i = this.ops.length - 1; i >= 0; i--) {
      if (this.ops[i].active) {
        this.ops[i].active = false;
        this.undoneStack.push(this.ops[i]);
        return true;
      }
    }
    return false;
  }

  redo() {
    const op = this.undoneStack.pop();
    if (!op) return null;

    op.active = true;
    return op;
  }
}

module.exports = { DrawingState };

