import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../services/patientService.js";

export const patientKeys = {
  all: ["patients"],
  lists: () => [...patientKeys.all, "list"],
  list: (filters) => [...patientKeys.lists(), { filters }],
  details: () => [...patientKeys.all, "detail"],
  detail: (id) => [...patientKeys.details(), id],
  medicalHistory: (id) => [...patientKeys.detail(id), "medicalHistory"],
  allergies: (id) => [...patientKeys.detail(id), "allergies"],
  healthSummary: (id) => [...patientKeys.detail(id), "healthSummary"],
};

export const useGetAllPatients = (params = {}, options = {}) => {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientService.getAllPatients(params),
    ...options,
  });
};

export const useGetPatientById = (id, options = {}) => {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientService.getPatientById(id),
    enabled: !!id,
    ...options,
  });
};

export const useGetPatientMedicalHistory = (patientId, options = {}) => {
  return useQuery({
    queryKey: patientKeys.medicalHistory(patientId),
    queryFn: () => patientService.getPatientMedicalHistory(patientId),
    enabled: !!patientId,
    ...options,
  });
};

export const useGetPatientAllergies = (patientId, options = {}) => {
  return useQuery({
    queryKey: patientKeys.allergies(patientId),
    queryFn: () => patientService.getPatientAllergies(patientId),
    enabled: !!patientId,
    ...options,
  });
};

export const useGetPatientHealthSummary = (patientId, options = {}) => {
  return useQuery({
    queryKey: patientKeys.healthSummary(patientId),
    queryFn: () => patientService.getPatientHealthSummary(patientId),
    enabled: !!patientId,
    ...options,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => patientService.updatePatient(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.deletePatient,
    onSuccess: (data, deletedId) => {
      queryClient.removeQueries({ queryKey: patientKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
};

// Soft delete operations - simple global activate/deactivate
export const useActivatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.activatePatient,
    onSuccess: (data, patientId) => {
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(patientId),
      });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
    onError: (error) => {
      console.error("Error activating patient:", error);
    },
  });
};

export const useDeactivatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.deactivatePatient,
    onSuccess: (data, patientId) => {
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(patientId),
      });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deactivating patient:", error);
    },
  });
};

export const useSoftDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.softDeletePatient,
    onSuccess: (data, patientId) => {
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(patientId),
      });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
    onError: (error) => {
      console.error("Error soft deleting patient:", error);
    },
  });
};

export const useReactivatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.reactivatePatient,
    onSuccess: (data, patientId) => {
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(patientId),
      });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
    onError: (error) => {
      console.error("Error reactivating patient:", error);
    },
  });
};

// Hooks for getting patients by status
export const useGetActivePatients = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["patients", "active", params],
    queryFn: () => patientService.getActivePatientsList(),
    ...options,
  });
};

export const useGetDeletedPatients = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["patients", "deleted", params],
    queryFn: () => patientService.getDeletedPatientsList(),
    ...options,
  });
};
