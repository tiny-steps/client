import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../services/doctorService.js";
import { userService } from "../services/userService.js";

export const enrichedDoctorKeys = {
 all: ["enriched-doctors"],
 lists: () => [...enrichedDoctorKeys.all, "list"],
 list: (filters) => [...enrichedDoctorKeys.lists(), { filters }],
 details: () => [...enrichedDoctorKeys.all, "detail"],
 detail: (id) => [...enrichedDoctorKeys.details(), id],
};

// Helper function to enrich doctor data with user information
const enrichDoctorWithUserData = async (doctor) => {
 try {
 if (doctor.userId) {
 const userResponse = await userService.getUserById(doctor.userId);
 const userData = userResponse.data; // Assuming the response has a data property
 
 return {
 ...doctor,
 // Map user fields to doctor fields for frontend compatibility
 firstName: userData.firstName || userData.name?.split(" ")[0] || "",
 lastName: userData.lastName || userData.name?.split(" ").slice(1).join(" ") || "",
 name: userData.name || `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
 email: userData.email || "",
 phone: userData.phone || "",
 // Keep original doctor fields
 id: doctor.id,
 userId: doctor.userId,
 speciality: doctor.speciality,
 experience: doctor.experience,
 verified: doctor.verified,
 active: doctor.active,
 };
 }
 return doctor;
 } catch (error) {
 console.error("Error fetching user data for doctor:", error);
 // Return doctor data without user enrichment if user service fails
 return {
 ...doctor,
 firstName: "Unknown",
 lastName: "Doctor",
 name: "Unknown Doctor",
 email: "unknown@example.com",
 phone: "N/A",
 };
 }
};

// Helper function to enrich multiple doctors
const enrichDoctorsWithUserData = async (doctors) => {
 const enrichedDoctors = await Promise.all(
 doctors.map((doctor) => enrichDoctorWithUserData(doctor))
 );
 return enrichedDoctors;
};

export const useGetAllEnrichedDoctors = (params = {}, options = {}) => {
 return useQuery({
 queryKey: enrichedDoctorKeys.list(params),
 queryFn: async () => {
 const response = await doctorService.getAllDoctors(params);
 const doctors = response.data.content || [];
 const enrichedDoctors = await enrichDoctorsWithUserData(doctors);
 
 return {
 ...response,
 data: {
 ...response.data,
 content: enrichedDoctors,
 },
 };
 },
 ...options,
 });
};

export const useGetEnrichedDoctorById = (id, options = {}) => {
 return useQuery({
 queryKey: enrichedDoctorKeys.detail(id),
 queryFn: async () => {
 const response = await doctorService.getDoctorById(id);
 const doctor = response.data;
 const enrichedDoctor = await enrichDoctorWithUserData(doctor);
 
 return {
 ...response,
 data: enrichedDoctor,
 };
 },
 enabled: !!id,
 ...options,
 });
};

// Mutations that work with enriched data
export const useCreateEnrichedDoctor = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: doctorService.createDoctor,
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: enrichedDoctorKeys.lists() });
 },
 });
};

export const useUpdateEnrichedDoctor = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: ({ id, data }) => doctorService.updateDoctor(id, data),
 onSuccess: (data, { id }) => {
 queryClient.invalidateQueries({ queryKey: enrichedDoctorKeys.detail(id) });
 queryClient.invalidateQueries({ queryKey: enrichedDoctorKeys.lists() });
 },
 });
};

export const useDeleteEnrichedDoctor = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: doctorService.deleteDoctor,
 onSuccess: (data, deletedId) => {
 queryClient.removeQueries({ queryKey: enrichedDoctorKeys.detail(deletedId) });
 queryClient.invalidateQueries({ queryKey: enrichedDoctorKeys.lists() });
 },
 });
};
