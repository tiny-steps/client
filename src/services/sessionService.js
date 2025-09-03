class SessionService {
 async getAllSessions(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
     if (params.sessionTypeId) searchParams.append('sessionTypeId', params.sessionTypeId);
     if (params.isActive !== undefined) searchParams.append('isActive', params.isActive);
     if (params.minPrice) searchParams.append('minPrice', params.minPrice);
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice);
    if (params.doctorId) searchParams.append('doctorId', params.doctorId);

    const response = await fetch(`/api/v1/sessions?${searchParams}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch sessions';
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
      data.content = data.content.map(session => ({
        ...session,
        isActive: session.active,
        sessionType: session.sessionType ? {
          ...session.sessionType,
          isActive: session.sessionType.active
        } : session.sessionType
      }));
    }
    return data;
  }

 async getSessionById(id) {
    const response = await fetch(`/api/v1/sessions/${id}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch session';
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
      sessionType: data.sessionType ? {
        ...data.sessionType,
        isActive: data.sessionType.active
      } : data.sessionType
    };
  }

 async createSession(sessionData) {
 const response = await fetch(`/api/v1/sessions`, {
 method: 'POST',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(sessionData),
 });

 if (!response.ok) {
 let errorMessage = 'Failed to create session';
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
 method: 'PUT',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(sessionData),
 });

 if (!response.ok) {
 let errorMessage = 'Failed to update session';
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
 const response = await fetch(`/api/v1/sessions/${id}`, {
 method: 'DELETE',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json' },
 });

 if (!response.ok) {
 let errorMessage = 'Failed to delete session';
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

 // Session Type Management
 async getAllSessionTypes(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
    if (params.name) searchParams.append('name', params.name);
    if (params.isActive !== undefined) searchParams.append('isActive', params.isActive);
    if (params.isTelemedicineAvailable !== undefined) searchParams.append('isTelemedicineAvailable', params.isTelemedicineAvailable);

    const response = await fetch(`/api/v1/session-types?${searchParams}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch session types';
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
      data.content = data.content.map(sessionType => ({
        ...sessionType,
        isActive: sessionType.active
      }));
    }
    return data;
  }

 async getSessionTypeById(id) {
    const response = await fetch(`/api/v1/session-types/${id}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch session type';
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
      isActive: data.active
    };
  }

 async createSessionType(sessionTypeData) {
 const response = await fetch(`/api/v1/session-types`, {
 method: 'POST',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(sessionTypeData),
 });

 if (!response.ok) {
 let errorMessage = 'Failed to create session type';
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
 method: 'PUT',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(sessionTypeData),
 });

 if (!response.ok) {
 let errorMessage = 'Failed to update session type';
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
 const response = await fetch(`/api/v1/session-types/${id}`, {
 method: 'DELETE',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json' },
 });

 if (!response.ok) {
 let errorMessage = 'Failed to delete session type';
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

 async activateSessionType(id) {
 const response = await fetch(`/api/v1/session-types/${id}/activate`, {
 method: 'POST',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json' },
 });

 if (!response.ok) {
 let errorMessage = 'Failed to activate session type';
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
 method: 'POST',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json' },
 });

 if (!response.ok) {
 let errorMessage = 'Failed to deactivate session type';
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
 method: 'POST',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json' },
 });

 if (!response.ok) {
 let errorMessage = 'Failed to activate session';
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
 method: 'POST',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json' },
 });

 if (!response.ok) {
 let errorMessage = 'Failed to deactivate session';
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
}

export const sessionService = new SessionService();