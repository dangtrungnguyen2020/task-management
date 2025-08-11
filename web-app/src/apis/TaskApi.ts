import BaseApi from "./BaseApi";

class TaskApi extends BaseApi {
  async getAllTasks(projectId: string) {
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect, // Type assertion for 'redirect'
    };

    try {
      const response = await this.fetchWithAuth(
        `${this.BASE_URL}/api/projects/${projectId}/tasks`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch all tasks: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error("Error fetching tasks:", err);
      // toast.error("Failed to fetch tasks.");
      throw err;
    }
  }

  async createTasksAPI(
    projectId: string,
    title: string,
    description: string,
    status: "todo" | "in_progress" | "completed",
    id: string | null,
    isUpdate: boolean
  ) {
    const data = JSON.stringify({ title, description, status });

    const url = isUpdate
      ? `${this.BASE_URL}/api/projects/${projectId}/tasks/${id}`
      : `${this.BASE_URL}/api/projects/${projectId}/tasks`;

    const method = isUpdate ? "PUT" : "POST";

    try {
      const response = await this.fetchWithAuth(url, {
        method: method,
        body: data,
      });
      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
  }

  async deleteTasksAPI(projectId: string, id: string) {
    const token = this.getAuthToken();
    if (!token) {
      // toast.error("Authentication token not found.");
      throw new Error("Authentication token not found.");
    }

    if (!id) {
      throw new Error("Task ID is required for deletion.");
    }

    const url = `${this.BASE_URL}/api/projects/${projectId}/tasks/${id}`;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: "DELETE",
      headers: myHeaders,
    };

    try {
      const response = await this.fetchWithAuth(url, requestOptions);

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in deleteTasksAPI:", error);
      throw error;
    }
  }
}

export default new TaskApi();
