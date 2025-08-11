import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setSelectedProject,
  clearSelectedProject,
} from "../../redux/projectSlice";
import projectApi from "../../apis/ProjectApi";
import ProjectForm from "./ProjectForm";
import { Project } from "../../domain/dto/Project";

const AllProject: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const selectedProject = useSelector(
    (state: RootState) => state.project.selectedProject
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const projectsData = await projectApi.getAllProjects();
      if (projectsData) {
        setProjects(projectsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [isFormOpen]); // Refresh projects when the form is closed

  const handleCreateClick = () => {
    dispatch(clearSelectedProject());
    setIsFormOpen(true);
  };

  const handleEditClick = (project: Project) => {
    dispatch(setSelectedProject(project));
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectApi.deleteProject(projectId);
        fetchProjects(); // Refresh the list after deletion
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    dispatch(clearSelectedProject());
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    dispatch(clearSelectedProject());
    fetchProjects();
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">Projects</h1>
        <button
          onClick={handleCreateClick}
          className="flex items-center bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
        >
          <FiPlusCircle className="mr-2" /> Create Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
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
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    to={`/projects/${project._id}/tasks`}
                    onClick={() => dispatch(setSelectedProject(project))}
                    className="block text-xl font-semibold text-indigo-700 hover:underline"
                  >
                    {project.title}
                  </Link>
                  <p className="text-gray-600 mt-2">{project.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(project)}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(project._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-16 text-gray-500">
          <p className="text-lg">
            No projects found. Create one to get started!
          </p>
        </div>
      )}

      {isFormOpen && (
        <ProjectForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          selectedProject={selectedProject}
        />
      )}
    </div>
  );
};

export default AllProject;
