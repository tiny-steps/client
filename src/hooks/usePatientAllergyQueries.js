import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientAllergyService } from "../services/patientAllergyService.js";

// Get all patient allergies
export const useGetAllPatientAllergies = (params = {}) => {
  return useQuery({
    queryKey: ["patient-allergies", params],
    queryFn: () => patientAllergyService.getAllPatientAllergies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get patient allergy by ID
export const useGetPatientAllergyById = (id, options = {}) => {
  return useQuery({
    queryKey: ["patient-allergy", id],
    queryFn: () => patientAllergyService.getPatientAllergyById(id),
    enabled: !!id && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get allergies by patient ID
export const useGetAllergiesByPatientId = (patientId, params = {}) => {
  return useQuery({
    queryKey: ["patient-allergies", "patient", patientId, params],
    queryFn: () =>
      patientAllergyService.getAllergiesByPatientId(patientId, params),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create patient allergy
export const useCreatePatientAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => patientAllergyService.createPatientAllergy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-allergies"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

// Update patient allergy
export const useUpdatePatientAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      patientAllergyService.updatePatientAllergy(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patient-allergies"] });
      queryClient.invalidateQueries({
        queryKey: ["patient-allergy", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

// Delete patient allergy
export const useDeletePatientAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => patientAllergyService.deletePatientAllergy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-allergies"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

// Search allergies by allergen
export const useSearchAllergiesByAllergen = (allergen, params = {}) => {
  return useQuery({
    queryKey: ["patient-allergies", "search", "allergen", allergen, params],
    queryFn: () =>
      patientAllergyService.searchAllergiesByAllergen(allergen, params),
    enabled: !!allergen,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Check if patient has specific allergy
export const useCheckPatientAllergy = (patientId, allergen) => {
  return useQuery({
    queryKey: ["patient-allergy", "check", patientId, allergen],
    queryFn: () =>
      patientAllergyService.checkPatientAllergy(patientId, allergen),
    enabled: !!patientId && !!allergen,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
