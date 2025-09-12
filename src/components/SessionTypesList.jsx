import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  useGetAllSessionTypes,
  useDeleteSessionType,
  useActivateSessionType,
  useDeactivateSessionType,
} from "../hooks/useSessionQueries.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import SessionTypeForm from "./forms/SessionTypeForm.jsx";
import useAddressStore from "../store/useAddressStore.js";

const SessionTypesList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchInputs, setSearchInputs] = useState({
    name: "",
    isActive: "",
    isTelemedicineAvailable: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    sessionType: null,
  });
  const [showSessionTypeForm, setShowSessionTypeForm] = useState(false);
  const [editingSessionType, setEditingSessionType] = useState(null);

  // Get the selected address ID to use as branchId
  const selectedAddressId = useAddressStore((state) => state.selectedAddressId);

  // Fetch session types
  const { data, isLoading, error, refetch } = useGetAllSessionTypes({
    page: currentPage,
    size: 1000, // Fetch all for client-side filtering
    branchId: selectedAddressId, // Use selected address ID as branchId
  });

  // Mutations
  const deleteSessionType = useDeleteSessionType();
  const activateSessionType = useActivateSessionType();
  const deactivateSessionType = useDeactivateSessionType();

  // Client-side filtering
  const filteredSessionTypes = useMemo(() => {
    const allSessionTypes = data?.content || [];

    if (
      !searchInputs.name &&
      !searchInputs.isActive &&
      !searchInputs.isTelemedicineAvailable
    ) {
      return allSessionTypes;
    }

    return allSessionTypes.filter((sessionType) => {
      // Name filter
      if (searchInputs.name) {
        const nameMatch = sessionType.name
          ?.toLowerCase()
          .includes(searchInputs.name.toLowerCase());
        if (!nameMatch) return false;
      }

      // Active status filter
      if (searchInputs.isActive !== "") {
        const activeMatch =
          sessionType.isActive === (searchInputs.isActive === "true");
        if (!activeMatch) return false;
      }

      // Telemedicine filter
      if (searchInputs.isTelemedicineAvailable !== "") {
        const telemedicineMatch =
          sessionType.isTelemedicineAvailable ===
          (searchInputs.isTelemedicineAvailable === "true");
        if (!telemedicineMatch) return false;
      }

      return true;
    });
  }, [data?.content, searchInputs]);

  // Client-side pagination
  const paginatedSessionTypes = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredSessionTypes.slice(startIndex, endIndex);
  }, [filteredSessionTypes, currentPage, pageSize]);

  // Pagination info
  const pagination = useMemo(
    () => ({
      currentPage,
      totalPages: Math.ceil(filteredSessionTypes.length / pageSize),
      totalElements: filteredSessionTypes.length,
      size: pageSize,
    }),
    [filteredSessionTypes.length, currentPage, pageSize]
  );

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchInputs]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchInputs({
      name: formData.get("name") || "",
      isActive: formData.get("isActive") || "",
      isTelemedicineAvailable: formData.get("isTelemedicineAvailable") || "",
    });
  };

  const clearSearch = () => {
    setSearchInputs({
      name: "",
      isActive: "",
      isTelemedicineAvailable: "",
    });
  };

  const handleDeleteClick = (sessionType) => {
    setDeleteModal({ open: true, sessionType });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.sessionType) {
      try {
        await deleteSessionType.mutateAsync(deleteModal.sessionType.id);
        setDeleteModal({ open: false, sessionType: null });
      } catch (error) {
        console.error("Failed to delete session type:", error);
      }
    }
  };

  const handleToggleActive = (sessionType) => {
    if (sessionType.isActive) {
      deactivateSessionType.mutate(sessionType.id);
    } else {
      activateSessionType.mutate(sessionType.id);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading session types...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Session Types
          </h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="destructive">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Use filtered and paginated data
  const sessionTypes = paginatedSessionTypes;

  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Session Types</h1>
        <Button
          onClick={() => {
            setEditingSessionType(null);
            setShowSessionTypeForm(true);
          }}
        >
          Add New Session Type
        </Button>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search Session Types</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  name="name"
                  placeholder="Search by name..."
                  defaultValue={searchInputs.name || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="isActive"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue={searchInputs.isActive || ""}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Telemedicine
                </label>
                <select
                  name="isTelemedicineAvailable"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue={searchInputs.isTelemedicineAvailable || ""}
                >
                  <option value="">All Types</option>
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration Range
                </label>
                <div className="flex gap-2">
                  <Input name="minDuration" type="number" placeholder="Min" />
                  <Input name="maxDuration" type="number" placeholder="Max" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Search</Button>
              <Button type="button" variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {sessionTypes.length} of {pagination.totalElements} session
        types
      </div>

      {/* Session Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessionTypes.map((sessionType) => (
          <Card
            key={sessionType.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    {sessionType.name}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        sessionType.isActive
                      )}`}
                    >
                      {sessionType.isActive ? "Active" : "Inactive"}
                    </span>
                    {sessionType.isTelemedicineAvailable && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Telemedicine
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {sessionType.description}
                </p>
                <p className="text-sm">
                  <strong>Duration:</strong>{" "}
                  {sessionType.defaultDurationMinutes} minutes
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingSessionType(sessionType);
                    setShowSessionTypeForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={sessionType.isActive ? "outline" : "default"}
                  onClick={() => handleToggleActive(sessionType)}
                  disabled={toggleActiveStatus.isPending}
                >
                  {sessionType.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(sessionType)}
                  disabled={deleteSessionType.isPending}
                >
                  {deleteSessionType.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessionTypes.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            No session types found matching your criteria.
          </p>
        </Card>
      )}

      {/* Pagination */}
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
        onOpenChange={(open) => setDeleteModal({ open, sessionType: null })}
        title="Delete Session Type"
        description={`Are you sure you want to delete "${deleteModal.sessionType?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />

      {/* Session Type Form Modal */}
      {showSessionTypeForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 bg-white/90 backdrop-blur-md border border-white/30 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-gray-900">
                {editingSessionType ? "Edit Session Type" : "Add Session Type"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SessionTypeForm
                mode={editingSessionType ? "edit" : "create"}
                onSuccess={() => {
                  setShowSessionTypeForm(false);
                  setEditingSessionType(null);
                  refetch();
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SessionTypesList;
