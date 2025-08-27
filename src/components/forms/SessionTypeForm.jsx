import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../../services/sessionService.js';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { ConfirmModal } from '../ui/confirm-modal.jsx';

const SessionTypeForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = mode === 'edit' && id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultDurationMinutes: '30', // Default to 30 minutes to prevent 0 value
    isActive: true,
    isTelemedicineAvailable: false,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Get session type by ID for editing
  const { data: sessionTypeData, isLoading } = useQuery({
    queryKey: ['sessionTypes', id],
    queryFn: () => sessionService.getSessionTypeById(id),
    enabled: isEdit,
  });

  // Create session type mutation
  const createSessionType = useMutation({
    mutationFn: (data) => sessionService.createSessionType(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sessionTypes']);
      navigate('/sessions');
    },
    onError: (error) => {
      console.error('Create session type error:', error);
      alert('Failed to create session type: ' + error.message);
    }
  });

  // Update session type mutation
  const updateSessionType = useMutation({
    mutationFn: (data) => sessionService.updateSessionType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sessionTypes']);
      navigate('/sessions');
    },
    onError: (error) => {
      console.error('Update session type error:', error);
      alert('Failed to update session type: ' + error.message);
    }
  });

  useEffect(() => {
    if (isEdit && sessionTypeData) {
      // Backend returns SessionType directly (not wrapped)
      const sessionType = sessionTypeData;
      setFormData({
        name: sessionType.name || '',
        description: sessionType.description || '',
        defaultDurationMinutes: sessionType.defaultDurationMinutes?.toString() || '30',
        isActive: sessionType.isActive ?? true,
        isTelemedicineAvailable: sessionType.isTelemedicineAvailable ?? false,
      });
    }
  }, [isEdit, sessionTypeData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Session type name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    const duration = parseInt(formData.defaultDurationMinutes);
    if (!formData.defaultDurationMinutes || isNaN(duration) || duration <= 0) {
      newErrors.defaultDurationMinutes = 'Default duration must be a positive number greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        defaultDurationMinutes: parseInt(formData.defaultDurationMinutes),
      };

      if (isEdit) {
        await updateSessionType.mutateAsync(submitData);
      } else {
        await createSessionType.mutateAsync(submitData);
      }
    } catch (error) {
      console.error('Error saving session type:', error);
    } finally {
      setShowConfirmModal(false);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEdit ? 'Edit Session Type' : 'Create Session Type'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/sessions')}>
          Back to Sessions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Consultation, Therapy Session"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : ''}`}
                rows="3"
                placeholder="Describe this session type..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Default Duration (minutes) *</label>
              <Input
                name="defaultDurationMinutes"
                type="number"
                min="1"
                max="480"
                value={formData.defaultDurationMinutes}
                onChange={handleInputChange}
                placeholder="e.g., 30, 60"
                className={errors.defaultDurationMinutes ? 'border-red-500' : ''}
              />
              {errors.defaultDurationMinutes && <p className="text-red-500 text-xs mt-1">{errors.defaultDurationMinutes}</p>}
              <p className="text-xs text-gray-500 mt-1">Must be between 1 and 480 minutes (8 hours)</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Active</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isTelemedicineAvailable"
                  checked={formData.isTelemedicineAvailable}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Telemedicine Available</label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/sessions')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createSessionType.isPending || updateSessionType.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createSessionType.isPending || updateSessionType.isPending ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        title={isEdit ? 'Update Session Type' : 'Create Session Type'}
        description={`Are you sure you want to ${isEdit ? 'update' : 'create'} this session type?`}
        confirmText={isEdit ? 'Update' : 'Create'}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
};

export default SessionTypeForm;