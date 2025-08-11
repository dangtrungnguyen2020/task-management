import React, { useState, useEffect } from "react";
import projectApi from "../../apis/ProjectApi";
import { toast } from "react-toastify";
import { Project } from "../../domain/dto/Project";

interface ProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
  selectedProject: Project | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onClose,
  onSuccess,
  selectedProject,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isUpdate = !!selectedProject;

  useEffect(() => {
    if (isUpdate && selectedProject) {
      setTitle(selectedProject.title);
      setDescription(selectedProject.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [isUpdate, selectedProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isUpdate && selectedProject) {
        await projectApi.updateProject(selectedProject._id, title, description);
        toast.success(`Project ${title} is updated successfully.`);
      } else {
        await projectApi.createProject(title, description);
        toast.success(`Project ${title} is created successfully.`);
      }
      onSuccess();
    } catch (error) {
      // toast will handle the error message from the API
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isUpdate ? "Edit Project" : "Create New Project"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none"
              disabled={loading}
            >
              {loading
                ? isUpdate
                  ? "Updating..."
                  : "Creating..."
                : isUpdate
                ? "Save Changes"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
