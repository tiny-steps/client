import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qualificationService } from "../services/qualificationService.js";

// Hook to get all qualifications
export const useGetAllQualifications = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["qualifications", "all", params],
    queryFn: () => qualificationService.getAllQualifications(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to get qualification by ID
export const useGetQualificationById = (qualificationId, options = {}) => {
  return useQuery({
    queryKey: ["qualifications", qualificationId],
    queryFn: () => qualificationService.getQualificationById(qualificationId),
    enabled: !!qualificationId && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to get qualifications by doctor
export const useGetQualificationsByDoctor = (
  doctorId,
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["qualifications", "doctor", doctorId, params],
    queryFn: () =>
      qualificationService.getQualificationsByDoctor(doctorId, params),
    enabled: !!doctorId && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to create qualification
export const useCreateQualification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, qualificationData }) =>
      qualificationService.createQualification(doctorId, qualificationData),
    onSuccess: (data, { doctorId }) => {
      // Invalidate and refetch qualification queries
      queryClient.invalidateQueries({ queryKey: ["qualifications", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["qualifications", "doctor", doctorId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "detail", doctorId] });
    },
    onError: (error) => {
      console.error('Error creating qualification:', error);
    },
  });
};

// Hook to update qualification
export const useUpdateQualification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ qualificationId, qualificationData }) =>
      qualificationService.updateQualification(
        qualificationId,
        qualificationData
      ),
    onSuccess: (data, { qualificationId }) => {
      // Invalidate and refetch qualification queries
      queryClient.invalidateQueries({ queryKey: ["qualifications", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["qualifications", qualificationId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      // If we have the doctorId from the response, invalidate specific doctor
      if (data && data.doctorId) {
        queryClient.invalidateQueries({ queryKey: ["doctors", "detail", data.doctorId] });
      }
    },
    onError: (error) => {
      console.error('Error updating qualification:', error);
    },
  });
};

// Hook to delete qualification
export const useDeleteQualification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qualificationId) =>
      qualificationService.deleteQualification(qualificationId),
    onSuccess: (data, qualificationId) => {
      // Invalidate and refetch qualification queries
      queryClient.invalidateQueries({ queryKey: ["qualifications", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["qualifications", qualificationId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
    },
    onError: (error) => {
      console.error('Error deleting qualification:', error);
    },
  });
};

// Hook to create qualifications batch
export const useCreateQualificationsBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, qualificationsData }) =>
      qualificationService.createQualificationsBatch(
        doctorId,
        qualificationsData
      ),
    onSuccess: (data, { doctorId }) => {
      // Invalidate and refetch qualification queries
      queryClient.invalidateQueries({ queryKey: ["qualifications", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["qualifications", "doctor", doctorId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "detail", doctorId] });
    },
    onError: (error) => {
      console.error('Error creating qualifications batch:', error);
    },
  });
};

// Hook to delete qualifications by doctor
export const useDeleteQualificationsByDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) =>
      qualificationService.deleteQualificationsByDoctor(doctorId),
    onSuccess: (data, doctorId) => {
      // Invalidate and refetch qualification queries
      queryClient.invalidateQueries({ queryKey: ["qualifications", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["qualifications", "doctor", doctorId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "detail", doctorId] });
    },
    onError: (error) => {
      console.error('Error deleting doctor qualifications:', error);
    },
  });
};

// Hook to get qualification count
export const useGetQualificationCount = (options = {}) => {
  return useQuery({
    queryKey: ["qualifications", "count"],
    queryFn: () => qualificationService.getQualificationCount(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};
