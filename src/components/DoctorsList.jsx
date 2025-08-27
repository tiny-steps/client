import React, { useState, useEffect, useMemo } from 'react';
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
  const [deleteModal, setDeleteModal] = useState({ open: false, doctor: null });

  // Client-side search state
  const [searchInputs, setSearchInputs] = useState({
    name: '',
    speciality: '',
    minExperience: ''
  });

  // Fetch ALL doctors (no server-side filtering) - cache them locally
  const {
    data,
    isLoading,
    error,
    refetch
  } = useGetAllDoctors({
    page: 0,
    size: 1000 // Fetch all doctors for client-side filtering
  });

  // Delete doctor mutation
  const deleteDoctorMutation = useDeleteDoctor();

  // Client-side filtering using useMemo for performance (Google-style)
  const filteredDoctors = useMemo(() => {
    const allDoctors = data?.data?.content || [];
    
    if (!searchInputs.name && !searchInputs.speciality && !searchInputs.minExperience) {
      return allDoctors;
    }

    return allDoctors.filter(doctor => {
      // Name filter (case-insensitive partial match)
      if (searchInputs.name) {
        const nameMatch = doctor.name?.toLowerCase().includes(searchInputs.name.toLowerCase());
        if (!nameMatch) return false;
      }

      // Speciality filter (case-insensitive partial match)
      if (searchInputs.speciality) {
        const specialityMatch = doctor.speciality?.toLowerCase().includes(searchInputs.speciality.toLowerCase());
        if (!specialityMatch) return false;
      }

      // Experience filter (greater than or equal)
      if (searchInputs.minExperience) {
        const minExp = parseInt(searchInputs.minExperience);
        if (doctor.experienceYears < minExp) return false;
      }

      return true;
    });
  }, [data?.data?.content, searchInputs]);

  // Client-side pagination
  const paginatedDoctors = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredDoctors.slice(startIndex, endIndex);
  }, [filteredDoctors, currentPage, pageSize]);

  // Pagination info
  const pagination = useMemo(() => ({
    currentPage,
    totalPages: Math.ceil(filteredDoctors.length / pageSize),
    totalElements: filteredDoctors.length,
    size: pageSize
  }), [filteredDoctors.length, currentPage, pageSize]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchInputs]);

  const clearSearch = () => {
    setSearchInputs({
      name: '',
      speciality: '',
      minExperience: ''
    });
    setCurrentPage(0);
  };

  const handleDeleteClick = (doctor) => {
    setDeleteModal({ open: true, doctor });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.doctor) {
      try {
        await deleteDoctorMutation.mutateAsync(deleteModal.doctor.id);
        setDeleteModal({ open: false, doctor: null });
      } catch (error) {
        console.error('Failed to delete doctor:', error);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Real-time search input handlers (instant filtering)
  const handleInputChange = (field, value) => {
    setSearchInputs(prev => ({
      ...prev,
      [field]: value
    }));
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

  const hasActiveFilters = Object.values(searchInputs).some(v => v);

  return (
    <div className="p-6 h-full w-full ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doctors List</h1>
        <Button onClick={() => navigate('/doctors/add')}>
          Add New Doctor
        </Button>
      </div>

      {/* Instant Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search Doctors (Instant Results)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Doctor Name</label>
                <Input
                  name="name"
                  placeholder="Search by name..."
                  value={searchInputs.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Speciality</label>
                <Input
                  name="speciality"
                  placeholder="e.g., Cardiology"
                  value={searchInputs.speciality}
                  onChange={(e) => handleInputChange('speciality', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Experience (Years)</label>
                <Input
                  name="minExperience"
                  type="number"
                  min="0"
                  placeholder="Minimum years"
                  value={searchInputs.minExperience}
                  onChange={(e) => handleInputChange('minExperience', e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button type="button" variant="outline" onClick={clearSearch}>
                Clear All
              </Button>
              {hasActiveFilters && (
                <div className="text-sm text-blue-600 flex items-center gap-1">
                  <span>⚡</span>
                  <span>Instant filtering active</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 flex items-center gap-2">
        <span>
          Showing {paginatedDoctors.length} of {pagination.totalElements} doctors
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
            Filtered from {data?.data?.content?.length || 0} total
          </span>
        )}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {/* Highlight search terms */}
                    {searchInputs.name ? (
                      <span dangerouslySetInnerHTML={{
                        __html: doctor.name.replace(
                          new RegExp(`(${searchInputs.name})`, 'gi'),
                          '<mark class="bg-yellow-200">$1</mark>'
                        )
                      }} />
                    ) : (
                      doctor.name
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {searchInputs.speciality ? (
                      <span dangerouslySetInnerHTML={{
                        __html: doctor.speciality.replace(
                          new RegExp(`(${searchInputs.speciality})`, 'gi'),
                          '<mark class="bg-yellow-200">$1</mark>'
                        )
                      }} />
                    ) : (
                      doctor.speciality
                    )}
                  </p>
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
                <p className="text-sm">
                  <strong>Experience:</strong> 
                  <span className={searchInputs.minExperience && doctor.experienceYears >= parseInt(searchInputs.minExperience) ? 'bg-green-100 px-1 rounded' : ''}>
                    {doctor.experienceYears} years
                  </span>
                </p>
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

      {paginatedDoctors.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            {hasActiveFilters 
              ? 'No doctors found matching your search criteria.' 
              : 'No doctors found.'
            }
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearSearch} className="mt-2">
              Clear Filters
            </Button>
          )}
        </Card>
      )}

      {/* Client-side Pagination */}
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