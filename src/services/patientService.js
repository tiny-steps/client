// API service for patient-related operations

class PatientService {
  async getAllPatients(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
    if (params.name) searchParams.append('name', params.name);
    if (params.email) searchParams.append('email', params.email);
    if (params.phone) searchParams.append('phone', params.phone);

    const response = await fetch(`/api/v1/patients?${searchParams}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch patients');
    return response.json();
  }

  async getPatientById(id) {
    const response = await fetch(`/api/v1/patients/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch patient');
    return response.json();
  }

  async createPatient(patientData) {
    const response = await fetch(`/api/v1/patients`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create patient');
    }
    return response.json();
  }

  async updatePatient(id, patientData) {
    const response = await fetch(`/api/v1/patients/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update patient');
    }
    return response.json();
  }

  async deletePatient(id) {
    const response = await fetch(`/api/v1/patients/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete patient');
    }
    return response.ok;
  }

  async getPatientMedicalHistory(patientId) {
    const response = await fetch(`/api/v1/patient-medical-history/${patientId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch medical history');
    return response.json();
  }

  async getPatientAllergies(patientId) {
    const response = await fetch(`/api/v1/patient-allergies/${patientId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch allergies');
    return response.json();
  }

  async getPatientHealthSummary(patientId) {
    const response = await fetch(`/api/v1/patient-health-summary/${patientId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch health summary');
    return response.json();
  }
}

export const patientService = new PatientService();