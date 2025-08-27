// API service for schedule/appointment operations

class ScheduleService {
  async getAllAppointments(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
    if (params.doctorId) searchParams.append('doctorId', params.doctorId);
    if (params.patientId) searchParams.append('patientId', params.patientId);
    if (params.status) searchParams.append('status', params.status);
    if (params.date) searchParams.append('date', params.date);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    const response = await fetch(`/api/v1/appointments?${searchParams}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  }

  async getAppointmentById(id) {
    const response = await fetch(`/api/v1/appointments/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch appointment');
    return response.json();
  }

  async createAppointment(appointmentData) {
    const response = await fetch(`/api/v1/appointments`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create appointment');
    }
    return response.json();
  }

  async updateAppointment(id, appointmentData) {
    const response = await fetch(`/api/v1/appointments/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update appointment');
    }
    return response.json();
  }

  async cancelAppointment(id, reason) {
    const response = await fetch(`/api/v1/appointments/${id}/cancel`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel appointment');
    }
    return response.json();
  }

  async rescheduleAppointment(id, newDateTime) {
    const response = await fetch(`/api/v1/appointments/${id}/reschedule`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newDateTime }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reschedule appointment');
    }
    return response.json();
  }

  async getAppointmentHistory(appointmentId) {
    const response = await fetch(`/api/v1/appointments/${appointmentId}/history`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch appointment history');
    return response.json();
  }
}

export const scheduleService = new ScheduleService();