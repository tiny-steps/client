import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../services/doctorService.js";
import { useToast } from "@/components/ui/toast.jsx";
import { addressService } from "@/services/addressService.js";

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
    onSuccess: (data, { doctorId }) => {
      // Invalidate doctor branches to refresh the data
      queryClient.invalidateQueries({
        queryKey: doctorKeys.doctorBranches(doctorId),
      });
      // Invalidate all doctor lists to refresh the data
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error removing doctor from branch:", error);
    },
  });
};

// Remove doctor address mutation (soft delete)
export const useRemoveDoctorAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, addressId, practiceRole }) =>
      doctorService.removeDoctorAddress(doctorId, addressId, practiceRole),
    onSuccess: (data, { doctorId }) => {
      // Invalidate doctor branches to refresh the data
      queryClient.invalidateQueries({
        queryKey: doctorKeys.doctorBranches(doctorId),
      });
      // Invalidate all doctor lists to refresh the data
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error removing doctor address:", error);
    },
  });
};

// Activate doctor address mutation
export const useActivateDoctorAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, addressId, practiceRole }) =>
      doctorService.activateDoctorAddress(doctorId, addressId, practiceRole),
    onSuccess: (data, { doctorId }) => {
      // Invalidate doctor branches to refresh the data
      queryClient.invalidateQueries({
        queryKey: doctorKeys.doctorBranches(doctorId),
      });
      // Invalidate all doctor lists to refresh the data
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error("Error activating doctor address:", error);
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

export const useDeactivateDoctorFromBranches = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: ({ doctorId, branchIds, forceGlobalDeactivation = false }) =>
      doctorService.deactivateDoctorFromBranches(
        doctorId,
        branchIds,
        forceGlobalDeactivation
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctorBranchStatus"] });
      queryClient.invalidateQueries({ queryKey: ["doctorsWithBranchStatus"] });

      const { scenario, message } = data;
      success(`${message} (${scenario})`);
    },
    onError: (error) => {
      showError(error.message || "Failed to deactivate doctor");
    },
  });
};

// Hook for activating doctor in branch (Scenario 3)
export const useActivateDoctorInBranch = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: ({ doctorId, branchId }) =>
      doctorService.activateDoctorInBranch(doctorId, branchId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctorBranchStatus"] });
      queryClient.invalidateQueries({ queryKey: ["doctorsWithBranchStatus"] });

      const { message } = data;
      success(message);
    },
    onError: (error) => {
      showError(error.message || "Failed to activate doctor");
    },
  });
};

// Hook for getting doctors with branch status (includes both active and inactive)
export const useGetDoctorsWithBranchStatus = (
  branchId,
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["doctorsWithBranchStatus", branchId, params],
    queryFn: () => doctorService.getDoctorsWithBranchStatus(branchId, params),
    enabled: !!branchId && options.enabled !== false,
    ...options,
  });
};

// Hook for getting doctor branch status
export const useGetDoctorBranchStatus = (doctorId, branchId, options = {}) => {
  return useQuery({
    queryKey: ["doctorBranchStatus", doctorId, branchId],
    queryFn: () => doctorService.getDoctorBranchStatus(doctorId, branchId),
    enabled: !!doctorId && !!branchId && options.enabled !== false,
    ...options,
  });
};

// Hook for getting doctor active branches
export const useGetDoctorActiveBranches = (doctorId, options = {}) => {
  return useQuery({
    queryKey: ["doctorActiveBranches", doctorId],
    queryFn: async () => {
      const response = await doctorService.getDoctorActiveBranches(doctorId);
      const branchIds = response.data || [];

      // Fetch address details for each branch ID
      const branchDetailsPromises = branchIds.map(async (branchId) => {
        try {
          const addressData = await addressService.getAddressById(branchId);
          return {
            id: branchId,
            name:
              addressData.name ||
              addressData.metadata?.branchName ||
              `${addressData.city}, ${addressData.state}` ||
              `Branch ${branchId.toString().slice(0, 8)}`,
            city: addressData.city || "Unknown",
            state: addressData.state || "Unknown",
            type: addressData.type || "",
          };
        } catch (error) {
          console.warn(
            `Failed to fetch details for branch ${branchId}:`,
            error
          );
          return {
            id: branchId,
            name: `Branch ${branchId.toString().slice(0, 8)}`,
            city: "Unknown",
            state: "Unknown",
          };
        }
      });

      const activeBranches = await Promise.all(branchDetailsPromises);
      return { activeBranches };
    },
    enabled: !!doctorId && options.enabled !== false,
    ...options,
  });
};

// Hook for bulk deactivation
export const useBulkDeactivateDoctorsFromBranches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (operations) =>
      doctorService.bulkDeactivateDoctorsFromBranches(operations),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctorBranchStatus"] });
      queryClient.invalidateQueries({ queryKey: ["doctorsWithBranchStatus"] });

      console.log(
        `Bulk operation completed: ${
          data.results?.length || 0
        } doctors processed`
      );
    },
    onError: (error) => {
      console.error(
        "Failed to perform bulk operation:",
        error.message || "Unknown error"
      );
    },
  });
};
