import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../services/patientService.js";
import { userService } from "../services/userService.js";

export const enrichedPatientKeys = {
 all: ["enriched-patients"],
 lists: () => [...enrichedPatientKeys.all, "list"],
 list: (filters) => [...enrichedPatientKeys.lists(), { filters }],
 details: () => [...enrichedPatientKeys.all, "detail"],
 detail: (id) => [...enrichedPatientKeys.details(), id],
};

// Helper function to enrich patient data with user information
const enrichPatientWithUserData = async (patient) => {
 try {
 if (patient.userId) {
 const userResponse = await userService.getUserById(patient.userId);
 const userData = userResponse.data; // Assuming the response has a data property

 return {
 ...patient,
 // Map user fields to patient fields for frontend compatibility
 firstName: userData.firstName || userData.name?.split(" ")[0] || "",
 lastName:
 userData.lastName ||
 userData.name?.split(" ").slice(1).join(" ") ||
 "",
 name:
 userData.name ||
 `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
 email: userData.email || "",
 phone: userData.phone || "",
 // Keep original patient fields
 id: patient.id,
 userId: patient.userId,
 dateOfBirth: patient.dateOfBirth,
 gender: patient.gender,
 bloodGroup: patient.bloodGroup,
 heightCm: patient.heightCm,
 weightKg: patient.weightKg,
 };
 }
 return patient;
 } catch (error) {
 console.error("Error fetching user data for patient:", error);
 // Return patient data without user enrichment if user service fails
 return {
 ...patient,
 firstName: "Unknown",
 lastName: "User",
 name: "Unknown User",
 email: "unknown@example.com",
 phone: "N/A",
 };
 }
};

// Helper function to enrich multiple patients
const enrichPatientsWithUserData = async (patients) => {
 const enrichedPatients = await Promise.all(
 patients.map((patient) => enrichPatientWithUserData(patient))
 );
 return enrichedPatients;
};

export const useGetAllEnrichedPatients = (params = {}, options = {}) => {
 return useQuery({
 queryKey: enrichedPatientKeys.list(params),
 queryFn: async () => {
 const response = await patientService.getAllPatients(params);
 const patients = response.data.content || [];
 const enrichedPatients = await enrichPatientsWithUserData(patients);

 return {
 ...response,
 data: {
 ...response.data,
 content: enrichedPatients,
 },
 };
 },
 ...options,
 });
};

export const useGetEnrichedPatientById = (id, options = {}) => {
 return useQuery({
 queryKey: enrichedPatientKeys.detail(id),
 queryFn: async () => {
 const response = await patientService.getPatientById(id);
 const patient = response.data;
 const enrichedPatient = await enrichPatientWithUserData(patient);

 return {
 ...response,
 data: enrichedPatient,
 };
 },
 enabled: !!id,
 ...options,
 });
};

// Mutations that work with enriched data
export const useCreateEnrichedPatient = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: patientService.createPatient,
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: enrichedPatientKeys.lists() });
 },
 });
};

export const useUpdateEnrichedPatient = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: ({ id, data }) => patientService.updatePatient(id, data),
 onSuccess: (data, { id }) => {
 queryClient.invalidateQueries({
 queryKey: enrichedPatientKeys.detail(id),
 });
 queryClient.invalidateQueries({ queryKey: enrichedPatientKeys.lists() });
 },
 });
};

export const useDeleteEnrichedPatient = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: patientService.deletePatient,
 onSuccess: (data, deletedId) => {
 queryClient.removeQueries({
 queryKey: enrichedPatientKeys.detail(deletedId),
 });
 queryClient.invalidateQueries({ queryKey: enrichedPatientKeys.lists() });
 },
 });
};
