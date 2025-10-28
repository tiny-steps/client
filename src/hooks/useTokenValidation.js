import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService.js";
import useAuthStore from "../store/useAuthStore.js";
import useUserStore from "../store/useUserStore.js";
import { performCompleteLogout } from "../utils/storageUtils.js";

export const useTokenValidation = () => {
  const { isAuthenticated, setTokenValidating, clearAuthState } =
    useAuthStore();
  const { clearUser } = useUserStore();

  const {
    data: validationResult,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["token-validation"],
    queryFn: () => authService.validateToken(),
    enabled: isAuthenticated, // Only run when user appears to be authenticated
    retry: (failureCount, error) => {
      // Don't retry on connection errors - clear auth state instead
      if (
        error?.message?.includes("ECONNREFUSED") ||
        error?.message?.includes("NetworkError") ||
        error?.message?.includes("Failed to fetch")
      ) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (isAuthenticated) {
      setTokenValidating(isLoading);
    }
  }, [isAuthenticated, isLoading, setTokenValidating]);

  useEffect(() => {
    if (error && isAuthenticated) {
      console.error("Token validation failed:", error);

      // Clear all storage and cookies when authentication fails
      performCompleteLogout();

      // Clear authentication state on validation failure
      clearAuthState();
      clearUser();
    }
  }, [error, isAuthenticated, clearAuthState, clearUser]);

  return {
    isTokenValid: !!validationResult,
    isTokenValidating: isLoading,
    validationError: error,
    refetchToken: refetch,
  };
};
