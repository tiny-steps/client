import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService.js";
import { authService } from "../services/authService.js";

// Hook to get user by ID
export const useGetUserById = (userId, options = {}) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to get current user
export const useGetCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }) =>
      userService.updateUser(userId, userData),
    onSuccess: (data, { userId }) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
};

// Hook to delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      // Auth service handles both auth and user service deletion
      await authService.deleteUserFromAuth(userId);
      return { userId };
    },
    onSuccess: (data, userId) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
};
