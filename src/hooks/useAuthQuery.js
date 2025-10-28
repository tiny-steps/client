import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/useAuthStore.js";
import { jwtDecode } from "jwt-decode";
import useUserStore from "../store/useUserStore.js";
import useAddressStore from "../store/useAddressStore.js";
import useBranchStore from "../store/useBranchStore.js";
import { useDoctorStore } from "../store/doctorStore.js";
import * as authService from "../services/authService.js";
import { performCompleteLogout } from "../utils/storageUtils.js";

export const authKeys = {
  all: ["auth"],
  profiles: () => [...authKeys.all, "profile"], // General key for all profiles
  profile: (userId) => [...authKeys.profiles(), userId], // Specific user profile
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();
  const { setUser } = useUserStore();
  const { mutate: loginMutation, isPending: isLoginPending } = useMutation({
    mutationFn: (formData) => authService.login(formData),
    onSuccess: (response) => {
      login();
      const token = response.data?.token;
      const decodedToken = jwtDecode(token);
      const id = decodedToken.id;
      const role = decodedToken.role;
      const email = decodedToken.email;
      setUser({ id, role, email });

      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error("Login failed:", error);

      // Clear all storage and cookies on any login error
      performCompleteLogout();

      // Clear any stale authentication state on connection errors
      if (
        error?.message?.includes("ECONNREFUSED") ||
        error?.message?.includes("NetworkError") ||
        error?.message?.includes("Failed to fetch")
      ) {
        useAuthStore.getState().clearAuthState();
        useUserStore.getState().clearUser();
      }
    },
  });

  const { mutate: logoutMutation, isPending: isLogoutPending } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all stores and storage
      useAuthStore.getState().logout();
      useUserStore.getState().clearUser();

      // Clear other stores that might have user-specific data
      const { clearAddresses } = useAddressStore.getState();
      const { clearBranches } = useBranchStore.getState();
      const { resetFilters } = useDoctorStore.getState();

      clearAddresses();
      clearBranches();
      resetFilters();

      // Clear all React Query cache
      queryClient.clear();

      // Invalidate auth-related queries
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error("Logout failed:", error);

      // Even if logout API fails, clear local state
      // This ensures user is logged out locally even if server is unreachable
      useAuthStore.getState().logout();
      useUserStore.getState().clearUser();
    },
  });

  return { loginMutation, isLoginPending, logoutMutation, isLogoutPending };
};
