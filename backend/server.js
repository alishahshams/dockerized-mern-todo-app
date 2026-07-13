const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Todo = require("./models/Todo");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// =====================
// GET ALL TODOS
// =====================
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================
// ADD TODO
// =====================
app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo({
      task: req.body.task,
    });

    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================
// UPDATE TODO
// =====================
app.put("/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        task: req.body.task,
      },
      { new: true }
    );

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================
// DELETE TODO
// =====================
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});