import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../services/sessionService.js';

export const sessionKeys = {
  all: ['sessions'],
  lists: () => [...sessionKeys.all, 'list'],
  list: (filters) => [...sessionKeys.lists(), { filters }],
  details: () => [...sessionKeys.all, 'detail'],
  detail: (id) => [...sessionKeys.details(), id],
  types: ['sessionTypes'],
};

export const useGetAllSessions = (params = {}, options = {}) => {
  return useQuery({
    queryKey: sessionKeys.list(params),
    queryFn: () => sessionService.getAllSessions(params),
    ...options,
  });
};

export const useGetSessionById = (id, options = {}) => {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionService.getSessionById(id),
    enabled: !!id,
    ...options,
  });
};

export const useGetSessionTypes = (options = {}) => {
  return useQuery({
    queryKey: sessionKeys.types,
    queryFn: () => sessionService.getSessionTypes(),
    ...options,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sessionService.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => sessionService.updateSession(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sessionService.deleteSession,
    onSuccess: (data, deletedId) => {
      queryClient.removeQueries({ queryKey: sessionKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
};