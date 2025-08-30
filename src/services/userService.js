// API service for user-related operations

class UserService {
  async getUserById(userId) {
    const response = await fetch(`/api/v1/users/${userId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user");
    }
    const result = await response.json();
    return result; // Backend returns ResponseModel<UserDto>
  }

  async getCurrentUser() {
    const response = await fetch("/api/v1/users/me", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch current user");
    }
    const result = await response.json();
    return result;
  }

  async updateUser(userId, userData) {
    const response = await fetch(`/api/v1/users/${userId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user");
    }
    const result = await response.json();
    return result;
  }

  async deleteUser(userId) {
    const response = await fetch(`/api/v1/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete user");
    }
    const result = await response.json();
    return result;
  }
}

export const userService = new UserService();
