import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  useGetAllDoctors,
  useDeleteDoctor,
  useActivateDoctor,
  useDeactivateDoctor,
} from "../../hooks/useDoctorQueries.js";
import { useDoctorStore, useDoctorActions } from "../../store/doctorStore.js";
import DoctorForm from "../../components/DoctorForm.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Card } from "../../components/ui/card.jsx";

function DoctorsPage() {
  const pageRef = useRef(null);
  const formRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  // Get store state and actions
  const { searchQuery, filters, pagination } = useDoctorStore((state) => ({
    searchQuery: state.searchQuery,
    filters: state.filters,
    pagination: state.pagination,
  }));

  const doctorActions = useDoctorActions();

  // Fetch ALL doctors without any filters - let the client handle filtering
  const {
    data: doctorsData,
    isLoading,
    error,
    refetch,
  } = useGetAllDoctors({
    page: 0,
    size: 100, // Get a large number to have all doctors for client-side filtering
  });

  // Client-side filtering using useMemo for performance
  const filteredDoctors = useMemo(() => {
    if (!doctorsData?.content) return [];

    let filtered = [...doctorsData.content];

    // Filter by search query (name)
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((doctor) =>
        doctor.name.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((doctor) => doctor.status === filters.status);
    }

    // Filter by gender
    if (filters.gender !== "all") {
      filtered = filtered.filter((doctor) => doctor.gender === filters.gender);
    }

    // Filter by verification status
    if (filters.isVerified !== "all") {
      const isVerified = filters.isVerified === "true";
      filtered = filtered.filter((doctor) => doctor.isVerified === isVerified);
    }

    // Filter by minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (doctor) => doctor.ratingAverage >= filters.minRating
      );
    }

    // Filter by speciality
    if (filters.speciality && filters.speciality.trim() !== "") {
      const speciality = filters.speciality.toLowerCase().trim();
      filtered = filtered.filter((doctor) =>
        doctor.specializations?.some((spec) =>
          spec.name?.toLowerCase().includes(speciality)
        )
      );
    }

    return filtered;
  }, [doctorsData?.content, searchQuery, filters]);

  // Implement client-side pagination
  const paginatedDoctors = useMemo(() => {
    const startIndex = pagination.page * pagination.size;
    const endIndex = startIndex + pagination.size;
    return filteredDoctors.slice(startIndex, endIndex);
  }, [filteredDoctors, pagination.page, pagination.size]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredDoctors.length / pagination.size);

  // Debug the current state
  useEffect(() => {
    console.log("🔍 Current searchQuery:", searchQuery);
    console.log("🎛️ Current filters:", filters);
    console.log("👥 All doctors:", doctorsData?.content?.length || 0);
    console.log("� Filtered doctors:", filteredDoctors.length);
    console.log("📄 Paginated doctors:", paginatedDoctors.length);
  }, [
    searchQuery,
    filters,
    doctorsData?.content,
    filteredDoctors,
    paginatedDoctors,
  ]);

  // Mutations
  const deleteDoctorMutation = useDeleteDoctor();
  const activateDoctorMutation = useActivateDoctor();
  const deactivateDoctorMutation = useDeactivateDoctor();

  useGSAP(() => {
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current,
      {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }, []);

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setShowForm(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  // Add form animation when it appears
  useGSAP(() => {
    if (showForm && formRef.current) {
      gsap.fromTo(
        formRef.current,
        {
          scale: 0,
          opacity: 0,
          transformOrigin: "center center",
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        }
      );
    }
  }, [showForm]);

  const handleDeleteDoctor = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const confirmDeleteDoctor = async () => {
    if (doctorToDelete) {
      try {
        await deleteDoctorMutation.mutateAsync(doctorToDelete.id);
        setShowDeleteModal(false);
        setDoctorToDelete(null);
      } catch (error) {
        console.error("Error deleting doctor:", error);
      }
    }
  };

  const cancelDeleteDoctor = () => {
    setShowDeleteModal(false);
    setDoctorToDelete(null);
  };

  const handleToggleStatus = async (doctor) => {
    try {
      if (doctor.status === "ACTIVE") {
        await deactivateDoctorMutation.mutateAsync(doctor.id);
      } else {
        await activateDoctorMutation.mutateAsync(doctor.id);
      }
    } catch (error) {
      console.error("Error toggling doctor status:", error);
    }
  };

  const handleFormSuccess = () => {
    // Animate form out
    if (formRef.current) {
      gsap.to(formRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          setShowForm(false);
          setEditingDoctor(null);
        },
      });
    } else {
      setShowForm(false);
      setEditingDoctor(null);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDoctor(null);
  };

  const handleSearchChange = (e) => {
    doctorActions.setSearchQuery(e.target.value);
    // Reset to first page when searching
    doctorActions.setPage(0);
  };

  const handleStatusFilter = (status) => {
    doctorActions.setFilter("status", status);
    // Reset to first page when filtering
    doctorActions.setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600";
      case "INACTIVE":
        return "text-gray-600";
      case "SUSPENDED":
        return "text-red-600";
      case "PENDING":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Available";
      case "INACTIVE":
        return "Inactive";
      case "SUSPENDED":
        return "Suspended";
      case "PENDING":
        return "Pending";
      default:
        return status;
    }
  };

  if (showForm) {
    return (
      <div ref={pageRef} className="p-6">
        <div ref={formRef}>
          <DoctorForm
            initialData={editingDoctor}
            isEdit={!!editingDoctor}
            onSubmit={async (data) => {
              // Wait for the form submission to complete
              // The form component handles the API call and cache invalidation
              // Only after that is done, we proceed with the success handling
              handleFormSuccess();
            }}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Doctors Management
              </h1>
              <p className="text-gray-600">
                Manage doctors, their schedules, and availability.
              </p>
            </div>
            <Button
              onClick={handleAddDoctor}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add New Doctor
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search doctors by name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filters.status === "all" ? "default" : "outline"}
                onClick={() => handleStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filters.status === "ACTIVE" ? "default" : "outline"}
                onClick={() => handleStatusFilter("ACTIVE")}
                size="sm"
              >
                Active
              </Button>
              <Button
                variant={filters.status === "INACTIVE" ? "default" : "outline"}
                onClick={() => handleStatusFilter("INACTIVE")}
                size="sm"
              >
                Inactive
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading doctors...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-600">
              Error loading doctors: {error.message}
            </p>
            <Button onClick={() => refetch()} className="mt-2" size="sm">
              Try Again
            </Button>
          </Card>
        )}

        {/* Doctors List */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedDoctors && paginatedDoctors.length > 0 ? (
              paginatedDoctors.map((doctor) => (
                <Card key={doctor.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {doctor.imageUrl ? (
                        <img
                          src={doctor.imageUrl}
                          alt={doctor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {doctor.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        {doctor.isVerified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {doctor.summary && (
                      <p className="text-sm text-gray-600">{doctor.summary}</p>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Experience:</span>
                      <span className="font-medium">
                        {doctor.experienceYears} years
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rating:</span>
                      <span className="font-medium">
                        {doctor.ratingAverage.toFixed(1)} ⭐ (
                        {doctor.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`font-medium ${getStatusColor(doctor.status)}`}
                      >
                        {getStatusText(doctor.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEditDoctor(doctor)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleToggleStatus(doctor)}
                      variant="outline"
                      size="sm"
                      className={
                        doctor.status === "ACTIVE"
                          ? "text-orange-600"
                          : "text-green-600"
                      }
                    >
                      {doctor.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      onClick={() => handleDeleteDoctor(doctor)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                {searchQuery ||
                filters.status !== "all" ||
                filters.gender !== "all" ? (
                  <>
                    <p className="text-gray-500 mb-4">
                      No doctors found matching your search criteria.
                    </p>
                    <Button
                      onClick={() => {
                        doctorActions.setSearchQuery("");
                        doctorActions.setFilter("status", "all");
                        doctorActions.setFilter("gender", "all");
                        doctorActions.setFilter("isVerified", "all");
                        doctorActions.setFilter("minRating", 0);
                        doctorActions.setFilter("speciality", "");
                      }}
                      variant="outline"
                      className="mr-2"
                    >
                      Clear Filters
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 mb-4">No doctors found.</p>
                  </>
                )}
                <Button onClick={handleAddDoctor}>Add New Doctor</Button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && filteredDoctors.length > pagination.size && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                onClick={() =>
                  doctorActions.setPage(Math.max(0, pagination.page - 1))
                }
                disabled={pagination.page === 0}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {pagination.page + 1} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  doctorActions.setPage(
                    Math.min(totalPages - 1, pagination.page + 1)
                  )
                }
                disabled={pagination.page >= totalPages - 1}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && !error && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {paginatedDoctors.length} of {filteredDoctors.length}{" "}
            doctors
            {filteredDoctors.length !== doctorsData?.content?.length &&
              ` (filtered from ${doctorsData?.content?.length} total)`}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Doctor
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium">{doctorToDelete?.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <Button
                onClick={cancelDeleteDoctor}
                variant="outline"
                disabled={deleteDoctorMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteDoctor}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteDoctorMutation.isPending}
              >
                {deleteDoctorMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete Doctor"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/dashboard/doctors")({
  component: DoctorsPage,
});
