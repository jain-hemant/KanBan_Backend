const { Router } = require("express");

const KanbanModel = require("../models/kanban.model");
const auth = require("../middlewares/auth.middleware");
const kanbanRoutes = Router();

kanbanRoutes.get("/view", (req, res) => {});

kanbanRoutes.post("/create", async (req, res) => {
  const { title, description, author, user } = req.body;

  try {
    if ((!title, !description, !author)) {
      return res.status(403).json({ message: "All field is required." });
    }
    const task = new KanbanModel({
      title,
      description,
      author,
      userId: user.userId,
    });
    await task.save();
    return res.status(201).json({ message: "Task created successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while registration.", error });
  }
});

kanbanRoutes.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, author } = req.body;
  try {
    const update = await KanbanModel.findByIdAndUpdate(id, {
      title,
      description,
      author,
    });
    if (update) {
      return res.status(201).json({ message: "Task updated successfully!" });
    }
  } catch (error) {
    console.log("Update Error", error);
    return res.status(500).json({ message: "Error while updating." });
  }
});

kanbanRoutes.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removed = await KanbanModel.findByIdAndDelete(id);
    if (removed) {
      return res.status(200).json({ message: "Task deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while Deleting Task" });
  }
});

module.exports = kanbanRoutes;
