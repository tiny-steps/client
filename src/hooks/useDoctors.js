import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../service/doctorService.js";

// Query keys for cache management
export const doctorKeys = {
  all: ["doctors"],
  lists: () => [...doctorKeys.all, "list"],
  list: (filters) => [...doctorKeys.lists(), { filters }],
  details: () => [...doctorKeys.all, "detail"],
  detail: (id) => [...doctorKeys.details(), id],
  search: (params) => [...doctorKeys.all, "search", { params }],
  byStatus: (status, params) => [...doctorKeys.all, "status", status, { params }],
  byVerification: (isVerified, params) => [...doctorKeys.all, "verification", isVerified, { params }],
  byGender: (gender, params) => [...doctorKeys.all, "gender", gender, { params }],
  byMinRating: (minRating, params) => [...doctorKeys.all, "minRating", minRating, { params }],
  topRated: (params) => [...doctorKeys.all, "topRated", { params }],
  profileCompleteness: (id) => [...doctorKeys.all, "profileCompleteness", id],
};

// Hook for getting all doctors with pagination
export const useGetAllDoctors = (params = {}) => {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => doctorService.getAllDoctors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });
};

// Hook for getting a single doctor by ID
export const useGetDoctorById = (doctorId, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.detail(doctorId),
    queryFn: () => doctorService.getDoctorById(doctorId),
    enabled: !!doctorId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Hook for searching doctors
export const useSearchDoctors = (searchParams = {}, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.search(searchParams),
    queryFn: () => doctorService.searchDoctors(searchParams),
    enabled: Object.keys(searchParams).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
    ...options,
  });
};

// Hook for getting doctors by status
export const useGetDoctorsByStatus = (status, params = {}, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.byStatus(status, params),
    queryFn: () => doctorService.getDoctorsByStatus(status, params),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    ...options,
  });
};

// Hook for getting doctors by verification status
export const useGetDoctorsByVerification = (isVerified, params = {}, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.byVerification(isVerified, params),
    queryFn: () => doctorService.getDoctorsByVerification(isVerified, params),
    enabled: typeof isVerified === "boolean",
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    ...options,
  });
};

// Hook for getting doctors by gender
export const useGetDoctorsByGender = (gender, params = {}, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.byGender(gender, params),
    queryFn: () => doctorService.getDoctorsByGender(gender, params),
    enabled: !!gender,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    ...options,
  });
};

// Hook for getting doctors by minimum rating
export const useGetDoctorsByMinRating = (minRating, params = {}, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.byMinRating(minRating, params),
    queryFn: () => doctorService.getDoctorsByMinRating(minRating, params),
    enabled: typeof minRating === "number",
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    ...options,
  });
};

// Hook for getting top rated doctors
export const useGetTopRatedDoctors = (params = {}, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.topRated(params),
    queryFn: () => doctorService.getTopRatedDoctors(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true,
    ...options,
  });
};

// Hook for getting profile completeness
export const useGetProfileCompleteness = (doctorId, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.profileCompleteness(doctorId),
    queryFn: () => doctorService.getProfileCompleteness(doctorId),
    enabled: !!doctorId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Mutation hook for creating a doctor
export const useCreateDoctor = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorData) => doctorService.createDoctor(doctorData),
    onSuccess: (data) => {
      // Invalidate and refetch doctor lists
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      options.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Failed to create doctor:", error);
      options.onError?.(error);
    },
    ...options,
  });
};

// Mutation hook for updating a doctor
export const useUpdateDoctor = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, doctorData }) => doctorService.updateDoctor(doctorId, doctorData),
    onSuccess: (data, variables) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(doctorKeys.detail(variables.doctorId), data);
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      console.error("Failed to update doctor:", error);
      options.onError?.(error);
    },
    ...options,
  });
};

// Mutation hook for partial update of a doctor
export const usePartialUpdateDoctor = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, doctorData }) => doctorService.partialUpdateDoctor(doctorId, doctorData),
    onSuccess: (data, variables) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(doctorKeys.detail(variables.doctorId), data);
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      console.error("Failed to partially update doctor:", error);
      options.onError?.(error);
    },
    ...options,
  });
};

// Mutation hook for deleting a doctor
export const useDeleteDoctor = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) => doctorService.deleteDoctor(doctorId),
    onSuccess: (data, doctorId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: doctorKeys.detail(doctorId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      options.onSuccess?.(data, doctorId);
    },
    onError: (error) => {
      console.error("Failed to delete doctor:", error);
      options.onError?.(error);
    },
    ...options,
  });
};

// Mutation hook for activating a doctor
export const useActivateDoctor = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) => doctorService.activateDoctor(doctorId),
    onSuccess: (data, doctorId) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(doctorKeys.detail(doctorId), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      options.onSuccess?.(data, doctorId);
    },
    onError: (error) => {
      console.error("Failed to activate doctor:", error);
      options.onError?.(error);
    },
    ...options,
  });
};

// Mutation hook for deactivating a doctor
export const useDeactivateDoctor = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) => doctorService.deactivateDoctor(doctorId),
    onSuccess: (data, doctorId) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(doctorKeys.detail(doctorId), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      options.onSuccess?.(data, doctorId);
    },
    onError: (error) => {
      console.error("Failed to deactivate doctor:", error);
      options.onError?.(error);
    },
    ...options,
  });
};

// Mutation hook for verifying a doctor
export const useVerifyDoctor = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) => doctorService.verifyDoctor(doctorId),
    onSuccess: (data, doctorId) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(doctorKeys.detail(doctorId), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      options.onSuccess?.(data, doctorId);
    },
    onError: (error) => {
      console.error("Failed to verify doctor:", error);
      options.onError?.(error);
    },
    ...options,
  });
};

// Mutation hook for batch creating doctors
export const useCreateBatchDoctors = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorsData) => doctorService.createBatchDoctors(doctorsData),
    onSuccess: (data) => {
      // Invalidate all doctor lists
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      options.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Failed to create batch doctors:", error);
      options.onError?.(error);
    },
    ...options,
  });
};
