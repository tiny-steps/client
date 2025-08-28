// API service for timing-related operations

class TimingService {
  async getAllAvailabilities(params = {}) {
    try {
      // First, get all doctors
      const doctorsResponse = await fetch("/api/v1/doctors?size=100", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!doctorsResponse.ok) {
        console.warn("Failed to fetch doctors for availability aggregation");
        return { data: { content: [] } };
      }

      const doctorsData = await doctorsResponse.json();
      const doctors = doctorsData.data?.content || [];

      console.log("🔍 TimingService Debug - Doctors:", doctors);

      // Then, fetch availability for each doctor
      const allAvailabilities = [];
      const searchParams = new URLSearchParams();
      if (params.date) searchParams.append("date", params.date);
      if (params.startDate) searchParams.append("startDate", params.startDate);
      if (params.endDate) searchParams.append("endDate", params.endDate);

      for (const doctor of doctors) {
        try {
          const availabilityResponse = await fetch(
            `/api/v1/timings/doctors/${doctor.id}/availabilities?${searchParams}`,
            {
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (availabilityResponse.ok) {
            const availabilityData = await availabilityResponse.json();
            const availabilities = availabilityData.data?.content || [];

            console.log(
              `🔍 TimingService Debug - Doctor ${doctor.id} availabilities:`,
              availabilities
            );

            // Add doctor information to each availability
            const enrichedAvailabilities = availabilities.map(
              (availability) => ({
                ...availability,
                doctorId: doctor.id,
                doctorName:
                  doctor.name ||
                  `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim(),
              })
            );

            allAvailabilities.push(...enrichedAvailabilities);
          }
        } catch (error) {
          console.warn(
            `Failed to fetch availability for doctor ${doctor.id}:`,
            error
          );
        }
      }

      console.log(
        "🔍 TimingService Debug - Final aggregated availabilities:",
        allAvailabilities
      );
      return { data: { content: allAvailabilities } };
    } catch (error) {
      console.error("Error fetching all availabilities:", error);
      return { data: { content: [] } };
    }
  }

  async getDoctorAvailability(doctorId, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.date) searchParams.append("date", params.date);
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);

    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/availabilities?${searchParams}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch availability");
    return response.json();
  }

  async createAvailability(doctorId, availabilityData) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/availabilities`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(availabilityData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create availability");
    }
    return response.json();
  }

  async updateAvailability(doctorId, availabilityId, data) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/availabilities/${availabilityId}/durations`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update availability");
    }
    return response.json();
  }

  async deleteAvailability(doctorId, availabilityId) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/availabilities/${availabilityId}`,
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
      throw new Error(error.message || "Failed to delete availability");
    }
    return response.ok;
  }

  async getDoctorTimeOffs(doctorId, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);

    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/time-offs?${searchParams}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch time offs");
    return response.json();
  }

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

  async updateDuration(doctorId, availabilityId, durationId, data) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/availabilities/${availabilityId}/durations/${durationId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update duration");
    }
    return response.json();
  }

  async deleteDuration(doctorId, availabilityId, durationId) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/availabilities/${availabilityId}/durations/${durationId}`,
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
      throw new Error(error.message || "Failed to delete duration");
    }
    return response.ok;
  }

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
}

export const timingService = new TimingService();
