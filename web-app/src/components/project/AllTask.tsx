import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import taskApi from "../../apis/TaskApi";
import projectApi from "../../apis/ProjectApi";
import CreateTasks from "./CreateTasks";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../redux/store";
import { setSelectedProject } from "../../redux/projectSlice";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  createdAt: string;
}

const AllTask: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const selectedProject = useSelector(
    (state: RootState) => state.project.selectedProject
  );

  const [allTaskData, setAllTaskData] = useState<Task[]>([]);
  const [openCreateTasks, setOpenCreateTasks] = useState<boolean>(false);
  const [selectedEditTasks, setSelectedEditTasks] = useState<Task | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isTasksLoading, setIsTasksLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedProject || selectedProject?._id !== projectId) {
      projectId &&
        projectApi.getById(projectId).then((data) => {
          dispatch(setSelectedProject(data));
        });
      console.log(`Fetching details for project: ${projectId}`);
    }
  }, []);

  const getAllTasksFromApi = async () => {
    setIsTasksLoading(true);
    if (!projectId) {
      toast.error("Project ID is missing.");
      setIsTasksLoading(false);
      return;
    }
    try {
      const responseData = await taskApi.getAllTasks(projectId);
      if (responseData) {
        setAllTaskData(responseData);
      }
    } catch (error) {
      toast.error("Failed to fetch tasks.");
    } finally {
      setIsTasksLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      getAllTasksFromApi();
    }
  }, [projectId, openCreateTasks, isUpdate]);

  const handleDeleteTask = async (id: string) => {
    if (!projectId) {
      toast.error("Project ID is missing.");
      return;
    }
    try {
      await taskApi.deleteTasksAPI(projectId, id);
      getAllTasksFromApi();
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedEditTasks(task);
    setIsUpdate(true);
    setOpenCreateTasks(true);
  };

  const logout = () => {
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">
          Tasks for: {selectedProject?.title || "Loading..."}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setOpenCreateTasks(true)}
            className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            <FiPlusCircle className="mr-2" /> New Task
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {isTasksLoading ? (
        <div className="flex justify-center items-center h-64">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {allTaskData.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {allTaskData.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center transition-transform transform hover:scale-105"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                    <span
                      className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        task.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-indigo-500 hover:text-indigo-700 transition"
                      aria-label="Edit Task"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-500 hover:text-red-700 transition"
                      aria-label="Delete Task"
                    >
                      <FiTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center mt-16 text-gray-500">
              <svg
                className="h-16 w-16 text-gray-400 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path stroke="currentColor" strokeWidth="2" d="M9 12l2 2 4-4" />
              </svg>
              <p className="text-lg">
                No tasks available for this project. Start by creating a new
                task!
              </p>
            </div>
          )}
        </div>
      )}

      {openCreateTasks && projectId && (
        <CreateTasks
          selectedEditTasks={selectedEditTasks}
          openCreateTasks={openCreateTasks}
          setOpenCreateTasks={setOpenCreateTasks}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default AllTask;
