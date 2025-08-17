import { z } from "zod";
import {
  CreateDoctorSchema,
  UpdateDoctorSchema,
  PartialUpdateDoctorSchema,
  SearchDoctorsSchema,
  GetAllDoctorsSchema,
  DoctorResponseSchema,
  PaginatedDoctorsResponseSchema,
  ApiResponseSchema,
} from "../schema/doctors/schema.js";

// Base API configuration

class DoctorService {
  constructor() {
    this.baseUrl = "/api/v1";
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const config = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    const url = `${this.baseUrl}${endpoint}`;

    // Log equivalent curl command
    this.logCurlCommand(url, config);

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    return response.json();
  }

  // Helper method to log curl command
  logCurlCommand(url, config) {
    const method = config.method || "GET";
    let curlCmd = `curl -X ${method}`;

    // Add headers
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        curlCmd += ` -H "${key}: ${value}"`;
      });
    }

    // Add credentials flag
    if (config.credentials === "include") {
      curlCmd += " --include-cookies";
    }

    // Add body if present
    if (config.body) {
      curlCmd += ` -d '${config.body}'`;
    }

    // Add URL
    curlCmd += ` "${url}"`;

    console.log("🔗 Equivalent curl command:");
    console.log(curlCmd);
  }

  // Create a new doctor
  async createDoctor(doctorData) {
    const validatedData = CreateDoctorSchema.parse(doctorData);
    const response = await this.request("/doctors/register", {
      method: "POST",
      body: JSON.stringify(validatedData),
    });
    return DoctorResponseSchema.parse(response);
  }

  // Get doctor by ID
  async getDoctorById(doctorId) {
    z.string().uuid().parse(doctorId);
    const response = await this.request(`/doctors/${doctorId}`);
    return DoctorResponseSchema.parse(response);
  }

  // Get all doctors with pagination
  async getAllDoctors(params = {}) {
    const validatedParams = GetAllDoctorsSchema.parse(params);
    const searchParams = new URLSearchParams();

    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request(`/doctors?${searchParams.toString()}`);
    const validatedResponse = ApiResponseSchema.parse(response);
    return validatedResponse.data;
  }

  // Search doctors with advanced criteria
  async searchDoctors(searchParams = {}) {
    const validatedParams = SearchDoctorsSchema.parse(searchParams);
    const urlParams = new URLSearchParams();

    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined) {
        urlParams.append(key, value.toString());
      }
    });

    const response = await this.request(
      `/doctors/search?${urlParams.toString()}`
    );
    return PaginatedDoctorsResponseSchema.parse(response);
  }

  // Update doctor (full update)
  async updateDoctor(doctorId, doctorData) {
    z.string().uuid().parse(doctorId);
    const validatedData = UpdateDoctorSchema.parse(doctorData);
    const response = await this.request(`/doctors/${doctorId}`, {
      method: "PUT",
      body: JSON.stringify(validatedData),
    });
    return DoctorResponseSchema.parse(response);
  }

  // Partially update doctor
  async partialUpdateDoctor(doctorId, doctorData) {
    z.string().uuid().parse(doctorId);
    const validatedData = PartialUpdateDoctorSchema.parse(doctorData);
    const response = await this.request(`/doctors/${doctorId}`, {
      method: "PATCH",
      body: JSON.stringify(validatedData),
    });
    return DoctorResponseSchema.parse(response);
  }

  // Delete doctor
  async deleteDoctor(doctorId) {
    z.string().uuid().parse(doctorId);
    await this.request(`/doctors/${doctorId}`, {
      method: "DELETE",
    });
    return { success: true };
  }

  // Get doctors by status
  async getDoctorsByStatus(status, params = {}) {
    const { page = 0, size = 20 } = params;
    const searchParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await this.request(
      `/doctors/status/${status}?${searchParams.toString()}`
    );
    return PaginatedDoctorsResponseSchema.parse(response);
  }

  // Get doctors by verification status
  async getDoctorsByVerification(isVerified, params = {}) {
    const { page = 0, size = 20 } = params;
    const searchParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await this.request(
      `/doctors/verification/${isVerified}?${searchParams.toString()}`
    );
    return PaginatedDoctorsResponseSchema.parse(response);
  }

  // Get doctors by gender
  async getDoctorsByGender(gender, params = {}) {
    const { page = 0, size = 20 } = params;
    const searchParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await this.request(
      `/doctors/gender/${gender}?${searchParams.toString()}`
    );
    return PaginatedDoctorsResponseSchema.parse(response);
  }

  // Get doctors by minimum rating
  async getDoctorsByMinRating(minRating, params = {}) {
    const { page = 0, size = 20 } = params;
    const searchParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await this.request(
      `/doctors/min-rating/${minRating}?${searchParams.toString()}`
    );
    return PaginatedDoctorsResponseSchema.parse(response);
  }

  // Get top rated doctors
  async getTopRatedDoctors(params = {}) {
    const { page = 0, size = 10 } = params;
    const searchParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await this.request(
      `/doctors/top-rated?${searchParams.toString()}`
    );
    return PaginatedDoctorsResponseSchema.parse(response);
  }

  // Activate doctor
  async activateDoctor(doctorId) {
    z.string().uuid().parse(doctorId);
    const response = await this.request(`/doctors/${doctorId}/activate`, {
      method: "POST",
    });
    return DoctorResponseSchema.parse(response);
  }

  // Deactivate doctor
  async deactivateDoctor(doctorId) {
    z.string().uuid().parse(doctorId);
    const response = await this.request(`/doctors/${doctorId}/deactivate`, {
      method: "POST",
    });
    return DoctorResponseSchema.parse(response);
  }

  // Verify doctor
  async verifyDoctor(doctorId) {
    z.string().uuid().parse(doctorId);
    const response = await this.request(`/doctors/${doctorId}/verify`, {
      method: "POST",
    });
    return DoctorResponseSchema.parse(response);
  }

  // Get profile completeness
  async getProfileCompleteness(doctorId) {
    z.string().uuid().parse(doctorId);
    const response = await this.request(
      `/doctors/${doctorId}/profile-completeness`
    );
    return response;
  }

  // Create batch doctors
  async createBatchDoctors(doctorsData) {
    const validatedData = z.array(CreateDoctorSchema).parse(doctorsData);
    const response = await this.request("/doctors/batch", {
      method: "POST",
      body: JSON.stringify(validatedData),
    });
    return z.array(DoctorResponseSchema).parse(response);
  }

  // Legacy method for backward compatibility
  async addADoctor(doctorData) {
    return this.createDoctor(doctorData);
  }
}

// Export singleton instance
export const doctorService = new DoctorService();
export default doctorService;

// Export legacy function for backward compatibility
export const addADoctor = async (doctorData) => {
  return doctorService.createDoctor(doctorData);
};
