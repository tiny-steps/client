import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../services/doctorService.js";
import { addressService } from "../services/addressService.js";
import { useToast } from "../components/ui/toast.jsx";

// Hook for deactivating doctor from branches (Scenarios 1 & 2)
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

// Hook for activating doctor in multiple branches
export const useActivateDoctorInBranches = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: ({ doctorId, branchIds, reason, practiceRole }) =>
      doctorService.activateDoctorInBranches(
        doctorId,
        branchIds,
        reason,
        practiceRole
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctorBranchStatus"] });
      queryClient.invalidateQueries({ queryKey: ["doctorsWithBranchStatus"] });

      const { message } = data;
      success(message);
    },
    onError: (error) => {
      showError(error.message || "Failed to activate doctor in branches");
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
