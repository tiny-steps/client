import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '../services/scheduleService.js';

export const scheduleKeys = {
  all: ['appointments'],
  lists: () => [...scheduleKeys.all, 'list'],
  list: (filters) => [...scheduleKeys.lists(), { filters }],
  details: () => [...scheduleKeys.all, 'detail'],
  detail: (id) => [...scheduleKeys.details(), id],
  history: (id) => [...scheduleKeys.detail(id), 'history'],
};

export const useGetAllAppointments = (params = {}, options = {}) => {
  return useQuery({
    queryKey: scheduleKeys.list(params),
    queryFn: () => scheduleService.getAllAppointments(params),
    ...options,
  });
};

export const useGetAppointmentById = (id, options = {}) => {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => scheduleService.getAppointmentById(id),
    enabled: !!id,
    ...options,
  });
};

export const useGetAppointmentHistory = (appointmentId, options = {}) => {
  return useQuery({
    queryKey: scheduleKeys.history(appointmentId),
    queryFn: () => scheduleService.getAppointmentHistory(appointmentId),
    enabled: !!appointmentId,
    ...options,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => scheduleService.updateAppointment(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => scheduleService.cancelAppointment(id, reason),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newDateTime }) => scheduleService.rescheduleAppointment(id, newDateTime),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
};