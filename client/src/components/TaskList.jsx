import React from "react";

const TaskList = ({ tasks }) => {
  console.log("Rendering tasks:", tasks); // Debugging log to ensure the data is being passed correctly

  return (
    <div className="mt-6">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 mb-4 rounded shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-gray-500">Due Date: {task.dueDate || "Not set"}</p>
            <p className="text-sm text-gray-400">Priority: {task.priority || "Not set"}</p>
            <p
              className={`text-sm ${
                task.status === "completed" ? "text-green-600" : "text-red-600"
              }`}
            >
              Status: {task.status}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No tasks available.</p>
      )}
    </div>
  );
};

export default TaskList;
