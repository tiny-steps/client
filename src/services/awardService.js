// API service for award-related operations

class AwardService {
  // Get JWT token from cookies (matching other services pattern)
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

  async getAllAwards(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.size) queryParams.append("size", params.size);
    if (params.doctorId) queryParams.append("doctorId", params.doctorId);

    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/awards?${queryParams}`, {
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch awards");
    }
    const result = await response.json();
    return result;
  }

  async getAwardById(awardId) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/awards/${awardId}`, {
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch award");
    }
    const result = await response.json();
    return result;
  }

  async getAwardsByDoctor(doctorId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.size) queryParams.append("size", params.size);

    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `/api/v1/awards/doctor/${doctorId}?${queryParams}`,
      {
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch doctor awards");
    }
    const result = await response.json();
    return result;
  }

  async createAward(doctorId, awardData) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/awards/doctor/${doctorId}`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(awardData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create award");
    }
    const result = await response.json();
    return result;
  }

  async updateAward(awardId, awardData) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/awards/${awardId}`, {
      method: "PUT",
      credentials: "include",
      headers,
      body: JSON.stringify(awardData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update award");
    }
    const result = await response.json();
    return result;
  }

  async deleteAward(awardId) {
    // Use hard delete for awards as per backend implementation
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/awards/${awardId}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete award");
    }

    // For DELETE requests, there's usually no response body
    if (response.status === 204) {
      return { success: true, message: "Award deleted successfully" };
    }

    return response.json();
  }

  // Note: Awards are hard deleted, so no reactivate method needed

  async createAwardsBatch(doctorId, awardsData) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/awards/doctor/${doctorId}/batch`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(awardsData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create awards batch");
    }
    const result = await response.json();
    return result;
  }

  async deleteAwardsByDoctor(doctorId) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/awards/doctor/${doctorId}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete doctor awards");
    }
  }

  async getAwardCount() {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch("/api/v1/awards/statistics/count", {
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch award count");
    }
    const result = await response.json();
    return result;
  }
}

export const awardService = new AwardService();
