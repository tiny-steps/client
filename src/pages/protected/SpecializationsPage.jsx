import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";

import {
  useGetAllSpecializations,
  useDeleteSpecialization,
  useCreateSpecialization,
  useUpdateSpecialization,
} from "../../hooks/useSpecializationQueries.js";
import { useGetAllDoctors } from "../../hooks/useDoctorQueries.js";
import useAddressStore from "../../store/useAddressStore.js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { ConfirmModal } from "../../components/ui/confirm-modal.jsx";
import useUserStore from "../../store/useUserStore.js";
import {
  Heart,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Stethoscope,
} from "lucide-react";
import SpecializationForm from "../../components/forms/SpecializationForm.jsx";

const SpecializationsPage = () => {
  const location = useLocation();

  // Get active item info based on current route
  const getActiveItem = () => {
    const mapping = {
      "/dashboard": {
        name: "Dashboard",
        description: "Welcome to Admin Dashboard",
      },
      "/doctors": {
        name: "Doctor",
        description: "Manage Doctors with ease",
      },
      "/doctors/awards": {
        name: "Awards",
        description: "Manage doctor awards",
      },
      "/doctors/qualifications": {
        name: "Qualifications",
        description: "Manage doctor qualifications",
      },
      "/doctors/specializations": {
        name: "Specializations",
        description: "Manage doctor specializations",
      },
      "/patients": {
        name: "Patient",
        description: "Patient Management is a breeze",
      },
      "/patients/allergies": {
        name: "Allergies",
        description: "Manage patient allergies",
      },
      "/patients/medications": {
        name: "Medications",
        description: "Manage patient medications",
      },
      "/patients/emergency-contacts": {
        name: "Emergency Contacts",
        description: "Manage emergency contacts",
      },
      "/timing": {
        name: "Timing",
        description: "Effortless Timing Management",
      },
      "/sessions": {
        name: "Session",
        description: "Unified Session & Session Type Management",
      },
      "/sessions/types": {
        name: "Session Types",
        description: "Manage session types",
      },
      "/schedule": {
        name: "Schedule",
        description: "Appointment Scheduling Made Easy",
      },
      "/reports": {
        name: "Report",
        description: "Generate Reports in a Click",
      },
      "/profile": {
        name: "Profile",
        description: "Manage your profile",
      },
    };
    return (
      mapping[location.pathname] || { name: "Unknown", description: "Page" }
    );
  };

  const activeItem = getActiveItem();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    specialization: null,
  });
  const [showSpecializationForm, setShowSpecializationForm] = useState(false);
  const [editingSpecialization, setEditingSpecialization] = useState(null);
  const { role } = useUserStore();

  // Get the selected address ID to use as branchId
  const selectedAddressId = useAddressStore((state) => state.selectedAddressId);

  // Search and filter states
  const [searchInputs, setSearchInputs] = useState({
    speciality: "",
    doctor: "",
    subspecialization: "",
  });

  // Fetch data
  const {
    data: specializationsData,
    isLoading,
    error,
    refetch,
  } = useGetAllSpecializations({
    size: 1000, // Fetch all for client-side filtering
  });

  const { data: doctorsData } = useGetAllDoctors({
    size: 1000,
    branchId: selectedAddressId, // Use selected address ID as branchId
  });

  // Mutations
  const deleteSpecializationMutation = useDeleteSpecialization();
  const createSpecializationMutation = useCreateSpecialization();
  const updateSpecializationMutation = useUpdateSpecialization();

  // Filter specializations based on search criteria
  const filteredSpecializations = useMemo(() => {
    const allSpecializations = specializationsData?.data?.content || [];
    const allDoctors = doctorsData?.data?.content || [];

    if (
      !searchInputs.speciality &&
      !searchInputs.doctor &&
      !searchInputs.subspecialization
    ) {
      return allSpecializations;
    }

    return allSpecializations.filter((specialization) => {
      // Speciality filter
      if (
        searchInputs.speciality &&
        !specialization.speciality
          ?.toLowerCase()
          .includes(searchInputs.speciality.toLowerCase())
      ) {
        return false;
      }

      // Doctor filter
      if (searchInputs.doctor) {
        const doctor = allDoctors.find((d) => d.id === specialization.doctorId);
        if (
          !doctor ||
          !doctor.name
            ?.toLowerCase()
            .includes(searchInputs.doctor.toLowerCase())
        ) {
          return false;
        }
      }

      // Subspecialization filter
      if (
        searchInputs.subspecialization &&
        !specialization.subspecialization
          ?.toLowerCase()
          .includes(searchInputs.subspecialization.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [
    specializationsData?.data?.content,
    doctorsData?.data?.content,
    searchInputs,
  ]);

  // Pagination
  const paginatedSpecializations = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredSpecializations.slice(startIndex, startIndex + pageSize);
  }, [filteredSpecializations, currentPage, pageSize]);

  const pagination = useMemo(
    () => ({
      currentPage,
      totalPages: Math.ceil(filteredSpecializations.length / pageSize),
      totalElements: filteredSpecializations.length,
      size: pageSize,
    }),
    [filteredSpecializations.length, currentPage, pageSize]
  );

  // Handlers
  const handleDeleteClick = (specialization) => {
    setDeleteModal({ open: true, specialization });
  };

  const handleDeleteConfirm = async () => {
    const { specialization } = deleteModal;
    if (!specialization) return;

    try {
      await deleteSpecializationMutation.mutateAsync(specialization.id);
      setDeleteModal({ open: false, specialization: null });
    } catch (error) {
      console.error("Failed to delete specialization:", error);
    }
  };

  const handleEditClick = (specialization) => {
    setEditingSpecialization(specialization);
    setShowSpecializationForm(true);
  };

  const handleCreateClick = () => {
    setEditingSpecialization(null);
    setShowSpecializationForm(true);
  };

  const handleFormSubmit = async (specializationData) => {
    try {
      if (editingSpecialization) {
        await updateSpecializationMutation.mutateAsync({
          specializationId: editingSpecialization.id,
          specializationData,
        });
      } else {
        await createSpecializationMutation.mutateAsync({
          doctorId: specializationData.doctorId,
          specializationData: {
            speciality: specializationData.speciality,
            subspecialization: specializationData.subspecialization,
          },
        });
      }
      setShowSpecializationForm(false);
      setEditingSpecialization(null);
    } catch (error) {
      console.error("Failed to save specialization:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setSearchInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(0);
  };

  const clearSearch = () => {
    setSearchInputs({
      speciality: "",
      doctor: "",
      subspecialization: "",
    });
    setCurrentPage(0);
  };

  const hasActiveFilters = Object.values(searchInputs).some((v) => v);

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Specializations Access Issue
          </h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="default">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-6 h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Specializations Management</h1>
          <p className="text-gray-600">
            Manage doctor specializations and subspecializations
          </p>
        </div>
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
          <Plus size={16} />
          Add Specialization
        </Button>
      </div>

      {/* Search Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Speciality</label>
            <Input
              placeholder="Search by speciality..."
              value={searchInputs.speciality}
              onChange={(e) => handleInputChange("speciality", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Doctor</label>
            <Input
              placeholder="Search by doctor name..."
              value={searchInputs.doctor}
              onChange={(e) => handleInputChange("doctor", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Subspecialization
            </label>
            <Input
              placeholder="Search by subspecialization..."
              value={searchInputs.subspecialization}
              onChange={(e) =>
                handleInputChange("subspecialization", e.target.value)
              }
            />
          </div>
        </div>
        {hasActiveFilters && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredSpecializations.length} of{" "}
              {specializationsData?.data?.totalElements || 0} specializations
              found
            </span>
            <Button onClick={clearSearch} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Specializations List */}
      <div className="mb-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading specializations...</p>
          </div>
        ) : paginatedSpecializations.length === 0 ? (
          <Card className="p-8 text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {hasActiveFilters
                ? "No specializations found matching your search criteria."
                : "No specializations found. Create the first specialization to get started."}
            </p>
            {!hasActiveFilters && (
              <Button onClick={handleCreateClick} className="mt-4">
                Add First Specialization
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSpecializations.map((specialization) => {
              const doctor = doctorsData?.data?.content?.find(
                (d) => d.id === specialization.doctorId
              );
              return (
                <Card
                  key={specialization.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Heart className="h-5 w-5 text-red-500" />
                          {specialization.speciality}
                        </CardTitle>
                        {specialization.subspecialization && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <Stethoscope className="h-4 w-4" />
                            {specialization.subspecialization}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {role === "ADMIN" && (
                          <>
                            <Button
                              onClick={() => handleEditClick(specialization)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(specialization)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {doctor && (
                        <p className="text-sm">
                          <strong>Doctor:</strong> {doctor.name}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {paginatedSpecializations.length} of{" "}
            {pagination.totalElements} specializations
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <span className="px-3 py-2 text-sm">
              Page {currentPage + 1} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(pagination.totalPages - 1, prev + 1)
                )
              }
              disabled={currentPage === pagination.totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Specialization Form Modal */}
      {showSpecializationForm && (
        <SpecializationForm
          specialization={editingSpecialization}
          doctors={doctorsData?.data?.content || []}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowSpecializationForm(false);
            setEditingSpecialization(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, specialization: null })}
        title="Delete Specialization"
        description={`Are you sure you want to delete "${deleteModal.specialization?.speciality}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default SpecializationsPage;
