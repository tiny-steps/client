const login = async ({ email, password }) => {
  try {
    // Clear all storage and cookies before making login request
    const { performCompleteLogout } = await import("../utils/storageUtils.js");
    performCompleteLogout();

    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw the error so the mutation can handle it
  }
};

const logout = async () => {
  try {
    const response = await fetch(`/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    throw error; // Re-throw the error so the mutation can handle it
  }
};

// API service for auth-related operations
class AuthService {
  async validateToken() {
    try {
      // Use the new /me endpoint to validate the token
      // This endpoint requires authentication, so if it succeeds, the token is valid
      const response = await fetch(`/api/v1/users/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Clear all storage and cookies when token validation fails
        const { performCompleteLogout } = await import(
          "../utils/storageUtils.js"
        );
        performCompleteLogout();
        throw new Error("Token validation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Token validation error:", error);
      throw error;
    }
  }

  async deleteUserFromAuth(userId) {
    const response = await fetch(`/api/auth/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Failed to delete user from auth service"
      );
    }

    return response.json();
  }

  async updateUserInAuth(userId, userData) {
    const response = await fetch(`/api/auth/users/${userId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user in auth service");
    }

    return response.json();
  }
}

export const authService = new AuthService();

export { login, logout };
