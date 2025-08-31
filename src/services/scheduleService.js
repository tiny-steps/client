// API service for schedule/appointment operations

class ScheduleService {
  async getAllAppointments(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append("page", params.page);
    if (params.size !== undefined) searchParams.append("size", params.size);
    if (params.doctorId) searchParams.append("doctorId", params.doctorId);
    if (params.patientId) searchParams.append("patientId", params.patientId);
    if (params.date) searchParams.append("date", params.date);
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);

    const response = await fetch(`/api/v1/appointments?${searchParams}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to fetch appointments" }));
      throw new Error(
        error.message || `Failed to fetch appointments: ${response.status}`
      );
    }
    return response.json();
  }

  async getAppointmentById(id) {
    const response = await fetch(`/api/v1/appointments/${id}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch appointment");
    return response.json();
  }

  async createAppointment(appointmentData) {
    const response = await fetch(`/api/v1/appointments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create appointment");
    }
    return response.json();
  }

  async updateAppointment(id, appointmentData) {
    const response = await fetch(`/api/v1/appointments/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update appointment");
    }
    return response.json();
  }

  async deleteAppointment(id) {
    const response = await fetch(`/api/v1/appointments/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete appointment");
    }
    return response.ok;
  }

  async cancelAppointment(id, cancellationData) {
    const response = await fetch(`/api/v1/appointments/${id}/cancel`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cancellationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to cancel appointment");
    }
    return response.json();
  }

  async rescheduleAppointment(id, newDateTime) {
    const response = await fetch(`/api/v1/appointments/${id}/reschedule`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newDateTime }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reschedule appointment");
    }
    return response.json();
  }

  async getAppointmentHistory(appointmentId) {
    const response = await fetch(
      `/api/v1/appointments/${appointmentId}/history`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch appointment history");
    return response.json();
  }

  async completeAppointment(id, completionData = {}) {
    const response = await fetch(`/api/v1/appointments/${id}/complete`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to complete appointment");
    }
    return response.json();
  }

  // New unified status change method
  async changeAppointmentStatus(id, statusData) {
    const {
      status,
      changedById,
      reason,
      cancellationType,
      rescheduledToAppointmentId,
    } = statusData;

    const searchParams = new URLSearchParams();
    searchParams.append("status", status);
    searchParams.append("changedById", changedById);
    if (reason) searchParams.append("reason", reason);
    if (cancellationType)
      searchParams.append("cancellationType", cancellationType);
    if (rescheduledToAppointmentId)
      searchParams.append(
        "rescheduledToAppointmentId",
        rescheduledToAppointmentId
      );

    const response = await fetch(
      `/api/v1/appointments/${id}/status?${searchParams}`,
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
      throw new Error(error.message || "Failed to change appointment status");
    }
    return response.json();
  }
}

export const scheduleService = new ScheduleService();
