// API service for patient allergy-related operations

class PatientAllergyService {
 async getAllPatientAllergies(params = {}) {
 const searchParams = new URLSearchParams();

 if (params.page !== undefined) searchParams.append("page", params.page);
 if (params.size !== undefined) searchParams.append("size", params.size);
 if (params.sort) searchParams.append("sort", params.sort);
 if (params.allergen) searchParams.append("allergen", params.allergen);
 if (params.patientId) searchParams.append("patientId", params.patientId);
 if (params.severity) searchParams.append("severity", params.severity);

 const response = await fetch(`/api/v1/patient-allergies?${searchParams}`, {
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to fetch patient allergies");
 }

 return response.json();
 }

 async getPatientAllergyById(id) {
 const response = await fetch(`/api/v1/patient-allergies/${id}`, {
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to fetch patient allergy");
 }

 return response.json();
 }

 async getAllergiesByPatientId(patientId, params = {}) {
 const searchParams = new URLSearchParams();

 if (params.page !== undefined) searchParams.append("page", params.page);
 if (params.size !== undefined) searchParams.append("size", params.size);
 if (params.sort) searchParams.append("sort", params.sort);

 const response = await fetch(
 `/api/v1/patient-allergies/patient/${patientId}?${searchParams}`,
 {
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 }
 );

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to fetch patient allergies");
 }

 return response.json();
 }

 async createPatientAllergy(allergyData) {
 const response = await fetch(`/api/v1/patient-allergies`, {
 method: "POST",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify(allergyData),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to create patient allergy");
 }

 return response.json();
 }

 async updatePatientAllergy(id, allergyData) {
 const response = await fetch(`/api/v1/patient-allergies/${id}`, {
 method: "PUT",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify(allergyData),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to update patient allergy");
 }

 return response.json();
 }

 async deletePatientAllergy(id) {
 const response = await fetch(`/api/v1/patient-allergies/${id}`, {
 method: "DELETE",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to delete patient allergy");
 }

 return response.ok;
 }

 async searchAllergiesByAllergen(allergen, params = {}) {
 const searchParams = new URLSearchParams();

 if (params.page !== undefined) searchParams.append("page", params.page);
 if (params.size !== undefined) searchParams.append("size", params.size);
 if (params.sort) searchParams.append("sort", params.sort);

 const response = await fetch(
 `/api/v1/patient-allergies/search/allergen/${allergen}?${searchParams}`,
 {
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 }
 );

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to search allergies");
 }

 return response.json();
 }

 async checkPatientAllergy(patientId, allergen) {
 const response = await fetch(
 `/api/v1/patient-allergies/check/${patientId}/${allergen}`,
 {
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 }
 );

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to check patient allergy");
 }

 return response.json();
 }

 async addAllergy(patientId, allergen, reaction) {
 const response = await fetch(`/api/v1/patient-allergies/add`, {
 method: "POST",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 patientId,
 allergen,
 reaction,
 }),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to add allergy");
 }

 return response.json();
 }

 async removeAllergy(patientId, allergen) {
 const response = await fetch(`/api/v1/patient-allergies/remove`, {
 method: "DELETE",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 patientId,
 allergen,
 }),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message || "Failed to remove allergy");
 }

 return response.ok;
 }
}

export const patientAllergyService = new PatientAllergyService();
