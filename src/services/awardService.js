// API service for award-related operations

class AwardService {
  async getAllAwards(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.size) queryParams.append("size", params.size);
    if (params.doctorId) queryParams.append("doctorId", params.doctorId);

    const response = await fetch(`/api/v1/awards?${queryParams}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch awards");
    }
    const result = await response.json();
    return result;
  }

  async getAwardById(awardId) {
    const response = await fetch(`/api/v1/awards/${awardId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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

    const response = await fetch(
      `/api/v1/awards/doctor/${doctorId}?${queryParams}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
    const response = await fetch(`/api/v1/awards/doctor/${doctorId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`/api/v1/awards/${awardId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
    // Use soft delete for awards to preserve professional history
    const response = await fetch(`/api/v1/awards/${awardId}/soft-delete`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete award");
    }
    return response.json();
  }

  async reactivateAward(awardId) {
    const response = await fetch(`/api/v1/awards/${awardId}/reactivate`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reactivate award");
    }
    return response.json();
  }

  async createAwardsBatch(doctorId, awardsData) {
    const response = await fetch(`/api/v1/awards/doctor/${doctorId}/batch`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`/api/v1/awards/doctor/${doctorId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete doctor awards");
    }
  }

  async getAwardCount() {
    const response = await fetch("/api/v1/awards/statistics/count", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
