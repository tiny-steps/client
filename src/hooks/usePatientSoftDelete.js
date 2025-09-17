import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../services/patientService.js";
import { useToast } from "../components/ui/toast.jsx";

// Simple patient soft delete hooks - global activate/deactivate only
// This is a simplified version compared to the doctor service which has branch-specific logic

// Hook for activating patient globally
export const useActivatePatientGlobal = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: (patientId) => patientService.activatePatient(patientId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["enriched-patients"] });

      success("Patient activated successfully");
    },
    onError: (error) => {
      showError(error.message || "Failed to activate patient");
    },
  });
};

// Hook for deactivating patient globally
export const useDeactivatePatientGlobal = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: (patientId) => patientService.deactivatePatient(patientId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["enriched-patients"] });

      success("Patient deactivated successfully");
    },
    onError: (error) => {
      showError(error.message || "Failed to deactivate patient");
    },
  });
};

// Hook for soft deleting patient
export const useSoftDeletePatientGlobal = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: (patientId) => patientService.softDeletePatient(patientId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["enriched-patients"] });

      success("Patient soft deleted successfully");
    },
    onError: (error) => {
      showError(error.message || "Failed to soft delete patient");
    },
  });
};

// Hook for reactivating deleted patient
export const useReactivatePatientGlobal = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: (patientId) => patientService.reactivatePatient(patientId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["enriched-patients"] });

      success("Patient reactivated successfully");
    },
    onError: (error) => {
      showError(error.message || "Failed to reactivate patient");
    },
  });
};

// Hook for getting active patients
export const useGetActivePatientsList = (options = {}) => {
  return useQuery({
    queryKey: ["patients", "active"],
    queryFn: () => patientService.getActivePatientsList(),
    ...options,
  });
};

// Hook for getting deleted patients
export const useGetDeletedPatientsList = (options = {}) => {
  return useQuery({
    queryKey: ["patients", "deleted"],
    queryFn: () => patientService.getDeletedPatientsList(),
    ...options,
  });
};
