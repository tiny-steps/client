import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../service/doctorService.js";

// Query keys for better cache management
export const doctorKeys = {
  all: ["doctors"],
  lists: () => [...doctorKeys.all, "list"],
  list: (filters) => [...doctorKeys.lists(), { filters }],
  details: () => [...doctorKeys.all, "detail"],
  detail: (id) => [...doctorKeys.details(), id],
  search: (params) => [...doctorKeys.all, "search", params],
  topRated: (params) => [...doctorKeys.all, "top-rated", params],
  byStatus: (status, params) => [...doctorKeys.all, "status", status, params],
  byVerification: (isVerified, params) => [
    ...doctorKeys.all,
    "verification",
    isVerified,
    params,
  ],
  byGender: (gender, params) => [...doctorKeys.all, "gender", gender, params],
  byMinRating: (minRating, params) => [
    ...doctorKeys.all,
    "min-rating",
    minRating,
    params,
  ],
  profileCompleteness: (id) => [...doctorKeys.all, "profile-completeness", id],
};

// Hook to get all doctors with pagination
export const useGetAllDoctors = (params = {}) => {
  console.log("🔍 useGetAllDoctors called with params:", params);

  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => {
      console.log("📡 Making API call to getAllDoctors with:", params);
      return doctorService.getAllDoctors(params);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    enabled: true, // Always enabled for now
  });
};

// Hook to get doctor by ID
export const useGetDoctorById = (doctorId) => {
  return useQuery({
    queryKey: doctorKeys.detail(doctorId),
    queryFn: () => doctorService.getDoctorById(doctorId),
    enabled: !!doctorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to search doctors
export const useSearchDoctors = (searchParams = {}) => {
  return useQuery({
    queryKey: doctorKeys.search(searchParams),
    queryFn: () => doctorService.searchDoctors(searchParams),
    enabled: Object.keys(searchParams).length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Hook to get top rated doctors
export const useGetTopRatedDoctors = (params = {}) => {
  return useQuery({
    queryKey: doctorKeys.topRated(params),
    queryFn: () => doctorService.getTopRatedDoctors(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook to get doctors by status
export const useGetDoctorsByStatus = (status, params = {}) => {
  return useQuery({
    queryKey: doctorKeys.byStatus(status, params),
    queryFn: () => doctorService.getDoctorsByStatus(status, params),
    enabled: !!status,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get doctors by verification status
export const useGetDoctorsByVerification = (isVerified, params = {}) => {
  return useQuery({
    queryKey: doctorKeys.byVerification(isVerified, params),
    queryFn: () => doctorService.getDoctorsByVerification(isVerified, params),
    enabled: typeof isVerified === "boolean",
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get doctors by gender
export const useGetDoctorsByGender = (gender, params = {}) => {
  return useQuery({
    queryKey: doctorKeys.byGender(gender, params),
    queryFn: () => doctorService.getDoctorsByGender(gender, params),
    enabled: !!gender,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get doctors by minimum rating
export const useGetDoctorsByMinRating = (minRating, params = {}) => {
  return useQuery({
    queryKey: doctorKeys.byMinRating(minRating, params),
    queryFn: () => doctorService.getDoctorsByMinRating(minRating, params),
    enabled: typeof minRating === "number",
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get profile completeness
export const useGetProfileCompleteness = (doctorId) => {
  return useQuery({
    queryKey: doctorKeys.profileCompleteness(doctorId),
    queryFn: () => doctorService.getProfileCompleteness(doctorId),
    enabled: !!doctorId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Mutation hooks
export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorData) => doctorService.createDoctor(doctorData),
    onSuccess: (newDoctor) => {
      // Invalidate and refetch doctors lists
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      // Add the new doctor to the cache
      queryClient.setQueryData(doctorKeys.detail(newDoctor.id), newDoctor);
    },
    onError: (error) => {
      console.error("Error creating doctor:", error);
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, doctorData }) =>
      doctorService.updateDoctor(doctorId, doctorData),
    onSuccess: (updatedDoctor, { doctorId }) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(doctorKeys.detail(doctorId), updatedDoctor);
      // Invalidate lists to ensure they're updated
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error updating doctor:", error);
    },
  });
};

export const usePartialUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, doctorData }) =>
      doctorService.partialUpdateDoctor(doctorId, doctorData),
    onSuccess: (updatedDoctor, { doctorId }) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(doctorKeys.detail(doctorId), updatedDoctor);
      // Invalidate lists to ensure they're updated
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error partially updating doctor:", error);
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) => doctorService.deleteDoctor(doctorId),
    onSuccess: (_, doctorId) => {
      // Remove the doctor from cache
      queryClient.removeQueries({ queryKey: doctorKeys.detail(doctorId) });
      // Invalidate lists to ensure they're updated
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting doctor:", error);
    },
  });
};

export const useActivateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) => doctorService.activateDoctor(doctorId),
    onSuccess: (updatedDoctor, doctorId) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(doctorKeys.detail(doctorId), updatedDoctor);
      // Invalidate lists to ensure they're updated
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error activating doctor:", error);
    },
  });
};

export const useDeactivateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) => doctorService.deactivateDoctor(doctorId),
    onSuccess: (updatedDoctor, doctorId) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(doctorKeys.detail(doctorId), updatedDoctor);
      // Invalidate lists to ensure they're updated
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deactivating doctor:", error);
    },
  });
};

export const useVerifyDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) => doctorService.verifyDoctor(doctorId),
    onSuccess: (updatedDoctor, doctorId) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(doctorKeys.detail(doctorId), updatedDoctor);
      // Invalidate lists to ensure they're updated
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error verifying doctor:", error);
    },
  });
};

export const useCreateBatchDoctors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorsData) => doctorService.createBatchDoctors(doctorsData),
    onSuccess: () => {
      // Invalidate all doctor lists to ensure they're updated
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error creating batch doctors:", error);
    },
  });
};

// Utility hook for prefetching doctor data
export const usePrefetchDoctor = () => {
  const queryClient = useQueryClient();

  return (doctorId) => {
    queryClient.prefetchQuery({
      queryKey: doctorKeys.detail(doctorId),
      queryFn: () => doctorService.getDoctorById(doctorId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
};

// Hook for invalidating all doctor queries
export const useInvalidateDoctorQueries = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: doctorKeys.all });
  };
};
