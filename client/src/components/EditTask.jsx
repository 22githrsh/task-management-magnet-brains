import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ title: "", description: "", dueDate: "", priority: "low" });

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first");
        return;
      }

      const response = await fetch(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setTask(data.task);
      } else {
        alert(data.message || "Error fetching task");
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      navigate("/");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:6969/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      
  
      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Error updating task");
      } else {
        navigate("/dashboard");  // Redirect on successful update
      }
    } catch (error) {
      alert("Error updating task: " + error.message);
      console.error("Fetch error:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full p-2 rounded bg-gray-900 text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="w-full p-2 rounded bg-gray-900 text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Due Date</label>
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              className="w-full p-2 rounded bg-gray-900 text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
              className="w-full p-2 rounded bg-gray-900 text-white focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
