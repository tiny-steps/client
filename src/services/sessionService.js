class SessionService {
  async getAllSessions(params = {}) {
    // Fetch all sessions regardless of active status
    const cleanParams = { ...params };

    // Convert frontend isActive to backend active parameter
    if (cleanParams.isActive !== undefined) {
      cleanParams.active = cleanParams.isActive;
      delete cleanParams.isActive;
    }

    const searchParams = new URLSearchParams();
    if (cleanParams.page !== undefined)
      searchParams.append("page", cleanParams.page);
    if (cleanParams.size !== undefined)
      searchParams.append("size", cleanParams.size);
    if (cleanParams.sessionTypeId)
      searchParams.append("sessionTypeId", cleanParams.sessionTypeId);
    if (cleanParams.active !== undefined)
      searchParams.append("active", String(cleanParams.active));
    if (cleanParams.minPrice)
      searchParams.append("minPrice", cleanParams.minPrice);
    if (cleanParams.maxPrice)
      searchParams.append("maxPrice", cleanParams.maxPrice);
    if (cleanParams.doctorId)
      searchParams.append("doctorId", cleanParams.doctorId);
    if (cleanParams.branchId)
      searchParams.append("branchId", cleanParams.branchId); // Add branchId support

    const response = await fetch(`/api/v1/sessions?${searchParams}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch sessions";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Map backend 'active' field to frontend 'isActive' field
    if (data.content) {
      data.content = data.content.map((session) => ({
        ...session,
        isActive: session.active,
        sessionType: session.sessionType
          ? {
              ...session.sessionType,
              isActive: session.sessionType.active,
            }
          : session.sessionType,
      }));
    }
    return data;
  }

  async getSessionById(id) {
    const response = await fetch(`/api/v1/sessions/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch session";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Map backend 'active' field to frontend 'isActive' field
    return {
      ...data,
      isActive: data.active,
      sessionType: data.sessionType
        ? {
            ...data.sessionType,
            isActive: data.sessionType.active,
          }
        : data.sessionType,
    };
  }

  async createSession(sessionData) {
    const response = await fetch(`/api/v1/sessions`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      let errorMessage = "Failed to create session";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  async updateSession(id, sessionData) {
    const response = await fetch(`/api/v1/sessions/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update session";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  async deleteSession(id) {
    const response = await fetch(`/api/v1/sessions/${id}/deactivate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete session";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  async reactivateSession(id) {
    const response = await fetch(`/api/v1/sessions/${id}/activate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to reactivate session";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Session Type Management
  async getAllSessionTypes(params = {}) {
    // Fetch all session types regardless of active status
    const cleanParams = { ...params };

    // Convert frontend isActive to backend active parameter
    if (cleanParams.isActive !== undefined) {
      cleanParams.active = cleanParams.isActive;
      delete cleanParams.isActive;
    }

    const searchParams = new URLSearchParams();
    if (cleanParams.page !== undefined)
      searchParams.append("page", cleanParams.page);
    if (cleanParams.size !== undefined)
      searchParams.append("size", cleanParams.size);
    if (cleanParams.name) searchParams.append("name", cleanParams.name);
    if (cleanParams.active !== undefined)
      searchParams.append("active", String(cleanParams.active));
    if (cleanParams.isTelemedicineAvailable !== undefined)
      searchParams.append(
        "isTelemedicineAvailable",
        String(cleanParams.isTelemedicineAvailable)
      );
    if (cleanParams.branchId)
      searchParams.append("branchId", cleanParams.branchId); // Add branchId support

    const response = await fetch(`/api/v1/session-types?${searchParams}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch session types";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Map backend 'active' field to frontend 'isActive' field
    if (data.content) {
      data.content = data.content.map((sessionType) => ({
        ...sessionType,
        isActive: sessionType.active,
      }));
    }
    return data;
  }

  async getSessionTypeById(id) {
    const response = await fetch(`/api/v1/session-types/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch session type";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Map backend 'active' field to frontend 'isActive' field
    return {
      ...data,
      isActive: data.active,
    };
  }

  async createSessionType(sessionTypeData) {
    const response = await fetch(`/api/v1/session-types`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionTypeData),
    });

    if (!response.ok) {
      let errorMessage = "Failed to create session type";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  async updateSessionType(id, sessionTypeData) {
    const response = await fetch(`/api/v1/session-types/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionTypeData),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update session type";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  async deleteSessionType(id) {
    // Use hard delete for session types instead of soft delete
    const response = await fetch(`/api/v1/session-types/${id}/deactivate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete session type";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.ok;
  }

  async reactivateSessionType(id) {
    // Session types use reactivate endpoint for soft deleted items
    const response = await fetch(`/api/v1/session-types/${id}/activate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to reactivate session type";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  async activateSessionType(id) {
    const response = await fetch(`/api/v1/session-types/${id}/activate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to activate session type";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  async deactivateSessionType(id) {
    const response = await fetch(`/api/v1/session-types/${id}/deactivate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to deactivate session type";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Session Offering Management
  async activateSession(id) {
    const response = await fetch(`/api/v1/sessions/${id}/activate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to activate session";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  async deactivateSession(id) {
    const response = await fetch(`/api/v1/sessions/${id}/deactivate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to deactivate session";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Convenience methods for different session status filters
  async getActiveSessions(params = {}) {
    return this.getAllSessions({ ...params, isActive: true });
  }

  async getInactiveSessions(params = {}) {
    return this.getAllSessions({ ...params, isActive: false });
  }

  async getAllSessionsIncludingInactive(params = {}) {
    // Explicitly remove both isActive and active filters to get all
    const { isActive, active, ...restParams } = params;
    return this.getAllSessions(restParams);
  }

  // Session Type convenience methods
  async getActiveSessionTypes(params = {}) {
    return this.getAllSessionTypes({ ...params, isActive: true });
  }

  async getInactiveSessionTypes(params = {}) {
    return this.getAllSessionTypes({ ...params, isActive: false });
  }

  async getAllSessionTypesIncludingInactive(params = {}) {
    // Explicitly remove both isActive and active filters to get all
    const { isActive, active, ...restParams } = params;
    return this.getAllSessionTypes(restParams);
  }

  // Get doctors with sessions
  async getDoctorIdsWithSessions(branchId = null) {
    try {
      let url = "/api/v1/sessions/doctors-with-sessions";

      if (branchId) {
        url = `/api/v1/sessions/doctors-with-sessions/branch/${branchId}`;
      }

      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctors with sessions");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching doctors with sessions:", error);
      return [];
    }
  }
}

export const sessionService = new SessionService();
