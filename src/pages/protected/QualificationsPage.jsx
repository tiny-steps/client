import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import {
  useGetAllQualifications,
  useDeleteQualification,
  useCreateQualification,
  useUpdateQualification,
} from "../../hooks/useQualificationQueries.js";
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
  GraduationCap,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  Building,
} from "lucide-react";
import QualificationForm from "../../components/forms/QualificationForm.jsx";

const QualificationsPage = () => {
  const { activeItem } = useOutletContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    qualification: null,
  });
  const [showQualificationForm, setShowQualificationForm] = useState(false);
  const [editingQualification, setEditingQualification] = useState(null);
  const { role } = useUserStore();

  // Get the selected address ID to use as branchId
  const selectedAddressId = useAddressStore((state) => state.selectedAddressId);

  // Search and filter states
  const [searchInputs, setSearchInputs] = useState({
    qualificationName: "",
    doctor: "",
    collegeName: "",
    minYear: "",
    maxYear: "",
  });

  // Fetch data
  const {
    data: qualificationsData,
    isLoading,
    error,
    refetch,
  } = useGetAllQualifications({
    size: 1000, // Fetch all for client-side filtering
  });

  const { data: doctorsData } = useGetAllDoctors({
    size: 1000,
    branchId: selectedAddressId, // Use selected address ID as branchId
  });

  // Mutations
  const deleteQualificationMutation = useDeleteQualification();
  const createQualificationMutation = useCreateQualification();
  const updateQualificationMutation = useUpdateQualification();

  // Filter qualifications based on search criteria
  const filteredQualifications = useMemo(() => {
    const allQualifications = qualificationsData?.data?.content || [];
    const allDoctors = doctorsData?.data?.content || [];

    if (
      !searchInputs.qualificationName &&
      !searchInputs.doctor &&
      !searchInputs.collegeName &&
      !searchInputs.minYear &&
      !searchInputs.maxYear
    ) {
      return allQualifications;
    }

    return allQualifications.filter((qualification) => {
      // Qualification name filter
      if (
        searchInputs.qualificationName &&
        !qualification.qualificationName
          ?.toLowerCase()
          .includes(searchInputs.qualificationName.toLowerCase())
      ) {
        return false;
      }

      // Doctor filter
      if (searchInputs.doctor) {
        const doctor = allDoctors.find((d) => d.id === qualification.doctorId);
        if (
          !doctor ||
          !doctor.name
            ?.toLowerCase()
            .includes(searchInputs.doctor.toLowerCase())
        ) {
          return false;
        }
      }

      // College name filter
      if (
        searchInputs.collegeName &&
        !qualification.collegeName
          ?.toLowerCase()
          .includes(searchInputs.collegeName.toLowerCase())
      ) {
        return false;
      }

      // Year filters
      if (
        searchInputs.minYear &&
        qualification.completionYear < parseInt(searchInputs.minYear)
      ) {
        return false;
      }
      if (
        searchInputs.maxYear &&
        qualification.completionYear > parseInt(searchInputs.maxYear)
      ) {
        return false;
      }

      return true;
    });
  }, [
    qualificationsData?.data?.content,
    doctorsData?.data?.content,
    searchInputs,
  ]);

  // Pagination
  const paginatedQualifications = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredQualifications.slice(startIndex, startIndex + pageSize);
  }, [filteredQualifications, currentPage, pageSize]);

  const pagination = useMemo(
    () => ({
      currentPage,
      totalPages: Math.ceil(filteredQualifications.length / pageSize),
      totalElements: filteredQualifications.length,
      size: pageSize,
    }),
    [filteredQualifications.length, currentPage, pageSize]
  );

  // Handlers
  const handleDeleteClick = (qualification) => {
    setDeleteModal({ open: true, qualification });
  };

  const handleDeleteConfirm = async () => {
    const { qualification } = deleteModal;
    if (!qualification) return;

    try {
      await deleteQualificationMutation.mutateAsync(qualification.id);
      setDeleteModal({ open: false, qualification: null });
    } catch (error) {
      console.error("Failed to delete qualification:", error);
    }
  };

  const handleEditClick = (qualification) => {
    setEditingQualification(qualification);
    setShowQualificationForm(true);
  };

  const handleCreateClick = () => {
    setEditingQualification(null);
    setShowQualificationForm(true);
  };

  const handleFormSubmit = async (qualificationData) => {
    try {
      if (editingQualification) {
        await updateQualificationMutation.mutateAsync({
          qualificationId: editingQualification.id,
          qualificationData,
        });
      } else {
        await createQualificationMutation.mutateAsync({
          doctorId: qualificationData.doctorId,
          qualificationData: {
            qualificationName: qualificationData.qualificationName,
            collegeName: qualificationData.collegeName,
            completionYear: qualificationData.completionYear,
          },
        });
      }
      setShowQualificationForm(false);
      setEditingQualification(null);
    } catch (error) {
      console.error("Failed to save qualification:", error);
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
      qualificationName: "",
      doctor: "",
      collegeName: "",
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
            Qualifications Access Issue
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
          <h1 className="text-2xl font-bold">Qualifications Management</h1>
          <p className="text-gray-600">
            Manage doctor qualifications and education
          </p>
        </div>
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
          <Plus size={16} />
          Add Qualification
        </Button>
      </div>

      {/* Search Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Qualification Name
            </label>
            <Input
              placeholder="Search by qualification..."
              value={searchInputs.qualificationName}
              onChange={(e) =>
                handleInputChange("qualificationName", e.target.value)
              }
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
            <label className="block text-sm font-medium mb-1">College</label>
            <Input
              placeholder="Search by college..."
              value={searchInputs.collegeName}
              onChange={(e) => handleInputChange("collegeName", e.target.value)}
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
              {filteredQualifications.length} of{" "}
              {qualificationsData?.data?.totalElements || 0} qualifications
              found
            </span>
            <Button onClick={clearSearch} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Qualifications List */}
      <div className="mb-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading qualifications...</p>
          </div>
        ) : paginatedQualifications.length === 0 ? (
          <Card className="p-8 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {hasActiveFilters
                ? "No qualifications found matching your search criteria."
                : "No qualifications found. Create the first qualification to get started."}
            </p>
            {!hasActiveFilters && (
              <Button onClick={handleCreateClick} className="mt-4">
                Add First Qualification
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedQualifications.map((qualification) => {
              const doctor = doctorsData?.data?.content?.find(
                (d) => d.id === qualification.doctorId
              );
              return (
                <Card
                  key={qualification.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-blue-500" />
                          {qualification.qualificationName}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {qualification.completionYear}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {role === "ADMIN" && (
                          <>
                            <Button
                              onClick={() => handleEditClick(qualification)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(qualification)}
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
                      {qualification.collegeName && (
                        <p className="text-sm flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <strong>College:</strong> {qualification.collegeName}
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
            Showing {paginatedQualifications.length} of{" "}
            {pagination.totalElements} qualifications
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

      {/* Qualification Form Modal */}
      {showQualificationForm && (
        <QualificationForm
          qualification={editingQualification}
          doctors={doctorsData?.data?.content || []}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowQualificationForm(false);
            setEditingQualification(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, qualification: null })}
        title="Delete Qualification"
        description={`Are you sure you want to delete "${deleteModal.qualification?.qualificationName}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default QualificationsPage;
