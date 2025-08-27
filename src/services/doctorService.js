// API service for doctor-related operations

class DoctorService {
  async getAllDoctors(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.append("page", params.page);
    if (params.size !== undefined) searchParams.append("size", params.size);
    if (params.name) searchParams.append("name", params.name);
    if (params.speciality) searchParams.append("speciality", params.speciality);
    if (params.minExperience)
      searchParams.append("minExperience", params.minExperience);

    const response = await fetch(`/api/v1/doctors?${searchParams}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }

    return response.json();
  }

  async getDoctorById(id) {
    const response = await fetch(`/api/v1/doctors/${id}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch doctor");
    }

    return response.json();
  }

  async createDoctor(doctorData) {
    const response = await fetch(`/api/v1/doctors/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctorData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create doctor");
    }

    return response.json();
  }

  async updateDoctor(id, doctorData) {
    const response = await fetch(`/api/v1/doctors/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctorData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update doctor");
    }

    return response.json();
  }

  async deleteDoctor(id) {
    const response = await fetch(`/api/v1/doctors/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete doctor");
    }

    return response.ok;
  }

  async activateDoctor(id) {
    const response = await fetch(`/api/v1/doctors/${id}/activate`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to activate doctor");
    }

    return response.json();
  }

  async deactivateDoctor(id) {
    const response = await fetch(`/api/v1/doctors/${id}/deactivate`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to deactivate doctor");
    }

    return response.json();
  }

  async searchDoctors(searchParams) {
    return this.getAllDoctors(searchParams);
  }

  async getVerifiedDoctors(params = {}) {
    return this.getAllDoctors({ ...params, verified: true });
  }
}

export const doctorService = new DoctorService();