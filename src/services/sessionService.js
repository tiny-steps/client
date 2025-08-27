// API service for session-related operations

class SessionService {
  async getAllSessions(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
    if (params.doctorId) searchParams.append('doctorId', params.doctorId);
    if (params.sessionType) searchParams.append('sessionType', params.sessionType);
    if (params.status) searchParams.append('status', params.status);

    const response = await fetch(`/api/v1/sessions?${searchParams}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  }

  async getSessionById(id) {
    const response = await fetch(`/api/v1/sessions/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch session');
    return response.json();
  }

  async createSession(sessionData) {
    const response = await fetch(`/api/v1/sessions`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create session');
    }
    return response.json();
  }

  async updateSession(id, sessionData) {
    const response = await fetch(`/api/v1/sessions/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update session');
    }
    return response.json();
  }

  async deleteSession(id) {
    const response = await fetch(`/api/v1/sessions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete session');
    }
    return response.ok;
  }

  async getSessionTypes() {
    const response = await fetch(`/api/v1/session-types`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch session types');
    return response.json();
  }
}

export const sessionService = new SessionService();