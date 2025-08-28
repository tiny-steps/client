// API service for specialization-related operations

class SpecializationService {
  async getAllSpecializations(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.size) queryParams.append("size", params.size);
    if (params.doctorId) queryParams.append("doctorId", params.doctorId);

    const response = await fetch(`/api/v1/specializations?${queryParams}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch specializations");
    }
    const result = await response.json();
    return result;
  }

  async getSpecializationById(specializationId) {
    const response = await fetch(
      `/api/v1/specializations/${specializationId}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch specialization");
    }
    const result = await response.json();
    return result;
  }

  async getSpecializationsByDoctor(doctorId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.size) queryParams.append("size", params.size);

    const response = await fetch(
      `/api/v1/specializations/doctor/${doctorId}?${queryParams}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Failed to fetch doctor specializations"
      );
    }
    const result = await response.json();
    return result;
  }

  async createSpecialization(doctorId, specializationData) {
    const response = await fetch(`/api/v1/specializations/doctor/${doctorId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(specializationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create specialization");
    }
    const result = await response.json();
    return result;
  }

  async updateSpecialization(specializationId, specializationData) {
    const response = await fetch(
      `/api/v1/specializations/${specializationId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(specializationData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update specialization");
    }
    const result = await response.json();
    return result;
  }

  async deleteSpecialization(specializationId) {
    const response = await fetch(
      `/api/v1/specializations/${specializationId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete specialization");
    }
  }

  async createSpecializationsBatch(doctorId, specializationsData) {
    const response = await fetch(
      `/api/v1/specializations/doctor/${doctorId}/batch`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(specializationsData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Failed to create specializations batch"
      );
    }
    const result = await response.json();
    return result;
  }

  async deleteSpecializationsByDoctor(doctorId) {
    const response = await fetch(`/api/v1/specializations/doctor/${doctorId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Failed to delete doctor specializations"
      );
    }
  }

  async getSpecializationCount() {
    const response = await fetch("/api/v1/specializations/statistics/count", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch specialization count");
    }
    const result = await response.json();
    return result;
  }
}

export const specializationService = new SpecializationService();
