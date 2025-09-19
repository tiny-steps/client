// API service for patient-related operations

class PatientService {
  async getAllPatients(params = {}) {
    // Set default to fetch only active patients unless explicitly specified otherwise
    const cleanParams = { ...params };
    if (cleanParams.status === undefined) {
      cleanParams.status = "ACTIVE"; // Default to active patients only
    }

    // If branchId is provided, use the branch-specific endpoint
    if (cleanParams.branchId) {
      const searchParams = new URLSearchParams();
      if (cleanParams.page !== undefined)
        searchParams.append("page", cleanParams.page);
      if (cleanParams.size !== undefined)
        searchParams.append("size", cleanParams.size);
      if (cleanParams.status !== undefined)
        searchParams.append("status", cleanParams.status);

      const response = await fetch(
        `/api/v1/patients/branch/${cleanParams.branchId}?${searchParams}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch patients by branch");
      const result = await response.json();
      return result; // Backend returns ResponseModel<Page<PatientDto>>
    }

    // Otherwise, use the general endpoint for all patients
    const searchParams = new URLSearchParams();
    if (cleanParams.page !== undefined)
      searchParams.append("page", cleanParams.page);
    if (cleanParams.size !== undefined)
      searchParams.append("size", cleanParams.size);
    if (cleanParams.status !== undefined)
      searchParams.append("status", cleanParams.status);

    const response = await fetch(`/api/v1/patients?${searchParams}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch patients");
    const result = await response.json();
    return result; // Backend returns ResponseModel<Page<PatientDto>>
  }

  async getPatientById(id) {
    const response = await fetch(`/api/v1/patients/${id}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch patient");
    const result = await response.json();
    return result; // Backend returns ResponseModel<PatientDto>
  }

  async createPatient(patientData) {
    // Use the register endpoint for creating new patients
    const response = await fetch(`/api/v1/patients/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...patientData, status:"ACTIVE"}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create patient");
    }
    const result = await response.json();
    return result; // Backend returns ResponseModel<PatientDto>
  }

  async updatePatient(id, patientData) {
    const response = await fetch(`/api/v1/patients/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update patient");
    }
    const result = await response.json();
    return result; // Backend returns ResponseModel<PatientDto>
  }

  async deletePatient(id) {
    const response = await fetch(`/api/v1/patients/${id}/soft-delete`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete patient");
    }
    const result = await response.json();
    return result;
  }

  async reactivatePatient(id) {
    const response = await fetch(`/api/v1/patients/${id}/reactivate`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reactivate patient");
    }
    const result = await response.json();
    return result;
  }

  // Soft delete operations - simple global activate/deactivate
  async activatePatient(id) {
    const response = await fetch(`/api/v1/patients/${id}/activate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to activate patient");
    }
    const result = await response.json();
    return result;
  }

  async deactivatePatient(id) {
    const response = await fetch(`/api/v1/patients/${id}/deactivate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to deactivate patient");
    }
    const result = await response.json();
    return result;
  }

  async softDeletePatient(id) {
    const response = await fetch(`/api/v1/patients/${id}/soft-delete`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to soft delete patient");
    }
    const result = await response.json();
    return result;
  }

  // Get patients by status
  async getActivePatientsList() {
    const response = await fetch(`/api/v1/patients/active`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch active patients");
    }
    const result = await response.json();
    return result;
  }

  async getDeletedPatientsList() {
    const response = await fetch(`/api/v1/patients/deleted`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch deleted patients");
    }
    const result = await response.json();
    return result;
  }

  // Convenience methods for different patient status filters
  async getActivePatients(params = {}) {
    return this.getAllPatients({ ...params, status: "ACTIVE" });
  }

  async getInactivePatients(params = {}) {
    return this.getAllPatients({ ...params, status: "INACTIVE" });
  }

  async getAllPatientsIncludingInactive(params = {}) {
    // Explicitly remove status filter to get both active and inactive
    const { status, ...restParams } = params;
    return this.getAllPatients(restParams);
  }

  async updatePatientEmail(id, newEmail) {
    const response = await fetch(
      `/api/v1/patients/${id}/email?newEmail=${encodeURIComponent(newEmail)}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update patient email");
    }
    const result = await response.json();
    return result;
  }

  // Note: These endpoints don't exist in the backend controller
  // Keeping them for future implementation or removing if not needed
  async getPatientMedicalHistory(patientId) {
    // This would need to be implemented in patient-medical-history controller
    const response = await fetch(
      `/api/v1/patient-medical-history/patient/${patientId}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch medical history");
    return response.json();
  }

  async getPatientAllergies(patientId) {
    // This would need to be implemented in patient-allergy controller
    const response = await fetch(
      `/api/v1/patient-allergies/patient/${patientId}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch allergies");
    return response.json();
  }

  async getPatientHealthSummary(patientId) {
    // This would need to be implemented in patient-health-summary controller
    const response = await fetch(
      `/api/v1/patient-health-summary/${patientId}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch health summary");
    return response.json();
  }
}

export const patientService = new PatientService();
