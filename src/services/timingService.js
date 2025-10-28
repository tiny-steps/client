// API service for timing-related operations

class TimingService {
  async getAllAvailabilities(params = {}) {
    try {
      console.log(
        "🔍 TimingService Debug - Using branch-specific availability endpoint"
      );

      let availabilities = [];

      // If branchId is provided, use the branch-specific endpoint
      if (params.branchId) {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append("page", params.page);
        if (params.size !== undefined) searchParams.append("size", params.size);
        if (params.doctorId) searchParams.append("doctorId", params.doctorId);
        if (params.isActive !== undefined)
          searchParams.append("isActive", params.isActive);

        // Use a placeholder doctorId in the path (required by API design) and actual filtering via request params
        // The API design requires a doctorId path variable but uses request parameters for actual filtering
        const placeholderDoctorId = "00000000-0000-0000-0000-000000000000";
        const response = await fetch(
          `/api/v1/timings/doctors/${placeholderDoctorId}/availabilities/branch/${params.branchId}?${searchParams}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.warn("Failed to fetch availabilities from branch endpoint");
          return { data: { content: [] } };
        }

        const responseData = await response.json();
        availabilities = responseData.content || [];
      } else {
        // Fallback to the general endpoint for admin users
        const response = await fetch(`/api/v1/timings`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.warn("Failed to fetch availabilities from general endpoint");
          return { data: { content: [] } };
        }

        const responseData = await response.json();
        availabilities = responseData.data || [];
      }

      console.log(
        "🔍 TimingService Debug - Availabilities from new API:",
        availabilities
      );

      // Get doctor names to enrich the data
      let doctorsResponse;
      if (params.branchId) {
        // Use branch-specific endpoint for doctors
        const doctorsSearchParams = new URLSearchParams();
        doctorsSearchParams.append("size", "100");

        doctorsResponse = await fetch(
          `/api/v1/doctors/branch/${params.branchId}?${doctorsSearchParams}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Use general endpoint for doctors
        const doctorsSearchParams = new URLSearchParams();
        doctorsSearchParams.append("size", "100");

        doctorsResponse = await fetch(
          `/api/v1/doctors?${doctorsSearchParams}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      let doctorsMap = new Map();
      if (doctorsResponse.ok) {
        const doctorsData = await doctorsResponse.json();
        const doctors = doctorsData.data?.content || [];
        console.log("🔍 TimingService Debug - Doctors data:", doctors);

        doctorsMap = new Map(
          doctors.map((doctor) => [
            doctor.id,
            doctor.name ||
              `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim(),
          ])
        );
        console.log(
          "🔍 TimingService Debug - Doctors map:",
          Array.from(doctorsMap.entries())
        );
      } else {
        console.warn("⚠️ Failed to fetch doctors data");
      }

      // Filter out availabilities with empty durations FIRST, then enrich with doctor names
      const validAvailabilities = availabilities.filter(
        (availability) =>
          availability.active &&
          availability.durations &&
          availability.durations.length > 0 &&
          availability.durations.some(
            (duration) =>
              duration.startTime &&
              duration.endTime &&
              duration.startTime !== duration.endTime
          )
      );

      const enrichedAvailabilities = validAvailabilities.map((availability) => {
        const doctorName = doctorsMap.get(availability.doctorId);
        if (!doctorName) {
          console.warn(
            `⚠️ Doctor name not found for ID: ${availability.doctorId}`
          );
        }
        return {
          ...availability,
          doctorName: doctorName || "Unknown Doctor",
        };
      });

      console.log(
        "🔍 TimingService Debug - Final enriched availabilities:",
        enrichedAvailabilities
      );

      return { data: { content: enrichedAvailabilities } };
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
      `/api/v1/timings/doctors/${doctorId}/availabilities/${availabilityId}`,
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
    // Use hard delete for availability
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
    return response.json();
  }

  async reactivateAvailability(doctorId, availabilityId) {
    const response = await fetch(
      `/api/v1/timings/doctors/${doctorId}/availabilities/${availabilityId}/reactivate`,
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
      throw new Error(error.message || "Failed to reactivate availability");
    }
    return response.json();
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
    data.availability = availabilityId;
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

  async getTimeSlots(doctorId, date, practiceId = null, branchId = null) {
    const response = await fetch("/api/v1/timings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctorId,
        date,
        practiceId,
        branchId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch time slots");
    }
    return response.json();
  }

  // Get doctors with availability
  async getDoctorIdsWithAvailability(branchId = null) {
    try {
      let url =
        "/api/v1/timings/doctors/00000000-0000-0000-0000-000000000000/availabilities/doctors-with-availability";

      if (branchId) {
        url = `/api/v1/timings/doctors/00000000-0000-0000-0000-000000000000/availabilities/doctors-with-availability/branch/${branchId}`;
      }

      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctors with availability");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching doctors with availability:", error);
      return [];
    }
  }
}

export const timingService = new TimingService();
