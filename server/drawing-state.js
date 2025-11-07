const { v4: uuidv4 } = require("uuid");

class DrawingState {
  constructor() {
    this.ops = [];
    this.undoneStack = [];
  }

  appendOp(op, socketId) {
    const newOp = { ...op, id: uuidv4(), clientId: socketId, active: true };
    this.ops.push(newOp);
    this.undoneStack = [];
    return newOp;
  }

  getActiveOps() {
    return this.ops.filter((o) => o.active);
  }

  undo() {
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
    if (op) {
      op.active = true;
      return true;
    }
    return false;
  }
}

module.exports = { DrawingState };
