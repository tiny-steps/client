import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGetAllDoctors, useDeleteDoctor } from '../hooks/useDoctorQueries.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { ConfirmModal } from './ui/confirm-modal.jsx';

const DoctorsList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, doctor: null });

  // Fetch doctors with current filters
  const {
    data,
    isLoading,
    error,
    refetch
  } = useGetAllDoctors({
    page: currentPage,
    size: pageSize,
    ...searchParams
  });

  // Delete doctor mutation
  const deleteDoctorMutation = useDeleteDoctor();

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSearchParams = {};

    if (formData.get('name')) {
      newSearchParams.name = formData.get('name');
    }
    if (formData.get('speciality')) {
      newSearchParams.speciality = formData.get('speciality');
    }
    if (formData.get('minExperience')) {
      newSearchParams.minExperience = parseInt(formData.get('minExperience'));
    }

    setSearchParams(newSearchParams);
    setCurrentPage(0); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchParams({});
    setCurrentPage(0);
  };

  const handleDeleteClick = (doctor) => {
    setDeleteModal({ open: true, doctor });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.doctor) {
      try {
        await deleteDoctorMutation.mutateAsync(deleteModal.doctor.id);
        // The list will automatically refresh due to cache invalidation in the hook
      } catch (error) {
        console.error('Failed to delete doctor:', error);
        // You might want to show a toast notification here
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading doctors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Doctors</h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="destructive">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const doctors = data?.data?.content || [];
  const pagination = {
    currentPage: data?.data?.number || 0,
    totalPages: data?.data?.totalPages || 0,
    totalElements: data?.data?.totalElements || 0,
    size: data?.data?.size || pageSize
  };

  return (
    <div className="p-6 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doctors List</h1>
        <Button onClick={() => navigate('/doctors/add')}>
          Add New Doctor
        </Button>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Doctor Name</label>
                <Input
                  name="name"
                  placeholder="Search by name..."
                  defaultValue={searchParams.name || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Speciality</label>
                <Input
                  name="speciality"
                  placeholder="e.g., Cardiology"
                  defaultValue={searchParams.speciality || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Experience (Years)</label>
                <Input
                  name="minExperience"
                  type="number"
                  min="0"
                  placeholder="Minimum years"
                  defaultValue={searchParams.minExperience || ''}
                />
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
        Showing {doctors.length} of {pagination.totalElements} doctors
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{doctor.speciality}</p>
                </div>
                {doctor.imageUrl && (
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>Email:</strong> {doctor.email}</p>
                <p className="text-sm"><strong>Phone:</strong> {doctor.phone}</p>
                <p className="text-sm"><strong>Experience:</strong> {doctor.experienceYears} years</p>
                <p className="text-sm"><strong>Gender:</strong> {doctor.gender}</p>
                {doctor.summary && (
                  <p className="text-sm text-gray-600 mt-2">{doctor.summary}</p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/doctors/${doctor.id}`)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(doctor)}
                  disabled={deleteDoctorMutation.isPending}
                >
                  {deleteDoctorMutation.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {doctors.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No doctors found matching your criteria.</p>
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
        onOpenChange={(open) => setDeleteModal({ open, doctor: null })}
        title="Delete Doctor"
        description={`Are you sure you want to delete ${deleteModal.doctor?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default DoctorsList;
