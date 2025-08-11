import BaseApi from "./BaseApi";

class ProjectApi extends BaseApi {
  async getAllProjects() {
    try {
      const response = await this.fetchWithAuth(
        `${this.BASE_URL}/api/projects?limit=15`,
        {
          method: "GET",
        }
      );

      if (!response || !response.length) {
        throw new Error("Failed to fetch projects");
      }

      return response;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  async createProject(title: string, description?: string) {
    try {
      const response = await this.fetchWithAuth(
        `${this.BASE_URL}/api/projects`,
        {
          method: "POST",
          body: JSON.stringify({ title, description }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async updateProject(projectId: string, title: string, description?: string) {
    try {
      const response = await this.fetchWithAuth(
        `${this.BASE_URL}/api/projects/${projectId}`,
        {
          method: "PUT",
          body: JSON.stringify({ title, description }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  async deleteProject(projectId: string) {
    try {
      const response = await this.fetchWithAuth(
        `${this.BASE_URL}/api/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }
}

export default new ProjectApi();
