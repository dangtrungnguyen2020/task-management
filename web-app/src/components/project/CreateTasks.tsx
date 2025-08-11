import React, { useState, useEffect } from "react";
import taskApi from "../../apis/TaskApi";
import { toast } from "react-toastify";

// Assuming a Task interface for the data structure
interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
}

interface CreateTasksProps {
  selectedEditTasks: Task | null;
  openCreateTasks: boolean;
  setOpenCreateTasks: (isOpen: boolean) => void;
  isUpdate: boolean;
  setIsUpdate: (isUpdating: boolean) => void;
  projectId: string;
}

const CreateTasks: React.FC<CreateTasksProps> = ({
  selectedEditTasks,
  setOpenCreateTasks,
  isUpdate,
  setIsUpdate,
  projectId,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<"todo" | "in_progress" | "completed">(
    "todo"
  );

  useEffect(() => {
    if (isUpdate && selectedEditTasks) {
      setTitle(selectedEditTasks.title || "");
      setDescription(selectedEditTasks.description || "");
      setStatus(selectedEditTasks.status || "todo");
    }
  }, [isUpdate, selectedEditTasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await taskApi.createTasksAPI(
        projectId,
        title,
        description,
        status,
        selectedEditTasks?._id || null,
        isUpdate
      );

      if (response) {
        toast.success(
          isUpdate ? "Task updated successfully!" : "Task created successfully!"
        );
        setOpenCreateTasks(false);
        setIsUpdate(false);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="bg-white w-full max-w-lg shadow-lg rounded-2xl p-8 relative z-10 mt-2">
        <h2 className="text-2xl font-extrabold text-indigo-600 my-2 text-center">
          {isUpdate ? "Update Task" : "Create a New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="title"
            >
              Task Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Task Description */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="description"
            >
              Task Description
            </label>
            <textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              required
            ></textarea>
          </div>

          {/* Status Dropdown for Update */}
          {isUpdate && (
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="status"
              >
                Task Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "in_progress" | "completed")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          {/* Submit and Cancel Buttons */}
          <div className="flex sm:flex-row flex-col gap-4 items-center justify-center">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isUpdate ? "Update Task" : "Create Task"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenCreateTasks(false);
                setIsUpdate(false);
              }}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTasks;
