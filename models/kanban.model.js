const mongoose = require("mongoose");

const KanbanSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  userId: { type: String, required: true },
  created: { type: Date, default: Date.now() },
});

const KanbanModel = mongoose.model("Kanban", KanbanSchema);

module.exports = KanbanModel;
