import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  useGetAllEnrichedPatients,
  useDeleteEnrichedPatient,
  useReactivatePatient,
} from "../hooks/useEnrichedPatientQueries.js";
import {
  useActivatePatient,
  useDeactivatePatient,
  useSoftDeletePatient,
} from "../hooks/usePatientQueries.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import { Power, PowerOff, Trash2 } from "lucide-react";

const PatientsList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [searchParams, setSearchParams] = useState({
    status: "ACTIVE", // Default to active patients only
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    patient: null,
  });
  const [activateModal, setActivateModal] = useState({
    open: false,
    patient: null,
  });
  const [deactivateModal, setDeactivateModal] = useState({
    open: false,
    patient: null,
  });

  const { data, isLoading, error, refetch } = useGetAllEnrichedPatients({
    page: currentPage,
    size: pageSize,
    ...searchParams,
  });

  const deletePatient = useDeleteEnrichedPatient();
  const reactivatePatient = useReactivatePatient();
  const activatePatient = useActivatePatient();
  const deactivatePatient = useDeactivatePatient();
  const softDeletePatient = useSoftDeletePatient();

  const handleReactivateClick = async (patient) => {
    try {
      await reactivatePatient.mutateAsync(patient.id);
      // Optionally show success message
    } catch (error) {
      console.error("Failed to reactivate patient:", error);
      // Optionally show error message
    }
  };

  const handleActivateClick = (patient) => {
    setActivateModal({ open: true, patient });
  };

  const handleDeactivateClick = (patient) => {
    setDeactivateModal({ open: true, patient });
  };

  const handleActivateConfirm = async () => {
    if (activateModal.patient) {
      try {
        await activatePatient.mutateAsync(activateModal.patient.id);
        setActivateModal({ open: false, patient: null });
        // Refresh the data after successful activation
        refetch();
      } catch (error) {
        console.error("Failed to activate patient:", error);
      }
    }
  };

  const handleDeactivateConfirm = async () => {
    if (deactivateModal.patient) {
      try {
        await deactivatePatient.mutateAsync(deactivateModal.patient.id);
        setDeactivateModal({ open: false, patient: null });
        // Refresh the data after successful deactivation
        refetch();
      } catch (error) {
        console.error("Failed to deactivate patient:", error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newParams = {
      name: formData.get("name") || undefined,
      email: formData.get("email") || undefined,
      phone: formData.get("phone") || undefined,
    };

    const statusValue = formData.get("status") || "active";
    // Apply status filter for API call
    if (statusValue === "active") {
      newParams.status = "ACTIVE";
    } else if (statusValue === "inactive") {
      newParams.status = "INACTIVE";
    }
    // For "all", don't set status parameter to get all records

    setSearchParams(newParams);
    setCurrentPage(0);
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.patient) {
      await deletePatient.mutateAsync(deleteModal.patient.id);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <p className="text-red-600">{error.message}</p>
        <Button onClick={refetch} variant="destructive" className="mt-2">
          Retry
        </Button>
      </Card>
    );

  const patients = data?.data?.content || [];
  const pagination = data?.data || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button
          onClick={() => navigate("/patients/add")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Input name="name" placeholder="Patient name..." />
            <Input name="email" placeholder="Email..." />
            <Input name="phone" placeholder="Phone..." />
            <select
              name="status"
              defaultValue="active"
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="all">All Patients</option>
            </select>
            <div className="md:col-span-4 flex gap-2">
              <Button type="submit">Search</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchParams({ status: "ACTIVE" });
                  setCurrentPage(0);
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {patient.firstName} {patient.lastName}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        patient.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : patient.status === "INACTIVE"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {patient.status === "ACTIVE"
                        ? "Active"
                        : patient.status === "INACTIVE"
                        ? "Inactive"
                        : "Deleted"}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {patient.bloodGroup || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> {patient.email}
                </p>
                <p className="text-sm">
                  <strong>Phone:</strong> {patient.phone}
                </p>
                <p className="text-sm">
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <strong>Gender:</strong> {patient.gender}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/patients/${patient.id}/edit`)}
                >
                  Edit
                </Button>

                {/* Conditional action buttons based on patient status */}
                {patient.status === "ACTIVE" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-yellow-600 hover:bg-yellow-50"
                    onClick={() => handleDeactivateClick(patient)}
                    disabled={deactivatePatient.isPending}
                  >
                    {deactivatePatient.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
                        Deactivating...
                      </>
                    ) : (
                      <>
                        <PowerOff className="h-3 w-3 mr-1" />
                        Deactivate
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:bg-green-50"
                    onClick={() => handleActivateClick(patient)}
                    disabled={activatePatient.isPending}
                  >
                    {activatePatient.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                        Activating...
                      </>
                    ) : (
                      <>
                        <Power className="h-3 w-3 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {patients.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No patients found.</p>
        </Card>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage + 1} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage >= pagination.totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, patient: null })}
        title="Delete Patient"
        description={`Delete ${deleteModal.patient?.firstName} ${deleteModal.patient?.lastName}?`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />

      {/* Activate Confirmation Modal */}
      <ConfirmModal
        open={activateModal.open}
        onOpenChange={(open) => setActivateModal({ open, patient: null })}
        title="Activate Patient"
        description={`Are you sure you want to activate ${activateModal.patient?.firstName} ${activateModal.patient?.lastName}? This will make the patient available for appointments and services.`}
        confirmText="Activate"
        cancelText="Cancel"
        variant="default"
        onConfirm={handleActivateConfirm}
      />

      {/* Deactivate Confirmation Modal */}
      <ConfirmModal
        open={deactivateModal.open}
        onOpenChange={(open) => setDeactivateModal({ open, patient: null })}
        title="Deactivate Patient"
        description={`Are you sure you want to deactivate ${deactivateModal.patient?.firstName} ${deactivateModal.patient?.lastName}? This will make the patient inactive but preserve their records.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        variant="outline"
        onConfirm={handleDeactivateConfirm}
      />
    </div>
  );
};

export default PatientsList;
