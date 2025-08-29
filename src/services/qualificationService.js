// API service for qualification-related operations

class QualificationService {
 async getAllQualifications(params = {}) {
 const queryParams = new URLSearchParams();
 if (params.page) queryParams.append("page", params.page);
 if (params.size) queryParams.append("size", params.size);
 if (params.doctorId) queryParams.append("doctorId", params.doctorId);

 const response = await fetch(`/api/v1/qualifications?${queryParams}`, {
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to fetch qualifications");
 }
 const result = await response.json();
 return result;
 }

 async getQualificationById(qualificationId) {
 const response = await fetch(`/api/v1/qualifications/${qualificationId}`, {
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to fetch qualification");
 }
 const result = await response.json();
 return result;
 }

 async getQualificationsByDoctor(doctorId, params = {}) {
 const queryParams = new URLSearchParams();
 if (params.page) queryParams.append("page", params.page);
 if (params.size) queryParams.append("size", params.size);

 const response = await fetch(
 `/api/v1/qualifications/doctor/${doctorId}?${queryParams}`,
 {
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 }
 );

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to fetch doctor qualifications");
 }
 const result = await response.json();
 return result;
 }

 async createQualification(doctorId, qualificationData) {
 const response = await fetch(`/api/v1/qualifications/doctor/${doctorId}`, {
 method: "POST",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify(qualificationData),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to create qualification");
 }
 const result = await response.json();
 return result;
 }

 async updateQualification(qualificationId, qualificationData) {
 const response = await fetch(`/api/v1/qualifications/${qualificationId}`, {
 method: "PUT",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify(qualificationData),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to update qualification");
 }
 const result = await response.json();
 return result;
 }

 async deleteQualification(qualificationId) {
 const response = await fetch(`/api/v1/qualifications/${qualificationId}`, {
 method: "DELETE",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to delete qualification");
 }
 }

 async createQualificationsBatch(doctorId, qualificationsData) {
 const response = await fetch(
 `/api/v1/qualifications/doctor/${doctorId}/batch`,
 {
 method: "POST",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify(qualificationsData),
 }
 );

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to create qualifications batch");
 }
 const result = await response.json();
 return result;
 }

 async deleteQualificationsByDoctor(doctorId) {
 const response = await fetch(`/api/v1/qualifications/doctor/${doctorId}`, {
 method: "DELETE",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(
 error.message || "Failed to delete doctor qualifications"
 );
 }
 }

 async getQualificationCount() {
 const response = await fetch("/api/v1/qualifications/statistics/count", {
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to fetch qualification count");
 }
 const result = await response.json();
 return result;
 }
}

export const qualificationService = new QualificationService();
