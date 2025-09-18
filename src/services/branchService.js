// API service for branch-related operations

class BranchService {
  async getBranches() {
    // This would typically call an API endpoint to get branches
    // For now, we'll extract branch information from the JWT token
    try {
      const response = await fetch("/api/v1/users/me", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch user branches");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      throw error;
    }
  }

  // Extract branches from JWT token
  getBranchesFromToken() {
    try {
      const token = this.getJwtToken();
      if (!token) return [];

      const payload = JSON.parse(atob(token.split(".")[1]));
      const branchIds = payload.branchIds || payload.contextIds || [];
      const primaryBranchId =
        payload.primaryBranchId || payload.primaryContextId || null;

      // For now, we'll return a simplified structure
      // In a real implementation, you would fetch full branch details from an API
      const branches = branchIds.map((id) => ({
        id,
        name: `Branch ${id.substring(0, 8)}`, // Simplified name
        isPrimary: id === primaryBranchId,
      }));

      return branches;
    } catch (error) {
      console.error("Failed to extract branches from token:", error);
      return [];
    }
  }

  // Get JWT token from cookies
  getJwtToken() {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}

export const branchService = new BranchService();
