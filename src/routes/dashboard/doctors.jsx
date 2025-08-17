import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
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
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // Get store state and actions
  const { searchQuery, filters, pagination } = useDoctorStore((state) => ({
    searchQuery: state.searchQuery,
    filters: state.filters,
    pagination: state.pagination,
  }));

  const doctorActions = useDoctorActions();

  // Query params for API call
  const queryParams = {
    page: pagination.page,
    size: pagination.size,
    sort: pagination.sort,
    ...(searchQuery && { name: searchQuery }),
    ...(filters.status !== "all" && { status: filters.status }),
    ...(filters.gender !== "all" && { gender: filters.gender }),
    ...(filters.isVerified !== "all" && {
      isVerified: filters.isVerified === "true",
    }),
    ...(filters.minRating > 0 && { minRating: filters.minRating }),
    ...(filters.speciality && { speciality: filters.speciality }),
  };

  // Fetch doctors data
  const {
    data: doctorsData,
    isLoading,
    error,
    refetch,
  } = useGetAllDoctors(queryParams);

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

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await deleteDoctorMutation.mutateAsync(doctorId);
      } catch (error) {
        console.error("Error deleting doctor:", error);
      }
    }
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
    setShowForm(false);
    setEditingDoctor(null);
    refetch();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDoctor(null);
  };

  const handleSearchChange = (e) => {
    doctorActions.setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (status) => {
    doctorActions.setFilter("status", status);
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
        <DoctorForm
          initialData={editingDoctor}
          isEdit={!!editingDoctor}
          onSubmit={async (data) => {
            // The form component will handle the API call
            handleFormSuccess();
          }}
          onCancel={handleFormCancel}
        />
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
        {!isLoading && !error && doctorsData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctorsData.content && doctorsData.content.length > 0 ? (
              doctorsData.content.map((doctor) => (
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
                      onClick={() => handleDeleteDoctor(doctor.id)}
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
                <p className="text-gray-500 mb-4">No doctors found.</p>
                <Button onClick={handleAddDoctor}>Add Your First Doctor</Button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && doctorsData && doctorsData.totalPages > 1 && (
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
                Page {pagination.page + 1} of {doctorsData.totalPages}
              </span>
              <Button
                onClick={() =>
                  doctorActions.setPage(
                    Math.min(doctorsData.totalPages - 1, pagination.page + 1)
                  )
                }
                disabled={pagination.page >= doctorsData.totalPages - 1}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/doctors")({
  component: DoctorsPage,
});
