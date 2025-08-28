import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import {
  useGetAllPatientAllergies,
  useDeletePatientAllergy,
  useCreatePatientAllergy,
  useUpdatePatientAllergy,
} from "../../hooks/usePatientAllergyQueries.js";
import { useGetAllEnrichedPatients } from "../../hooks/useEnrichedPatientQueries.js";
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
  AlertTriangle,
} from "lucide-react";
import PatientAllergyForm from "../../components/forms/PatientAllergyForm.jsx";

const PatientAllergiesPage = () => {
  const { activeItem } = useOutletContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    allergy: null,
  });
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState(null);
  const { role } = useUserStore();

  // Search and filter states
  const [searchInputs, setSearchInputs] = useState({
    allergen: "",
    patient: "",
    reaction: "",
  });

  // Fetch data
  const {
    data: allergiesData,
    isLoading,
    error,
    refetch,
  } = useGetAllPatientAllergies({
    size: 1000, // Fetch all for client-side filtering
  });

  const { data: patientsData } = useGetAllEnrichedPatients({
    size: 1000,
  });

  // Mutations
  const deleteAllergyMutation = useDeletePatientAllergy();
  const createAllergyMutation = useCreatePatientAllergy();
  const updateAllergyMutation = useUpdatePatientAllergy();

  // Filter allergies based on search criteria
  const filteredAllergies = useMemo(() => {
    const allAllergies = allergiesData?.data?.content || [];
    const allPatients = patientsData?.data?.content || [];

    if (
      !searchInputs.allergen &&
      !searchInputs.patient &&
      !searchInputs.reaction
    ) {
      return allAllergies;
    }

    return allAllergies.filter((allergy) => {
      // Allergen filter
      if (
        searchInputs.allergen &&
        !allergy.allergen
          ?.toLowerCase()
          .includes(searchInputs.allergen.toLowerCase())
      ) {
        return false;
      }

      // Patient filter
      if (searchInputs.patient) {
        const patient = allPatients.find((p) => p.id === allergy.patientId);
        if (
          !patient ||
          !patient.name
            ?.toLowerCase()
            .includes(searchInputs.patient.toLowerCase())
        ) {
          return false;
        }
      }

      // Reaction filter
      if (
        searchInputs.reaction &&
        !allergy.reaction
          ?.toLowerCase()
          .includes(searchInputs.reaction.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [allergiesData, patientsData, searchInputs]);

  // Pagination
  const paginatedAllergies = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredAllergies.slice(startIndex, startIndex + pageSize);
  }, [filteredAllergies, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAllergies.length / pageSize);

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      if (editingAllergy) {
        await updateAllergyMutation.mutateAsync({
          id: editingAllergy.id,
          data: formData,
        });
      } else {
        await createAllergyMutation.mutateAsync(formData);
      }
      setShowAllergyForm(false);
      setEditingAllergy(null);
      refetch();
    } catch (error) {
      console.error("Error saving allergy:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (deleteModal.allergy) {
      try {
        await deleteAllergyMutation.mutateAsync(deleteModal.allergy.id);
        setDeleteModal({ open: false, allergy: null });
        refetch();
      } catch (error) {
        console.error("Error deleting allergy:", error);
      }
    }
  };

  // Handle edit
  const handleEdit = (allergy) => {
    setEditingAllergy(allergy);
    setShowAllergyForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <p className="text-red-600">{error.message}</p>
        <Button onClick={refetch} variant="destructive" className="mt-2">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Patient Allergies</h1>
          <p className="text-gray-600">Manage patient allergy information</p>
        </div>
        <Button
          onClick={() => setShowAllergyForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Allergy
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Allergen</label>
              <Input
                placeholder="Search by allergen..."
                value={searchInputs.allergen}
                onChange={(e) =>
                  setSearchInputs((prev) => ({
                    ...prev,
                    allergen: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Patient</label>
              <Input
                placeholder="Search by patient name..."
                value={searchInputs.patient}
                onChange={(e) =>
                  setSearchInputs((prev) => ({
                    ...prev,
                    patient: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reaction</label>
              <Input
                placeholder="Search by reaction..."
                value={searchInputs.reaction}
                onChange={(e) =>
                  setSearchInputs((prev) => ({
                    ...prev,
                    reaction: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedAllergies.map((allergy) => {
          const patient = patientsData?.data?.content?.find(
            (p) => p.id === allergy.patientId
          );
          const isCritical = [
            "penicillin",
            "peanuts",
            "shellfish",
            "latex",
            "bee venom",
            "eggs",
            "milk",
          ].some((critical) =>
            allergy.allergen?.toLowerCase().includes(critical)
          );

          return (
            <Card
              key={allergy.id}
              className={`hover:shadow-lg transition-all duration-200 ${
                isCritical ? "border-red-200 bg-red-50" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {allergy.allergen}
                    {isCritical && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isCritical
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {isCritical ? "Critical" : "Standard"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Patient:</strong> {patient?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Reaction:</strong> {allergy.reaction || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Severity:</strong> {allergy.severity || "N/A"}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(allergy)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteModal({ open: true, allergy })}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Allergy Form Modal */}
      {showAllergyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <PatientAllergyForm
              allergy={editingAllergy}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowAllergyForm(false);
                setEditingAllergy(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        title="Delete Allergy"
        description={`Are you sure you want to delete the allergy "${deleteModal.allergy?.allergen}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PatientAllergiesPage;
