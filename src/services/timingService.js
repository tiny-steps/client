// API service for timing-related operations

class TimingService {
  async getDoctorAvailability(doctorId, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.date) searchParams.append('date', params.date);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    const response = await fetch(`/api/v1/doctors/${doctorId}/availabilities?${searchParams}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch availability');
    return response.json();
  }

  async createAvailability(doctorId, availabilityData) {
    const response = await fetch(`/api/v1/doctors/${doctorId}/availabilities`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(availabilityData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create availability');
    }
    return response.json();
  }

  async updateAvailability(doctorId, availabilityId, data) {
    const response = await fetch(`/api/v1/doctors/${doctorId}/availabilities/${availabilityId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update availability');
    }
    return response.json();
  }

  async deleteAvailability(doctorId, availabilityId) {
    const response = await fetch(`/api/v1/doctors/${doctorId}/availabilities/${availabilityId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete availability');
    }
    return response.ok;
  }

  async getDoctorTimeOffs(doctorId, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    const response = await fetch(`/api/v1/doctors/${doctorId}/time-offs?${searchParams}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch time offs');
    return response.json();
  }

  async createTimeOff(doctorId, timeOffData) {
    const response = await fetch(`/api/v1/doctors/${doctorId}/time-offs`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(timeOffData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create time off');
    }
    return response.json();
  }
}

export const timingService = new TimingService();