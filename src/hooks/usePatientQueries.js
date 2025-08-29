import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/patientService.js';

export const patientKeys = {
 all: ['patients'],
 lists: () => [...patientKeys.all, 'list'],
 list: (filters) => [...patientKeys.lists(), { filters }],
 details: () => [...patientKeys.all, 'detail'],
 detail: (id) => [...patientKeys.details(), id],
 medicalHistory: (id) => [...patientKeys.detail(id), 'medicalHistory'],
 allergies: (id) => [...patientKeys.detail(id), 'allergies'],
 healthSummary: (id) => [...patientKeys.detail(id), 'healthSummary'],
};

export const useGetAllPatients = (params = {}, options = {}) => {
 return useQuery({
 queryKey: patientKeys.list(params),
 queryFn: () => patientService.getAllPatients(params),
 ...options,
 });
};

export const useGetPatientById = (id, options = {}) => {
 return useQuery({
 queryKey: patientKeys.detail(id),
 queryFn: () => patientService.getPatientById(id),
 enabled: !!id,
 ...options,
 });
};

export const useGetPatientMedicalHistory = (patientId, options = {}) => {
 return useQuery({
 queryKey: patientKeys.medicalHistory(patientId),
 queryFn: () => patientService.getPatientMedicalHistory(patientId),
 enabled: !!patientId,
 ...options,
 });
};

export const useGetPatientAllergies = (patientId, options = {}) => {
 return useQuery({
 queryKey: patientKeys.allergies(patientId),
 queryFn: () => patientService.getPatientAllergies(patientId),
 enabled: !!patientId,
 ...options,
 });
};

export const useGetPatientHealthSummary = (patientId, options = {}) => {
 return useQuery({
 queryKey: patientKeys.healthSummary(patientId),
 queryFn: () => patientService.getPatientHealthSummary(patientId),
 enabled: !!patientId,
 ...options,
 });
};

export const useCreatePatient = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: patientService.createPatient,
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
 },
 });
};

export const useUpdatePatient = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: ({ id, data }) => patientService.updatePatient(id, data),
 onSuccess: (data, { id }) => {
 queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
 queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
 },
 });
};

export const useDeletePatient = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: patientService.deletePatient,
 onSuccess: (data, deletedId) => {
 queryClient.removeQueries({ queryKey: patientKeys.detail(deletedId) });
 queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
 },
 });
};