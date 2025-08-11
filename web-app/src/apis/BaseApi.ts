export default class BaseApi {
  BASE_URL = "http://localhost:4000";

  getAuthToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  setAuthToken(newToken: string) {
    localStorage.setItem("accessToken", newToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  setRefreshToken(newToken: string) {
    localStorage.setItem("refreshToken", newToken);
  }

  async refreshTokenAPI() {
    const atoken = this.getAuthToken();
    const rtoken = this.getRefreshToken();
    if (!atoken || !rtoken) {
      throw new Error("No refreshToken available.");
    }
    try {
      const headers = new Headers();
      headers.set("Authorization", `Bearer ${atoken}`);
      headers.set("Content-Type", "application/json");
      const response = await fetch(`${this.BASE_URL}/api/auth/refreshtoken`, {
        method: "POST",
        headers,
        body: JSON.stringify({ refresh_token: rtoken }),
      });
      const { accessToken, refreshToken } = await response.json();
      this.setAuthToken(accessToken);
      this.setRefreshToken(refreshToken);
      return accessToken;
    } catch (error: any) {
      throw new Error("Token refresh failed. User logged out.");
    }
  }

  async fetchWithAuth(
    url: string,
    options: RequestInit,
    isRetry: boolean = false
  ) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error("No token available.");
    }

    // Add the Authorization header
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");
    const fetchOptions = { ...options, headers };

    try {
      const response = await fetch(url, fetchOptions);

      if (response.status === 401 && !isRetry) {
        console.log("Token expired. Attempting to refresh token...");
        const newToken = await this.refreshTokenAPI();

        if (newToken) {
          console.log("Token refreshed. Retrying original request...");
          const retryResponse: any = await this.fetchWithAuth(
            url,
            options,
            true
          );
          if (!retryResponse.ok) {
            throw new Error(`Retry failed: ${retryResponse.statusText}`);
          }
          return await retryResponse.json();
        } else {
          localStorage.removeItem("token");
          window.location.href = "/"; // Redirect to login page
          throw new Error("Token refresh failed. User logged out.");
        }
      }

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in fetchWithAuth:", error);
      throw error;
    }
  }
}
