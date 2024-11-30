import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Color options array
  const colorOptions = ["#f43f5e", "#3b82f6", "#22c55e", "#facc15", "#a855f7"]; // Red, Blue, Green, Yellow, Purple


  const handleDelete = async (taskId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:6969/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        alert("Task deleted successfully");
        fetchTasks(); // Refresh the task list
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete task");
      }
    } catch (error) {
      alert("Error deleting task: " + error.message);
    }
  };
  

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch("http://localhost:6969/api/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update task color in the backend
  const handleColorChange = async (taskId, newColor) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      const response = await fetch(`http://localhost:6969/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ color: newColor }),
      });

      if (response.ok) {
        fetchTasks(); // Refresh tasks to reflect the updated color
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update task color");
      }
    } catch (error) {
      alert("Error updating color: " + error.message);
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <button
          onClick={() => navigate("/create-task")}
          className="mb-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create New Task
        </button>
        {tasks.length > 0 ? (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task._id}
                style={{ backgroundColor: task.color || "#f9fafb" }} // Apply task color
                className="p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status}
                </span>

                {/* Color Options */}
                <div className="mt-4 flex items-center gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(task._id, color)}
                      style={{ backgroundColor: color }}
                      className={`w-8 h-8 rounded-full transition ${
                        task.color === color ? "border-4 border-gray-800" : ""
                      }`}
                    ></button>
                  ))}
                </div>

                {/* Edit and Delete Buttons */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => navigate(`/edit-task/${task._id}`)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
