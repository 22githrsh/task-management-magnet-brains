const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
  try {
    if (!req.user) {
      console.log("Unauthorized access attempt");
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Fetching tasks for user:", req.user._id);

    const tasks = await Task.find({ createdBy: req.user._id });

    if (!tasks || tasks.length === 0) {
      console.log("No tasks found for user:", req.user._id);
      return res.status(404).json({ error: "No tasks found" });
    }

    console.log("Tasks found:", tasks);
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};



exports.createTask = async (req, res) => {
  try {
    console.log(req.body)
    const { title, description, dueDate, priority } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      createdBy: req.user.id, // Ensure `req.user.id` is set correctly
    });

    await task.save();
    console.log("Task created successfully:", task);
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });
    
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


