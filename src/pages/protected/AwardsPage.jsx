import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";

import {
  useGetAllAwards,
  useDeleteAward,
  useCreateAward,
  useUpdateAward,
} from "../../hooks/useAwardQueries.js";
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
  Award,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  Star,
} from "lucide-react";
import AwardForm from "../../components/forms/AwardForm.jsx";

const AwardsPage = () => {
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
  const [deleteModal, setDeleteModal] = useState({ open: false, award: null });
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const { role } = useUserStore();

  // Get the selected address ID to use as branchId
  const selectedAddressId = useAddressStore((state) => state.selectedAddressId);

  // Search and filter states
  const [searchInputs, setSearchInputs] = useState({
    title: "",
    doctor: "",
    minYear: "",
    maxYear: "",
  });

  // Fetch data
  const {
    data: awardsData,
    isLoading,
    error,
    refetch,
  } = useGetAllAwards({
    size: 1000, // Fetch all for client-side filtering
  });

  const { data: doctorsData } = useGetAllDoctors({
    size: 1000,
    branchId: selectedAddressId, // Use selected address ID as branchId
  });

  // Mutations
  const deleteAwardMutation = useDeleteAward();
  const createAwardMutation = useCreateAward();
  const updateAwardMutation = useUpdateAward();

  // Filter awards based on search criteria
  const filteredAwards = useMemo(() => {
    const allAwards = awardsData?.data?.content || [];
    const allDoctors = doctorsData?.data?.content || [];

    if (
      !searchInputs.title &&
      !searchInputs.doctor &&
      !searchInputs.minYear &&
      !searchInputs.maxYear
    ) {
      return allAwards;
    }

    return allAwards.filter((award) => {
      // Title filter
      if (
        searchInputs.title &&
        !award.title?.toLowerCase().includes(searchInputs.title.toLowerCase())
      ) {
        return false;
      }

      // Doctor filter
      if (searchInputs.doctor) {
        const doctor = allDoctors.find((d) => d.id === award.doctorId);
        if (
          !doctor ||
          !doctor.name
            ?.toLowerCase()
            .includes(searchInputs.doctor.toLowerCase())
        ) {
          return false;
        }
      }

      // Year filters
      if (
        searchInputs.minYear &&
        award.awardedYear < parseInt(searchInputs.minYear)
      ) {
        return false;
      }
      if (
        searchInputs.maxYear &&
        award.awardedYear > parseInt(searchInputs.maxYear)
      ) {
        return false;
      }

      return true;
    });
  }, [awardsData?.data?.content, doctorsData?.data?.content, searchInputs]);

  // Pagination
  const paginatedAwards = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredAwards.slice(startIndex, startIndex + pageSize);
  }, [filteredAwards, currentPage, pageSize]);

  const pagination = useMemo(
    () => ({
      currentPage,
      totalPages: Math.ceil(filteredAwards.length / pageSize),
      totalElements: filteredAwards.length,
      size: pageSize,
    }),
    [filteredAwards.length, currentPage, pageSize]
  );

  // Handlers
  const handleDeleteClick = (award) => {
    setDeleteModal({ open: true, award });
  };

  const handleDeleteConfirm = async () => {
    const { award } = deleteModal;
    if (!award) return;

    try {
      await deleteAwardMutation.mutateAsync(award.id);
      setDeleteModal({ open: false, award: null });
    } catch (error) {
      console.error("Failed to delete award:", error);
    }
  };

  const handleEditClick = (award) => {
    setEditingAward(award);
    setShowAwardForm(true);
  };

  const handleCreateClick = () => {
    setEditingAward(null);
    setShowAwardForm(true);
  };

  const handleFormSubmit = async (awardData) => {
    try {
      if (editingAward) {
        await updateAwardMutation.mutateAsync({
          awardId: editingAward.id,
          awardData,
        });
      } else {
        await createAwardMutation.mutateAsync({
          doctorId: awardData.doctorId,
          awardData: {
            title: awardData.title,
            awardedYear: awardData.awardedYear,
            summary: awardData.summary,
          },
        });
      }
      setShowAwardForm(false);
      setEditingAward(null);
    } catch (error) {
      console.error("Failed to save award:", error);
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
      title: "",
      doctor: "",
      minYear: "",
      maxYear: "",
    });
    setCurrentPage(0);
  };

  const hasActiveFilters = Object.values(searchInputs).some((v) => v);

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Awards Access Issue
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
          <h1 className="text-2xl font-bold">Awards Management</h1>
          <p className="text-gray-600">Manage doctor awards and recognitions</p>
        </div>
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
          <Plus size={16} />
          Add Award
        </Button>
      </div>

      {/* Search Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Award Title
            </label>
            <Input
              placeholder="Search by award title..."
              value={searchInputs.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
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
            <label className="block text-sm font-medium mb-1">Min Year</label>
            <Input
              type="number"
              placeholder="2000"
              value={searchInputs.minYear}
              onChange={(e) => handleInputChange("minYear", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Year</label>
            <Input
              type="number"
              placeholder="2024"
              value={searchInputs.maxYear}
              onChange={(e) => handleInputChange("maxYear", e.target.value)}
            />
          </div>
        </div>
        {hasActiveFilters && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredAwards.length} of {awardsData?.data?.totalElements || 0}{" "}
              awards found
            </span>
            <Button onClick={clearSearch} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Awards List */}
      <div className="mb-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading awards...</p>
          </div>
        ) : paginatedAwards.length === 0 ? (
          <Card className="p-8 text-center">
            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {hasActiveFilters
                ? "No awards found matching your search criteria."
                : "No awards found. Create the first award to get started."}
            </p>
            {!hasActiveFilters && (
              <Button onClick={handleCreateClick} className="mt-4">
                Add First Award
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAwards.map((award) => {
              const doctor = doctorsData?.data?.content?.find(
                (d) => d.id === award.doctorId
              );
              return (
                <Card
                  key={award.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Award className="h-5 w-5 text-yellow-500" />
                          {award.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {award.awardedYear}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {role === "ADMIN" && (
                          <>
                            <Button
                              onClick={() => handleEditClick(award)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(award)}
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
                      {award.summary && (
                        <p className="text-sm text-gray-600">{award.summary}</p>
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
            Showing {paginatedAwards.length} of {pagination.totalElements}{" "}
            awards
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

      {/* Award Form Modal */}
      {showAwardForm && (
        <AwardForm
          award={editingAward}
          doctors={doctorsData?.data?.content || []}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowAwardForm(false);
            setEditingAward(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, award: null })}
        title="Delete Award"
        description={`Are you sure you want to delete "${deleteModal.award?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AwardsPage;
