import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { specializationService } from "../services/specializationService.js";

// Hook to get all specializations
export const useGetAllSpecializations = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["specializations", "all", params],
    queryFn: () => specializationService.getAllSpecializations(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to get specialization by ID
export const useGetSpecializationById = (specializationId, options = {}) => {
  return useQuery({
    queryKey: ["specializations", specializationId],
    queryFn: () =>
      specializationService.getSpecializationById(specializationId),
    enabled: !!specializationId && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to get specializations by doctor
export const useGetSpecializationsByDoctor = (
  doctorId,
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["specializations", "doctor", doctorId, params],
    queryFn: () =>
      specializationService.getSpecializationsByDoctor(doctorId, params),
    enabled: !!doctorId && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to create specialization
export const useCreateSpecialization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, specializationData }) =>
      specializationService.createSpecialization(doctorId, specializationData),
    onSuccess: (data, { doctorId }) => {
      // Invalidate and refetch specialization queries
      queryClient.invalidateQueries({ queryKey: ["specializations", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["specializations", "doctor", doctorId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["doctors", "detail", doctorId],
      });
    },
    onError: (error) => {
      console.error("Error creating specialization:", error);
    },
  });
};

// Hook to update specialization
export const useUpdateSpecialization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ specializationId, specializationData }) =>
      specializationService.updateSpecialization(
        specializationId,
        specializationData
      ),
    onSuccess: (data, { specializationId }) => {
      // Invalidate and refetch specialization queries
      queryClient.invalidateQueries({ queryKey: ["specializations", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["specializations", specializationId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      // If we have the doctorId from the response, invalidate specific doctor
      if (data && data.doctorId) {
        queryClient.invalidateQueries({
          queryKey: ["doctors", "detail", data.doctorId],
        });
      }
    },
    onError: (error) => {
      console.error("Error updating specialization:", error);
    },
  });
};

// Hook to delete specialization
export const useDeleteSpecialization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (specializationId) =>
      specializationService.deleteSpecialization(specializationId),
    onSuccess: (data, specializationId) => {
      // Invalidate and refetch specialization queries
      queryClient.invalidateQueries({ queryKey: ["specializations", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["specializations", specializationId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
    },
    onError: (error) => {
      console.error("Error deleting specialization:", error);
    },
  });
};

// Hook to create specializations batch
export const useCreateSpecializationsBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, specializationsData }) =>
      specializationService.createSpecializationsBatch(
        doctorId,
        specializationsData
      ),
    onSuccess: (data, { doctorId }) => {
      // Invalidate and refetch specialization queries
      queryClient.invalidateQueries({ queryKey: ["specializations", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["specializations", "doctor", doctorId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["doctors", "detail", doctorId],
      });
    },
    onError: (error) => {
      console.error("Error creating specializations batch:", error);
    },
  });
};

// Hook to delete specializations by doctor
export const useDeleteSpecializationsByDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) =>
      specializationService.deleteSpecializationsByDoctor(doctorId),
    onSuccess: (data, doctorId) => {
      // Invalidate and refetch specialization queries
      queryClient.invalidateQueries({ queryKey: ["specializations", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["specializations", "doctor", doctorId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["doctors", "detail", doctorId],
      });
    },
    onError: (error) => {
      console.error("Error deleting doctor specializations:", error);
    },
  });
};

// Hook to get specialization count
export const useGetSpecializationCount = (options = {}) => {
  return useQuery({
    queryKey: ["specializations", "count"],
    queryFn: () => specializationService.getSpecializationCount(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};
