export const BASE_URI = process.env.VITE_API_BASE_URL;

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${BASE_URI}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();

  return data;
};

export const logoutUser = async () => {
  const response = await fetch(`${BASE_URI}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Logout failed");
  }
  return response.json();
};
