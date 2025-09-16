import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionService } from "../services/sessionService.js";

// Session Queries
export const useGetAllSessions = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["sessions", params],
    queryFn: () => sessionService.getAllSessions(params),
    ...options,
  });
};

export const useGetSessionById = (id) => {
  return useQuery({
    queryKey: ["sessions", id],
    queryFn: () => sessionService.getSessionById(id),
    enabled: !!id,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionData) => sessionService.createSession(sessionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, sessionData }) =>
      sessionService.updateSession(id, sessionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => sessionService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useActivateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => sessionService.activateSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useDeactivateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => sessionService.deactivateSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

// Session Type Queries
export const useGetAllSessionTypes = (params = {}) => {
  return useQuery({
    queryKey: ["session-types", params],
    queryFn: () => sessionService.getAllSessionTypes(params),
  });
};

export const useGetSessionTypeById = (id) => {
  return useQuery({
    queryKey: ["session-types", id],
    queryFn: () => sessionService.getSessionTypeById(id),
    enabled: !!id,
  });
};

export const useCreateSessionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionTypeData) =>
      sessionService.createSessionType(sessionTypeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-types"] });
    },
  });
};

export const useUpdateSessionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, sessionTypeData }) =>
      sessionService.updateSessionType(id, sessionTypeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-types"] });
    },
  });
};

export const useDeleteSessionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => sessionService.deleteSessionType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-types"] });
    },
  });
};

export const useActivateSessionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => sessionService.activateSessionType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-types"] });
    },
  });
};

export const useDeactivateSessionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => sessionService.deactivateSessionType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-types"] });
    },
  });
};

export const useSoftDeleteSessionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => sessionService.softDeleteSessionType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-types"] });
    },
  });
};

export const useReactivateSessionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => sessionService.reactivateSessionType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-types"] });
    },
  });
};
