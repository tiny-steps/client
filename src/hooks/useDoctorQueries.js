import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '../services/doctorService.js';

// Query keys for consistent cache management
export const doctorKeys = {
  all: ['doctors'],
  lists: () => [...doctorKeys.all, 'list'],
  list: (filters) => [...doctorKeys.lists(), { filters }],
  details: () => [...doctorKeys.all, 'detail'],
  detail: (id) => [...doctorKeys.details(), id],
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
      console.error('Error creating doctor:', error);
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
      console.error('Error updating doctor:', error);
    },
  });
};

// Delete doctor mutation
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: doctorService.deleteDoctor,
    onSuccess: (data, deletedId) => {
      // Remove the deleted doctor from cache
      queryClient.removeQueries({ queryKey: doctorKeys.detail(deletedId) });
      // Invalidate all doctor lists to refresh the data
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error) => {
      console.error('Error deleting doctor:', error);
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
      console.error('Error activating doctor:', error);
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
      console.error('Error deactivating doctor:', error);
    },
  });
};
