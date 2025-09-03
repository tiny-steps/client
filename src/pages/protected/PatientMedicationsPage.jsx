import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import {
  useGetAllPatientMedications,
  useDeletePatientMedication,
  useCreatePatientMedication,
  useUpdatePatientMedication,
} from "../../hooks/usePatientMedicationQueries.js";
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
  Pill,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";
import PatientMedicationForm from "../../components/forms/PatientMedicationForm.jsx";

const PatientMedicationsPage = () => {
  const { activeItem } = useOutletContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    medication: null,
  });
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const { role } = useUserStore();

  // Search and filter states
  const [searchInputs, setSearchInputs] = useState({
    medicationName: "",
    patient: "",
    dosage: "",
  });

  // Fetch data
  const {
    data: medicationsData,
    isLoading,
    error,
    refetch,
  } = useGetAllPatientMedications({
    size: 1000, // Fetch all for client-side filtering
  });

  const { data: patientsData } = useGetAllEnrichedPatients({
    size: 1000,
  });

  // Mutations
  const deleteMedicationMutation = useDeletePatientMedication();
  const createMedicationMutation = useCreatePatientMedication();
  const updateMedicationMutation = useUpdatePatientMedication();

  // Filter medications based on search criteria
  const filteredMedications = useMemo(() => {
    const allMedications = medicationsData?.data?.content || [];
    const allPatients = patientsData?.data?.content || [];

    if (
      !searchInputs.medicationName &&
      !searchInputs.patient &&
      !searchInputs.dosage
    ) {
      return allMedications;
    }

    return allMedications.filter((medication) => {
      // Medication name filter
      if (
        searchInputs.medicationName &&
        !medication.medicationName
          ?.toLowerCase()
          .includes(searchInputs.medicationName.toLowerCase())
      ) {
        return false;
      }

      // Patient filter
      if (searchInputs.patient) {
        const patient = allPatients.find((p) => p.id === medication.patientId);
        if (
          !patient ||
          !patient.name
            ?.toLowerCase()
            .includes(searchInputs.patient.toLowerCase())
        ) {
          return false;
        }
      }

      // Dosage filter
      if (
        searchInputs.dosage &&
        !medication.dosage
          ?.toLowerCase()
          .includes(searchInputs.dosage.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [medicationsData, patientsData, searchInputs]);

  // Pagination
  const paginatedMedications = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredMedications.slice(startIndex, startIndex + pageSize);
  }, [filteredMedications, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMedications.length / pageSize);

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      if (editingMedication) {
        await updateMedicationMutation.mutateAsync({
          id: editingMedication.id,
          data: formData,
        });
      } else {
        await createMedicationMutation.mutateAsync(formData);
      }
      setShowMedicationForm(false);
      setEditingMedication(null);
      refetch();
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (deleteModal.medication) {
      try {
        await deleteMedicationMutation.mutateAsync(deleteModal.medication.id);
        setDeleteModal({ open: false, medication: null });
        refetch();
      } catch (error) {
        console.error("Error deleting medication:", error);
      }
    }
  };

  // Handle edit
  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setShowMedicationForm(true);
  };

  // Check if medication is current
  const isCurrentMedication = (medication) => {
    if (!medication.startDate || !medication.endDate) return false;
    const now = new Date();
    const startDate = new Date(medication.startDate);
    const endDate = new Date(medication.endDate);
    return now >= startDate && now <= endDate;
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
    <div className="container mx-auto mt-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Patient Medications</h1>
          <p className="text-gray-600">Manage patient medication information</p>
        </div>
        <Button
          onClick={() => setShowMedicationForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
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
              <label className="block text-sm font-medium mb-1">
                Medication
              </label>
              <Input
                placeholder="Search by medication name..."
                value={searchInputs.medicationName}
                onChange={(e) =>
                  setSearchInputs((prev) => ({
                    ...prev,
                    medicationName: e.target.value,
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
              <label className="block text-sm font-medium mb-1">Dosage</label>
              <Input
                placeholder="Search by dosage..."
                value={searchInputs.dosage}
                onChange={(e) =>
                  setSearchInputs((prev) => ({
                    ...prev,
                    dosage: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedMedications.map((medication) => {
          const patient = patientsData?.data?.content?.find(
            (p) => p.id === medication.patientId
          );
          const isCurrent = isCurrentMedication(medication);

          return (
            <Card
              key={medication.id}
              className={`hover:shadow-lg transition-all duration-200 ${
                isCurrent ? "border-green-200 bg-green-50" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    {medication.medicationName}
                    {isCurrent && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Patient:</strong> {patient?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Dosage:</strong> {medication.dosage || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Frequency:</strong> {medication.frequency || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Start Date:</strong>{" "}
                  {medication.startDate
                    ? new Date(medication.startDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>End Date:</strong>{" "}
                  {medication.endDate
                    ? new Date(medication.endDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(medication)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteModal({ open: true, medication })}
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

      {/* Medication Form Modal */}
      {showMedicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <PatientMedicationForm
              medication={editingMedication}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowMedicationForm(false);
                setEditingMedication(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        title="Delete Medication"
        description={`Are you sure you want to delete the medication "${deleteModal.medication?.medicationName}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PatientMedicationsPage;
