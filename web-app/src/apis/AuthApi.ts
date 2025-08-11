import UserInfo from "../domain/dto/UserInfo";
import BaseApi from "./BaseApi";

class AuthApi extends BaseApi {
  async registerWithAPi(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<UserInfo> {
    const data = JSON.stringify({ firstName, lastName, email, password });
    try {
      const response = await fetch(`${this.BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });

      return await response.json();
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  }

  // API Function
  async loginWithApi(email: string, password: string) {
    const data = JSON.stringify({ email, password });
    try {
      const response = await fetch(`${this.BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });

      const { accessToken, refreshToken } = await response.json();
      this.setAuthToken(accessToken);
      this.setRefreshToken(refreshToken);
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  }

  async getUserInfo() {
    const token = this.getAuthToken();
    if (!token) {
      // toast.error("Authentication token not found.");
      throw new Error("Authentication token not found.");
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow" as RequestRedirect, // Type assertion for 'redirect'
    };
    try {
      const response = await fetch(`${this.BASE_URL}/api/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  }
}

export default new AuthApi();
