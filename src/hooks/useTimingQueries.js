import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timingService } from "../services/timingService.js";

export const timingKeys = {
  all: ["timing"],
  availability: (doctorId, params) => [
    ...timingKeys.all,
    "availability",
    doctorId,
    params,
  ],
  allAvailabilities: (params) => [
    ...timingKeys.all,
    "allAvailabilities",
    params,
  ],
  timeOffs: (doctorId, params) => [
    ...timingKeys.all,
    "timeOffs",
    doctorId,
    params,
  ],
};

export const useGetDoctorAvailability = (
  doctorId,
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: timingKeys.availability(doctorId, params),
    queryFn: () => timingService.getDoctorAvailability(doctorId, params),
    enabled: !!doctorId,
    ...options,
  });
};

export const useGetAllAvailabilities = (params = {}, options = {}) => {
  return useQuery({
    queryKey: timingKeys.allAvailabilities(params),
    queryFn: () => timingService.getAllAvailabilities(params),
    ...options,
  });
};

export const useGetDoctorTimeOffs = (doctorId, params = {}, options = {}) => {
  return useQuery({
    queryKey: timingKeys.timeOffs(doctorId, params),
    queryFn: () => timingService.getDoctorTimeOffs(doctorId, params),
    enabled: !!doctorId,
    ...options,
  });
};

export const useCreateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorId, data }) =>
      timingService.createAvailability(doctorId, data),
    onSuccess: (data, { doctorId }) => {
      queryClient.invalidateQueries({
        queryKey: [...timingKeys.all, "availability", doctorId],
      });
    },
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorId, availabilityId, data }) =>
      timingService.updateAvailability(doctorId, availabilityId, data),
    onSuccess: (data, { doctorId }) => {
      queryClient.invalidateQueries({
        queryKey: [...timingKeys.all, "availability", doctorId],
      });
    },
  });
};

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorId, availabilityId }) =>
      timingService.deleteAvailability(doctorId, availabilityId),
    onSuccess: (data, { doctorId }) => {
      queryClient.invalidateQueries({
        queryKey: [...timingKeys.all, "availability", doctorId],
      });
    },
  });
};

export const useCreateTimeOff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorId, data }) =>
      timingService.createTimeOff(doctorId, data),
    onSuccess: (data, { doctorId }) => {
      queryClient.invalidateQueries({
        queryKey: [...timingKeys.all, "timeOffs", doctorId],
      });
    },
  });
};
