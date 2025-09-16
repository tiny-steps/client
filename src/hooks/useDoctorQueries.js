import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../services/doctorService.js";

// Query keys for consistent cache management
export const doctorKeys = {
  all: ["doctors"],
  lists: () => [...doctorKeys.all, "list"],
  list: (filters) => [...doctorKeys.lists(), { filters }],
  details: () => [...doctorKeys.all, "detail"],
  detail: (id) => [...doctorKeys.details(), id],
  branches: () => [...doctorKeys.all, "branches"],
  doctorBranches: (id) => [...doctorKeys.branches(), id],
};

// Get all doctors with pagination and filters
export const useGetAllDoctors = (params = {}, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => doctorService.getAllDoctors(params),
    ...options,
  });
};

// Get single doctor by ID
export const useGetDoctorById = (id, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => doctorService.getDoctorById(id),
    enabled: !!id,
    ...options,
  });
};

// Search doctors
export const useSearchDoctors = (searchParams, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.list(searchParams),
    queryFn: () => doctorService.searchDoctors(searchParams),
    enabled: Object.keys(searchParams).length > 0,
    ...options,
  });
};

// Get verified doctors
export const useGetVerifiedDoctors = (params = {}, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.list({ ...params, verified: true }),
    queryFn: () => doctorService.getVerifiedDoctors(params),
    ...options,
  });
};

// Create doctor mutation
export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: doctorService.createDoctor,
    onSuccess: () => {
      // Invalidate and refetch all doctor lists
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error creating doctor:", error);
    },
  });
};

// Update doctor mutation
export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => doctorService.updateDoctor(id, data),
    onSuccess: (data, { id }) => {
      // Invalidate specific doctor detail
      queryClient.invalidateQueries({ queryKey: doctorKeys.detail(id) });
      // Invalidate all doctor lists to refresh the data
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error updating doctor:", error);
    },
  });
};

// Delete doctor mutation
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: doctorService.deleteDoctor,
    onSuccess: (data, deletedId) => {
      // Remove the deleted doctor from cache
      queryClient.removeQueries({ queryKey: doctorKeys.detail(deletedId) });
      // Invalidate all doctor lists to refresh the data
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting doctor:", error);
    },
  });
};

// Activate doctor mutation
export const useActivateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => doctorService.activateDoctor(id),
    onSuccess: (data, id) => {
      // Invalidate specific doctor detail
      queryClient.invalidateQueries({ queryKey: doctorKeys.detail(id) });
      // Invalidate all doctor lists to refresh the data
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error activating doctor:", error);
    },
  });
};

// Deactivate doctor mutation
export const useDeactivateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => doctorService.deactivateDoctor(id),
    onSuccess: (data, id) => {
      // Invalidate specific doctor detail
      queryClient.invalidateQueries({ queryKey: doctorKeys.detail(id) });
      // Invalidate all doctor lists to refresh the data
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deactivating doctor:", error);
    },
  });
};

// Branch Management Hooks

// Get doctor's branches
export const useGetDoctorBranches = (doctorId, options = {}) => {
  return useQuery({
    queryKey: doctorKeys.doctorBranches(doctorId),
    queryFn: () => doctorService.getDoctorBranches(doctorId),
    enabled: !!doctorId,
    ...options,
  });
};

// Add doctor to branch mutation
export const useAddDoctorToBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, branchId, role }) =>
      doctorService.addDoctorToBranch(doctorId, branchId, role),
    onSuccess: (data, variables) => {
      // Invalidate doctor branches and lists
      queryClient.invalidateQueries({
        queryKey: doctorKeys.doctorBranches(variables.doctorId),
      });
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error adding doctor to branch:", error);
    },
  });
};

// Transfer doctor between branches mutation
export const useTransferDoctorBetweenBranches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, sourceBranchId, targetBranchId }) =>
      doctorService.transferDoctorBetweenBranches(
        doctorId,
        sourceBranchId,
        targetBranchId
      ),
    onSuccess: (data, variables) => {
      // Invalidate doctor branches and lists
      queryClient.invalidateQueries({
        queryKey: doctorKeys.doctorBranches(variables.doctorId),
      });
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error transferring doctor:", error);
    },
  });
};

// Remove doctor from branch mutation
export const useRemoveDoctorFromBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, branchId }) =>
      doctorService.removeDoctorFromBranch(doctorId, branchId),
    onSuccess: (data, variables) => {
      // Invalidate doctor branches and lists
      queryClient.invalidateQueries({
        queryKey: doctorKeys.doctorBranches(variables.doctorId),
      });
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error removing doctor from branch:", error);
    },
  });
};

// Get user's accessible branch IDs
export const useGetUserAccessibleBranchIds = (userId, options = {}) => {
  return useQuery({
    queryKey: ["user", "accessible-branches", userId],
    queryFn: () => doctorService.getUserAccessibleBranchIds(userId),
    enabled: !!userId,
    ...options,
  });
};
