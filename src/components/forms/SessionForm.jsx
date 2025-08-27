import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../../services/sessionService.js';
import { useGetAllDoctors } from '../../hooks/useDoctorQueries.js';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.jsx';
import { Label } from '../ui/label.jsx';
import { ConfirmModal } from '../ui/confirm-modal.jsx';

const SessionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [updateModal, setUpdateModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      sessionTypeId: '',
      doctorId: '',
      practiceId: '',
      price: '',
      isActive: true
    }
  });

  // Fetch session data if editing
  const {
    data: sessionData,
    isLoading,
    error: fetchError
  } = useQuery({
    queryKey: ['sessions', id],
    queryFn: () => sessionService.getSessionById(id),
    enabled: isEdit,
  });

  // Fetch session types for dropdown
  const { data: sessionTypesData } = useQuery({
    queryKey: ['sessionTypes'],
    queryFn: () => sessionService.getSessionTypes({ size: 100 }),
  });

  // Fetch doctors for dropdown
  const { data: doctorsData } = useGetAllDoctors({ size: 100 });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: (data) => sessionService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sessions']);
      navigate('/sessions');
    },
    onError: (error) => {
      console.error('Create session error:', error);
      alert('Failed to create session: ' + (error.response?.data?.message || error.message));
    }
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: (data) => sessionService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sessions']);
      navigate('/sessions');
    },
    onError: (error) => {
      console.error('Update session error:', error);
      alert('Failed to update session: ' + (error.response?.data?.message || error.message));
    }
  });

  // Populate form when editing
  useEffect(() => {
    if (isEdit && sessionData) {
      setValue('sessionTypeId', sessionData.sessionTypeId || '');
      setValue('doctorId', sessionData.doctorId || '');
      setValue('practiceId', sessionData.practiceId || '');
      setValue('price', sessionData.price || '');
      setValue('isActive', sessionData.isActive ?? true);
    }
  }, [sessionData, isEdit, setValue]);

  const onSubmit = async (data) => {
    // Transform data to match backend DTO expectations
    const submitData = {
      sessionTypeId: data.sessionTypeId,
      doctorId: data.doctorId,
      practiceId: data.practiceId || null, // Send null if empty
      price: parseFloat(data.price),
      isActive: data.isActive
    };

    if (isEdit) {
      // Show confirmation modal for updates
      setFormData(submitData);
      setUpdateModal(true);
    } else {
      // Direct create for new sessions
      try {
        await createSessionMutation.mutateAsync(submitData);
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    }
  };

  const handleUpdateConfirm = async () => {
    if (formData && id) {
      try {
        await updateSessionMutation.mutateAsync(formData);
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    }
    setUpdateModal(false);
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading session data...</span>
      </div>
    );
  }

  if (isEdit && fetchError) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Session</h3>
          <p className="text-red-600 mb-4">{fetchError.message}</p>
          <Button onClick={() => navigate('/sessions')} variant="outline">
            Back to Sessions List
          </Button>
        </Card>
      </div>
    );
  }

  const sessionTypes = sessionTypesData?.content || [];
  const doctors = doctorsData?.data?.content || [];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEdit ? 'Edit Session Offering' : 'Add New Session Offering'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/sessions')}>
          Back to Sessions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Offering Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionTypeId">Session Type *</Label>
                <select
                  id="sessionTypeId"
                  {...register('sessionTypeId', { required: 'Session type is required' })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Session Type</option>
                  {sessionTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                {errors.sessionTypeId && (
                  <p className="text-sm text-red-600 mt-1">{errors.sessionTypeId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="doctorId">Doctor *</Label>
                <select
                  id="doctorId"
                  {...register('doctorId', { required: 'Doctor is required' })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                  ))}
                </select>
                {errors.doctorId && (
                  <p className="text-sm text-red-600 mt-1">{errors.doctorId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0.01, message: 'Price must be greater than 0' }
                  })}
                  placeholder="Session price (e.g., 100.00)"
                />
                {errors.price && (
                  <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="practiceId">Practice ID (Optional)</Label>
                <Input
                  id="practiceId"
                  {...register('practiceId')}
                  placeholder="Leave empty if no specific practice"
                />
                <p className="text-xs text-gray-500 mt-1">Optional: Leave empty for general practice sessions</p>
                {errors.practiceId && (
                  <p className="text-sm text-red-600 mt-1">{errors.practiceId.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  {...register('isActive')}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || createSessionMutation.isPending || updateSessionMutation.isPending}
                className="flex-1"
              >
                {isSubmitting || createSessionMutation.isPending || updateSessionMutation.isPending
                  ? (isEdit ? 'Updating...' : 'Creating...')
                  : (isEdit ? 'Update Session' : 'Create Session')
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/sessions')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Update Confirmation Modal */}
      <ConfirmModal
        open={updateModal}
        onOpenChange={setUpdateModal}
        title="Update Session"
        description="Are you sure you want to update this session offering? This will modify the session details."
        confirmText="Update"
        cancelText="Cancel"
        variant="default"
        onConfirm={handleUpdateConfirm}
      />
    </div>
  );
};

export default SessionForm;