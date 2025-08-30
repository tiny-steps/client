const login = async ({ email, password }) => {
  try {
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
    } else return data;
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};

// API service for auth-related operations
class AuthService {
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
