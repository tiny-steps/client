// API service for doctor-related operations

class DoctorService {
  async getAllDoctors(params = {}) {
    // Set default to fetch only active doctors unless explicitly specified otherwise
    // Remove status from params if undefined to avoid sending empty values
    const cleanParams = { ...params };
    if (cleanParams.status === undefined) {
      cleanParams.status = "ACTIVE"; // Default to active doctors only
    }

    // If branchId is provided, use the branch-specific endpoint
    if (cleanParams.branchId) {
      const searchParams = new URLSearchParams();
      if (cleanParams.page !== undefined)
        searchParams.append("page", cleanParams.page);
      if (cleanParams.size !== undefined)
        searchParams.append("size", cleanParams.size);
      // Only append status if it has a defined value
      if (cleanParams.status !== undefined)
        searchParams.append("status", cleanParams.status);

      const response = await fetch(
        `/api/v1/doctors/branch/${cleanParams.branchId}?${searchParams}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch doctors by branch");
      }

      return response.json();
    }

    // Otherwise, use the general endpoint for all doctors
    const searchParams = new URLSearchParams();
    if (cleanParams.page !== undefined)
      searchParams.append("page", cleanParams.page);
    if (cleanParams.size !== undefined)
      searchParams.append("size", cleanParams.size);
    if (cleanParams.name) searchParams.append("name", cleanParams.name);
    if (cleanParams.speciality)
      searchParams.append("speciality", cleanParams.speciality);
    if (cleanParams.minExperience)
      searchParams.append("minExperience", cleanParams.minExperience);
    // Only append status if it has a defined value
    if (cleanParams.status !== undefined)
      searchParams.append("status", cleanParams.status);

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
    // For doctors, we'll use deactivate instead of hard delete to preserve data
    // This maintains referential integrity with appointments and other records
    const response = await fetch(`/api/v1/doctors/${id}/deactivate`, {
      method: "POST",
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

  async activateDoctor(id) {
    // Primary method for activating doctors - uses POST method as per backend API
    const response = await fetch(`/api/v1/doctors/${id}/activate`, {
      method: "POST",
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

  // Alias for activateDoctor for consistency with other services
  async reactivateDoctor(id) {
    return this.activateDoctor(id);
  }

  async deactivateDoctor(id) {
    // Primary method for deactivating doctors - uses POST method as per backend API
    const response = await fetch(`/api/v1/doctors/${id}/deactivate`, {
      method: "POST",
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

  // Convenience methods for different doctor status filters
  async getActiveDoctors(params = {}) {
    return this.getAllDoctors({ ...params, status: "ACTIVE" });
  }

  async getInactiveDoctors(params = {}) {
    return this.getAllDoctors({ ...params, status: "INACTIVE" });
  }

  async getAllDoctorsIncludingInactive(params = {}) {
    // Explicitly remove status filter to get both active and inactive
    const { status, ...restParams } = params;
    return this.getAllDoctors(restParams);
  }

  // Branch Management Methods
  async addDoctorToBranch(doctorId, branchId, role = "CONSULTANT") {
    const response = await fetch(
      `/api/v1/doctors/branch-transfer/add/${doctorId}?branchId=${branchId}&role=${role}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add doctor to branch");
    }

    return response.json();
  }

  async transferDoctorBetweenBranches(
    doctorId,
    sourceBranchId,
    targetBranchId
  ) {
    const response = await fetch(
      `/api/v1/doctors/branch-transfer/transfer/${doctorId}?sourceBranchId=${sourceBranchId}&targetBranchId=${targetBranchId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to transfer doctor");
    }

    return response.json();
  }

  async getDoctorBranches(doctorId) {
    const response = await fetch(`/api/v1/doctors/${doctorId}/branches`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch doctor branches");
    }

    return response.json();
  }

  async removeDoctorFromBranch(doctorId, branchId) {
    const response = await fetch(
      `/api/v1/doctors/branch-transfer/remove/${doctorId}?branchId=${branchId}`,
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
      throw new Error(error.message || "Failed to remove doctor from branch");
    }

    return response.json();
  }

  // Remove doctor from specific branch (soft delete - sets status to INACTIVE)
  async removeDoctorAddress(doctorId, addressId, practiceRole = "CONSULTANT") {
    const response = await fetch(
      `/api/v1/doctor-addresses/remove/${doctorId}/${addressId}?practiceRole=${practiceRole}`,
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
      throw new Error(error.message || "Failed to remove doctor from branch");
    }

    return response.json();
  }

  // Activate doctor address (sets status to ACTIVE)
  async activateDoctorAddress(
    doctorId,
    addressId,
    practiceRole = "CONSULTANT"
  ) {
    const response = await fetch(
      `/api/v1/doctor-addresses/activate/${doctorId}/${addressId}?practiceRole=${practiceRole}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to activate doctor address");
    }

    return response.json();
  }

  // Get doctors with branch status for a specific branch
  async getDoctorsWithBranchStatus(branchId, params = {}) {
    const cleanParams = { ...params };
    
    // Build query parameters
    const searchParams = new URLSearchParams();
    if (cleanParams.page !== undefined)
      searchParams.append("page", cleanParams.page);
    if (cleanParams.size !== undefined)
      searchParams.append("size", cleanParams.size);
    if (cleanParams.status !== undefined)
      searchParams.append("status", cleanParams.status);
    if (cleanParams.name)
      searchParams.append("name", cleanParams.name);
    if (cleanParams.speciality)
      searchParams.append("speciality", cleanParams.speciality);

    const response = await fetch(
      `/api/v1/doctors/branch/${branchId}/status?${searchParams}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Fallback to the regular branch endpoint if status endpoint doesn't exist
      const fallbackResponse = await fetch(
        `/api/v1/doctors/branch/${branchId}?${searchParams}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!fallbackResponse.ok) {
        throw new Error("Failed to fetch doctors with branch status");
      }
      
      return fallbackResponse.json();
    }

    return response.json();
  }

  // Get user's accessible branch IDs
  async getUserAccessibleBranchIds(userId) {
    console.log(
      "Debug - getUserAccessibleBranchIds called with userId:",
      userId
    );

    // Try the UserController endpoint first
    let response = await fetch(`/api/v1/users/${userId}/branches`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // If that fails, try the UserBranchController endpoint
    if (!response.ok) {
      console.log("Debug - First endpoint failed, trying alternative endpoint");
      response = await fetch(
        `/api/v1/user-branches/user/${userId}/branch-ids`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!response.ok) {
      const error = await response.json();
      console.error("Debug - getUserAccessibleBranchIds error:", error);
      throw new Error(
        error.message || "Failed to fetch user accessible branches"
      );
    }

    const result = await response.json();
    console.log("Debug - getUserAccessibleBranchIds result:", result);
    return result;
  }
}

export const doctorService = new DoctorService();
