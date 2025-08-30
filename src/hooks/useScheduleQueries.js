import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "../services/scheduleService.js";

// Appointment Queries
export const useGetAllAppointments = (params = {}) => {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => scheduleService.getAllAppointments(params),
  });
};

export const useGetAppointmentById = (id) => {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => scheduleService.getAppointmentById(id),
    enabled: !!id,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentData) =>
      scheduleService.createAppointment(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, appointmentData }) =>
      scheduleService.updateAppointment(id, appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => scheduleService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cancellationData }) =>
      scheduleService.cancelAppointment(id, cancellationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newDateTime }) =>
      scheduleService.rescheduleAppointment(id, newDateTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useGetAppointmentHistory = (appointmentId) => {
  return useQuery({
    queryKey: ["appointments", appointmentId, "history"],
    queryFn: () => scheduleService.getAppointmentHistory(appointmentId),
    enabled: !!appointmentId,
  });
};

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, completionData }) =>
      scheduleService.completeAppointment(id, completionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
