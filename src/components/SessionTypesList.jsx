import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../services/sessionService.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { ConfirmModal } from './ui/confirm-modal.jsx';

const SessionTypesList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, sessionType: null });

  // Fetch session types with current filters
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['sessionTypes', currentPage, searchParams],
    queryFn: () => sessionService.getSessionTypes({
      page: currentPage,
      size: pageSize,
      ...searchParams,
    }),
  });

  // Delete session type mutation
  const deleteSessionType = useMutation({
    mutationFn: (id) => sessionService.deleteSessionType(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['sessionTypes']);
      setDeleteModal({ open: false, sessionType: null });
    },
  });

  // Toggle active status mutation
  const toggleActiveStatus = useMutation({
    mutationFn: ({ id, isActive }) => {
      return isActive 
        ? sessionService.deactivateSessionType(id)
        : sessionService.activateSessionType(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sessionTypes']);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSearchParams = {};

    if (formData.get('name')) {
      newSearchParams.name = formData.get('name');
    }
    if (formData.get('isActive')) {
      newSearchParams.isActive = formData.get('isActive') === 'true';
    }
    if (formData.get('isTelemedicineAvailable')) {
      newSearchParams.isTelemedicineAvailable = formData.get('isTelemedicineAvailable') === 'true';
    }
    if (formData.get('minDuration')) {
      newSearchParams.minDuration = parseInt(formData.get('minDuration'));
    }
    if (formData.get('maxDuration')) {
      newSearchParams.maxDuration = parseInt(formData.get('maxDuration'));
    }

    setSearchParams(newSearchParams);
    setCurrentPage(0);
  };

  const clearSearch = () => {
    setSearchParams({});
    setCurrentPage(0);
  };

  const handleDeleteClick = (sessionType) => {
    setDeleteModal({ open: true, sessionType });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.sessionType) {
      try {
        await deleteSessionType.mutateAsync(deleteModal.sessionType.id);
      } catch (error) {
        console.error('Failed to delete session type:', error);
      }
    }
  };

  const handleToggleActive = (sessionType) => {
    toggleActiveStatus.mutate({
      id: sessionType.id,
      isActive: sessionType.isActive,
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading session types...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Session Types</h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="destructive">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Backend returns Page<SessionType> directly (not wrapped in ResponseModel)
  const sessionTypes = data?.content || [];
  const pagination = {
    currentPage: data?.number || 0,
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    size: data?.size || pageSize
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Session Types</h1>
        <Button onClick={() => navigate('/session-types/create')}>
          Add New Session Type
        </Button>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search Session Types</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  name="name"
                  placeholder="Search by name..."
                  defaultValue={searchParams.name || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="isActive"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue={searchParams.isActive?.toString() || ''}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telemedicine</label>
                <select
                  name="isTelemedicineAvailable"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue={searchParams.isTelemedicineAvailable?.toString() || ''}
                >
                  <option value="">All Types</option>
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration Range</label>
                <div className="flex gap-2">
                  <Input
                    name="minDuration"
                    type="number"
                    placeholder="Min"
                    defaultValue={searchParams.minDuration || ''}
                  />
                  <Input
                    name="maxDuration"
                    type="number"
                    placeholder="Max"
                    defaultValue={searchParams.maxDuration || ''}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Search</Button>
              <Button type="button" variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {sessionTypes.length} of {pagination.totalElements} session types
      </div>

      {/* Session Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessionTypes.map((sessionType) => (
          <Card key={sessionType.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    {sessionType.name}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(sessionType.isActive)}`}>
                      {sessionType.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {sessionType.isTelemedicineAvailable && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Telemedicine
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 line-clamp-2">{sessionType.description}</p>
                <p className="text-sm"><strong>Duration:</strong> {sessionType.defaultDuration} minutes</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/session-types/${sessionType.id}/edit`)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant={sessionType.isActive ? "outline" : "default"}
                  onClick={() => handleToggleActive(sessionType)}
                  disabled={toggleActiveStatus.isPending}
                >
                  {sessionType.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(sessionType)}
                  disabled={deleteSessionType.isPending}
                >
                  {deleteSessionType.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessionTypes.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No session types found matching your criteria.</p>
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </Button>

          <span className="flex items-center px-4 text-sm">
            Page {currentPage + 1} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pagination.totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, sessionType: null })}
        title="Delete Session Type"
        description={`Are you sure you want to delete "${deleteModal.sessionType?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default SessionTypesList;