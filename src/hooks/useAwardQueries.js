import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { awardService } from "../services/awardService.js";

// Hook to get all awards
export const useGetAllAwards = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["awards", "all", params],
    queryFn: () => awardService.getAllAwards(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to get award by ID
export const useGetAwardById = (awardId, options = {}) => {
  return useQuery({
    queryKey: ["awards", awardId],
    queryFn: () => awardService.getAwardById(awardId),
    enabled: !!awardId && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to get awards by doctor
export const useGetAwardsByDoctor = (doctorId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ["awards", "doctor", doctorId, params],
    queryFn: () => awardService.getAwardsByDoctor(doctorId, params),
    enabled: !!doctorId && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to create award
export const useCreateAward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, awardData }) =>
      awardService.createAward(doctorId, awardData),
    onSuccess: (data, { doctorId }) => {
      // Invalidate and refetch award queries
      queryClient.invalidateQueries({ queryKey: ["awards", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["awards", "doctor", doctorId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "detail", doctorId] });
    },
    onError: (error) => {
      console.error('Error creating award:', error);
    },
  });
};

// Hook to update award
export const useUpdateAward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ awardId, awardData }) =>
      awardService.updateAward(awardId, awardData),
    onSuccess: (data, { awardId }) => {
      // Invalidate and refetch award queries
      queryClient.invalidateQueries({ queryKey: ["awards", "all"] });
      queryClient.invalidateQueries({ queryKey: ["awards", awardId] });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      // If we have the doctorId from the response, invalidate specific doctor
      if (data && data.doctorId) {
        queryClient.invalidateQueries({ queryKey: ["doctors", "detail", data.doctorId] });
      }
    },
    onError: (error) => {
      console.error('Error updating award:', error);
    },
  });
};

// Hook to delete award
export const useDeleteAward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (awardId) => awardService.deleteAward(awardId),
    onSuccess: (data, awardId) => {
      // Invalidate and refetch award queries
      queryClient.invalidateQueries({ queryKey: ["awards", "all"] });
      queryClient.invalidateQueries({ queryKey: ["awards", awardId] });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
    },
    onError: (error) => {
      console.error('Error deleting award:', error);
    },
  });
};

// Hook to create awards batch
export const useCreateAwardsBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, awardsData }) =>
      awardService.createAwardsBatch(doctorId, awardsData),
    onSuccess: (data, { doctorId }) => {
      // Invalidate and refetch award queries
      queryClient.invalidateQueries({ queryKey: ["awards", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["awards", "doctor", doctorId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "detail", doctorId] });
    },
    onError: (error) => {
      console.error('Error creating awards batch:', error);
    },
  });
};

// Hook to delete awards by doctor
export const useDeleteAwardsByDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) => awardService.deleteAwardsByDoctor(doctorId),
    onSuccess: (data, doctorId) => {
      // Invalidate and refetch award queries
      queryClient.invalidateQueries({ queryKey: ["awards", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["awards", "doctor", doctorId],
      });
      // Invalidate doctor queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "detail", doctorId] });
    },
    onError: (error) => {
      console.error('Error deleting doctor awards:', error);
    },
  });
};

// Hook to get award count
export const useGetAwardCount = (options = {}) => {
  return useQuery({
    queryKey: ["awards", "count"],
    queryFn: () => awardService.getAwardCount(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};
