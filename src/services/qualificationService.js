// API service for qualification-related operations

class QualificationService {
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

  async getAllQualifications(params = {}) {
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

    const response = await fetch(`/api/v1/qualifications?${queryParams}`, {
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch qualifications");
    }
    const result = await response.json();
    return result;
  }

  async getQualificationById(qualificationId) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/qualifications/${qualificationId}`, {
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch qualification");
    }
    const result = await response.json();
    return result;
  }

  async getQualificationsByDoctor(doctorId, params = {}) {
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
      `/api/v1/qualifications/doctor/${doctorId}?${queryParams}`,
      {
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch doctor qualifications");
    }
    const result = await response.json();
    return result;
  }

  async createQualification(doctorId, qualificationData) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/qualifications/doctor/${doctorId}`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(qualificationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create qualification");
    }
    const result = await response.json();
    return result;
  }

  async updateQualification(qualificationId, qualificationData) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/qualifications/${qualificationId}`, {
      method: "PUT",
      credentials: "include",
      headers,
      body: JSON.stringify(qualificationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update qualification");
    }
    const result = await response.json();
    return result;
  }

  async deleteQualification(qualificationId) {
    // Use hard delete for qualifications as per backend implementation
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/qualifications/${qualificationId}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete qualification");
    }
    return response.json();
  }

  async reactivateQualification(qualificationId) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `/api/v1/qualifications/${qualificationId}/reactivate`,
      {
        method: "PATCH",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reactivate qualification");
    }
    return response.json();
  }

  async createQualificationsBatch(doctorId, qualificationsData) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `/api/v1/qualifications/doctor/${doctorId}/batch`,
      {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(qualificationsData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create qualifications batch");
    }
    const result = await response.json();
    return result;
  }

  async deleteQualificationsByDoctor(doctorId) {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/v1/qualifications/doctor/${doctorId}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Failed to delete doctor qualifications"
      );
    }
  }

  async getQualificationCount() {
    const token = this.getJwtToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch("/api/v1/qualifications/statistics/count", {
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch qualification count");
    }
    const result = await response.json();
    return result;
  }
}

export const qualificationService = new QualificationService();
