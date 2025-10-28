// Comprehensive Timeoff Service for managing doctor time off requests

class TimeoffService {
  // Get all timeoffs for a doctor (alias for getAllTimeOffs)
  async getDoctorTimeOffs(doctorId, params = {}) {
    return this.getAllTimeOffs(doctorId, params);
  }

  // Get all timeoffs for a doctor
  async getAllTimeOffs(doctorId, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);
    if (params.status) searchParams.append("status", params.status);
    if (params.page) searchParams.append("page", params.page);
    if (params.size) searchParams.append("size", params.size);

    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/time-offs?${searchParams}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch time offs");
    }
    return response.json();
  }

  // Get all timeoffs for admin view
  async getAllTimeOffsAdmin(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.doctorId) searchParams.append("doctorId", params.doctorId);
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);
    if (params.status) searchParams.append("status", params.status);
    if (params.page) searchParams.append("page", params.page);
    if (params.size) searchParams.append("size", params.size);

    const response = await fetch(`/api/v1/timings/time-offs?${searchParams}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch time offs");
    }
    return response.json();
  }

  // Create a new timeoff request
  async createTimeOff(doctorId, timeOffData) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/time-offs`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(timeOffData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create time off");
    }
    return response.json();
  }

  // Update an existing timeoff
  async updateTimeOff(doctorId, timeOffId, timeOffData) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/time-offs/${timeOffId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(timeOffData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update time off");
    }
    return response.json();
  }

  // Delete a timeoff
  async deleteTimeOff(doctorId, timeOffId) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/time-offs/${timeOffId}`,
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
      throw new Error(error.message || "Failed to delete time off");
    }
    return response.ok;
  }

  // Cancel a timeoff
  async cancelTimeOff(doctorId, timeOffId) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/time-offs/${timeOffId}/cancel`,
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
      throw new Error(error.message || "Failed to cancel time off");
    }
    return response.json();
  }

  // Approve a timeoff (admin only)
  async approveTimeOff(timeOffId, approvalData = {}) {
    const response = await fetch(
      `/api/v1/timings/time-offs/${timeOffId}/approve`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(approvalData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to approve time off");
    }
    return response.json();
  }

  // Reject a timeoff (admin only)
  async rejectTimeOff(timeOffId, rejectionData = {}) {
    const response = await fetch(
      `/api/v1/timings/time-offs/${timeOffId}/reject`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rejectionData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reject time off");
    }
    return response.json();
  }

  // Get timeoff statistics
  async getTimeOffStats(doctorId, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.year) searchParams.append("year", params.year);
    if (params.month) searchParams.append("month", params.month);

    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/time-offs/stats?${searchParams}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch time off statistics");
    }
    return response.json();
  }

  // Check for conflicts with existing appointments
  async checkConflicts(doctorId, timeOffData) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/time-offs/check-conflicts`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(timeOffData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to check conflicts");
    }
    return response.json();
  }

  // Get upcoming timeoffs
  async getUpcomingTimeOffs(doctorId, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.days) searchParams.append("days", params.days);

    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/time-offs/upcoming?${searchParams}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch upcoming time offs");
    }
    return response.json();
  }
}

export const timeoffService = new TimeoffService();
