// API service for patient-related operations

class PatientService {
  async getAllPatients(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append("page", params.page);
    if (params.size !== undefined) searchParams.append("size", params.size);

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
      body: JSON.stringify(patientData),
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
      method: "PUT",
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
    const response = await fetch(`/api/v1/patients/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete patient");
    }
    return response.ok;
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
