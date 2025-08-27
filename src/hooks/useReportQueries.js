import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '../services/reportService.js';

export const reportKeys = {
  all: ['reports'],
  lists: () => [...reportKeys.all, 'list'],
  list: (filters) => [...reportKeys.lists(), { filters }],
  details: () => [...reportKeys.all, 'detail'],
  detail: (id) => [...reportKeys.details(), id],
};

export const useGetAllReports = (params = {}, options = {}) => {
  return useQuery({
    queryKey: reportKeys.list(params),
    queryFn: () => reportService.getAllReports(params),
    ...options,
  });
};

export const useGetReportById = (id, options = {}) => {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => reportService.getReportById(id),
    enabled: !!id,
    ...options,
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportService.generateReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportService.deleteReport,
    onSuccess: (data, deletedId) => {
      queryClient.removeQueries({ queryKey: reportKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: reportService.downloadReport,
  });
};