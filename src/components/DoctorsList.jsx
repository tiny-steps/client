import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useGetAllDoctors } from "../hooks/useDoctorQueries.js";
import {
  useDeactivateDoctorFromBranches,
  useActivateDoctorInBranch,
  useActivateDoctorInBranches,
  useGetDoctorsWithBranchStatus,
} from "../hooks/useDoctorRobustSoftDelete.js";
import {
  useMultipleAddressDetails,
  getAddressDisplayName,
} from "../hooks/useAddressDetails.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import { useBranchFilter } from "../hooks/useBranchFilter.js";
import BranchManagementModal from "./modals/BranchManagementModal.jsx";
import RobustDeleteModal from "./modals/RobustDeleteModal.jsx";
import BranchActivationModal from "./modals/BranchActivationModal.jsx";
import { Building2, Plus, ArrowRightLeft, Power, Trash2 } from "lucide-react";

const DoctorsList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [branchModal, setBranchModal] = useState({ open: false, doctor: null });
  const [robustDeleteModal, setRobustDeleteModal] = useState({
    open: false,
    doctor: null,
  });
  const [activateModal, setActivateModal] = useState({
    open: false,
    doctor: null,
  });
  const [branchActivationModal, setBranchActivationModal] = useState({
    open: false,
    doctor: null,
  });

  // Get the effective branch ID for filtering
  const { branchId, hasSelection } = useBranchFilter();

  // Use robust soft delete hooks
  const deactivateMutation = useDeactivateDoctorFromBranches();
  const activateMutation = useActivateDoctorInBranch();
  const activateInBranchesMutation = useActivateDoctorInBranches();

  // Client-side search state
  const [searchInputs, setSearchInputs] = useState({
    name: "",
    speciality: "",
    minExperience: "",
  });

  // Fetch doctors with branch status (includes both active and inactive)
  const { data, isLoading, error, refetch } = branchId
    ? useGetDoctorsWithBranchStatus(
        branchId,
        {
          page: 0,
          size: 1000, // Fetch all doctors for client-side filtering
        },
        {
          enabled: hasSelection, // Fetch when we have a selection (including "all")
        }
      )
    : useGetAllDoctors(
        {
          page: 0,
          size: 1000, // Fetch all doctors for client-side filtering
          status: undefined, // Get both active and inactive
        },
        {
          enabled: hasSelection, // Fetch when we have a selection (including "all")
        }
      );

  // Client-side filtering using useMemo for performance (Google-style)
  const filteredDoctors = useMemo(() => {
    const allDoctors = data?.data?.content || [];

    if (
      !searchInputs.name &&
      !searchInputs.speciality &&
      !searchInputs.minExperience
    ) {
      return allDoctors;
    }

    return allDoctors.filter((doctor) => {
      // Name filter (case-insensitive partial match)
      if (searchInputs.name) {
        const nameMatch = doctor.name
          ?.toLowerCase()
          .includes(searchInputs.name.toLowerCase());
        if (!nameMatch) return false;
      }

      // Speciality filter (case-insensitive partial match) - search through specializations array
      if (searchInputs.speciality) {
        const hasMatchingSpeciality = doctor.specializations?.some((spec) =>
          spec.speciality
            ?.toLowerCase()
            .includes(searchInputs.speciality.toLowerCase())
        );
        if (!hasMatchingSpeciality) return false;
      }

      // Experience filter (greater than or equal)
      if (searchInputs.minExperience) {
        const minExp = parseInt(searchInputs.minExperience);
        if (doctor.experienceYears < minExp) return false;
      }

      return true;
    });
  }, [data?.data?.content, searchInputs]);

  // Get all unique address IDs from doctors for batch fetching
  const allAddressIds = useMemo(() => {
    const addressIds = new Set();
    filteredDoctors.forEach((doctor) => {
      if (doctor.addressIds) {
        doctor.addressIds.forEach((id) => addressIds.add(id));
      }
      if (doctor.doctorAddresses) {
        doctor.doctorAddresses.forEach((addr) =>
          addressIds.add(addr.addressId)
        );
      }
    });
    return Array.from(addressIds);
  }, [filteredDoctors]);

  // Fetch address details for all unique address IDs
  const { data: addressData = {} } = useMultipleAddressDetails(allAddressIds);

  // Client-side pagination
  const paginatedDoctors = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredDoctors.slice(startIndex, endIndex);
  }, [filteredDoctors, currentPage, pageSize]);

  // Pagination info
  const pagination = useMemo(
    () => ({
      currentPage,
      totalPages: Math.ceil(filteredDoctors.length / pageSize),
      totalElements: filteredDoctors.length,
      size: pageSize,
    }),
    [filteredDoctors.length, currentPage, pageSize]
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchInputs]);

  const clearSearch = () => {
    setSearchInputs({
      name: "",
      speciality: "",
      minExperience: "",
    });
    setCurrentPage(0);
  };

  const handleDeleteClick = (doctor) => {
    setRobustDeleteModal({ open: true, doctor });
  };

  const handleActivateClick = (doctor) => {
    // Check if doctor is globally deactivated
    if (doctor.status === "INACTIVE") {
      // Show branch selection modal for globally deactivated doctors
      setBranchActivationModal({ open: true, doctor });
    } else {
      // Use existing single branch activation for branch-specific deactivation
      setActivateModal({ open: true, doctor });
    }
  };

  const handleRobustDeleteConfirm = async (params) => {
    try {
      await deactivateMutation.mutateAsync(params);
      setRobustDeleteModal({ open: false, doctor: null });
    } catch (error) {
      console.error("Failed to deactivate doctor:", error);
    }
  };

  const handleActivateConfirm = async () => {
    if (activateModal.doctor && branchId) {
      try {
        await activateMutation.mutateAsync({
          doctorId: activateModal.doctor.id,
          branchId: branchId,
        });
        setActivateModal({ open: false, doctor: null });
      } catch (error) {
        console.error("Failed to activate doctor:", error);
      }
    }
  };

  const handleBranchActivationConfirm = async (params) => {
    try {
      await activateInBranchesMutation.mutateAsync(params);
      setBranchActivationModal({ open: false, doctor: null });
    } catch (error) {
      console.error("Failed to activate doctor in branches:", error);
    }
  };

  // Helper function to determine doctor status in current branch
  const getDoctorBranchStatus = (doctor) => {
    if (!branchId) {
      // When "All" is selected, use global status
      return doctor.status;
    }

    // Check if doctor is active in the selected branch
    // Look for doctorAddresses with matching addressId
    const branchAddress = doctor.doctorAddresses?.find(
      (addr) => addr.addressId === branchId
    );

    return branchAddress?.status || "INACTIVE";
  };

  // Helper function to check if doctor is inactive in current context
  const isDoctorInactive = (doctor) => {
    const status = getDoctorBranchStatus(doctor);
    return status === "INACTIVE";
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Real-time search input handlers (instant filtering)
  const handleInputChange = (field, value) => {
    setSearchInputs((prev) => ({
      ...prev,
      [field]: value,
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
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Doctors
          </h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="destructive">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const hasActiveFilters = Object.values(searchInputs).some((v) => v);

  return (
    <div className="p-6 h-full w-full ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doctors List</h1>
        <Button onClick={() => navigate({ to: "/doctors/add" })}>
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
                <label className="block text-sm font-medium mb-1">
                  Doctor Name
                </label>
                <Input
                  name="name"
                  placeholder="Search by name..."
                  value={searchInputs.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Speciality
                </label>
                <Input
                  name="speciality"
                  placeholder="e.g., Cardiology"
                  value={searchInputs.speciality}
                  onChange={(e) =>
                    handleInputChange("speciality", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Min Experience (Years)
                </label>
                <Input
                  name="minExperience"
                  type="number"
                  min="0"
                  placeholder="Minimum years"
                  value={searchInputs.minExperience}
                  onChange={(e) =>
                    handleInputChange("minExperience", e.target.value)
                  }
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
          Showing {paginatedDoctors.length} of {pagination.totalElements}{" "}
          doctors
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
            Filtered from {data?.data?.content?.length || 0} total
          </span>
        )}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedDoctors.map((doctor) => {
          const isInactive = isDoctorInactive(doctor);
          const doctorStatus = getDoctorBranchStatus(doctor);

          return (
            <Card
              key={doctor.id}
              className={`hover:shadow-lg transition-shadow ${
                isInactive
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {/* Highlight search terms */}
                        {searchInputs.name ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: doctor.name.replace(
                                new RegExp(`(${searchInputs.name})`, "gi"),
                                '<mark class="bg-yellow-200">$1</mark>'
                              ),
                            }}
                          />
                        ) : (
                          doctor.name
                        )}
                      </CardTitle>
                      {/* Status Badge */}
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          isInactive
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isInactive ? "Inactive" : "Active"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {doctor.specializations &&
                      doctor.specializations.length > 0 ? (
                        searchInputs.speciality ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: doctor.specializations
                                .map((spec) => spec.speciality)
                                .join(", ")
                                .replace(
                                  new RegExp(
                                    `(${searchInputs.speciality})`,
                                    "gi"
                                  ),
                                  '<mark class="bg-yellow-200">$1</mark>'
                                ),
                            }}
                          />
                        ) : (
                          doctor.specializations
                            .map((spec) => spec.speciality)
                            .join(", ")
                        )
                      ) : (
                        "General"
                      )}
                    </p>
                  </div>
                  {doctor.imageUrl && (
                    <img
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        console.error(
                          "Image failed to load:",
                          doctor.imageUrl,
                          e
                        );
                        e.target.style.display = "none";
                      }}
                      onLoad={() =>
                        console.log(
                          "Image loaded successfully:",
                          doctor.imageUrl
                        )
                      }
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong> {doctor.email}
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> {doctor.phone}
                  </p>
                  <p className="text-sm">
                    <strong>Experience:</strong>
                    <span
                      className={
                        searchInputs.minExperience &&
                        doctor.experienceYears >=
                          parseInt(searchInputs.minExperience)
                          ? "bg-green-100 px-1 rounded"
                          : ""
                      }
                    >
                      {doctor.experienceYears} years
                    </span>
                  </p>
                  <p className="text-sm">
                    <strong>Gender:</strong> {doctor.gender}
                  </p>
                  {doctor.remarks && (
                    <p className="text-sm text-gray-600 mt-2">
                      {doctor.remarks}
                    </p>
                  )}

                  {/* Show current branches when "All" is selected */}
                  {!branchId &&
                    doctor.doctorAddresses &&
                    doctor.doctorAddresses.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Current Branches:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {doctor.doctorAddresses.map((address, index) => {
                            const addressInfo = addressData[address.addressId];
                            const addressName =
                              getAddressDisplayName(addressInfo);

                            return (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  address.status === "ACTIVE"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                <Building2 className="h-3 w-3 mr-1" />
                                {addressName}
                                {address.status === "INACTIVE" && " (Inactive)"}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate({ to: `/doctors/${doctor.id}` })}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate({ to: `/doctors/${doctor.id}/edit` })
                    }
                  >
                    Edit
                  </Button>

                  {/* Branch Management Buttons */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBranchModal({ open: true, doctor })}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Manage Branches
                  </Button>

                  {/* Conditional Action Button - Activate or Delete based on status */}
                  {isInactive ? (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleActivateClick(doctor)}
                      disabled={
                        activateMutation.isPending ||
                        activateInBranchesMutation.isPending
                      }
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Power className="h-3 w-3 mr-1" />
                      {activateMutation.isPending ||
                      activateInBranchesMutation.isPending
                        ? "Activating..."
                        : "Activate"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(doctor)}
                      disabled={deactivateMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      {deactivateMutation.isPending
                        ? "Deactivating..."
                        : "Deactivate"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {paginatedDoctors.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            {hasActiveFilters
              ? "No doctors found matching your search criteria."
              : "No doctors found."}
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

      {/* Robust Delete Modal */}
      <RobustDeleteModal
        isOpen={robustDeleteModal.open}
        onClose={() => setRobustDeleteModal({ open: false, doctor: null })}
        doctor={robustDeleteModal.doctor}
        currentBranchId={branchId}
        onConfirm={handleRobustDeleteConfirm}
        isLoading={deactivateMutation.isPending}
      />

      {/* Activate Confirmation Modal */}
      <ConfirmModal
        open={activateModal.open}
        onOpenChange={(open) => setActivateModal({ open, doctor: null })}
        title="Activate Doctor"
        description={`Are you sure you want to activate ${activateModal.doctor?.name} in this branch?`}
        confirmText="Activate"
        cancelText="Cancel"
        variant="default"
        onConfirm={handleActivateConfirm}
      />

      {/* Branch Activation Modal */}
      <BranchActivationModal
        isOpen={branchActivationModal.open}
        onClose={() => setBranchActivationModal({ open: false, doctor: null })}
        doctor={branchActivationModal.doctor}
        onConfirm={handleBranchActivationConfirm}
        isLoading={activateInBranchesMutation.isPending}
      />

      {/* Branch Management Modal */}
      <BranchManagementModal
        isOpen={branchModal.open}
        onClose={() => setBranchModal({ open: false, doctor: null })}
        doctor={branchModal.doctor}
      />
    </div>
  );
};

export default DoctorsList;
