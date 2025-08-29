import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import {
  useGetAllSessionTypes,
  useDeleteSessionType,
  useActivateSessionType,
  useDeactivateSessionType,
} from "../../hooks/useSessionQueries.js";
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
  Settings,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Clock,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";
import SessionTypeForm from "../../components/forms/SessionTypeForm.jsx";

const SessionTypesPage = () => {
  const { activeItem } = useOutletContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    sessionType: null,
  });
  const [showSessionTypeForm, setShowSessionTypeForm] = useState(false);
  const [editingSessionType, setEditingSessionType] = useState(null);
  const { role } = useUserStore();

  // Search and filter states
  const [searchInputs, setSearchInputs] = useState({
    name: "",
    isActive: "",
    isTelemedicineAvailable: "",
    minDuration: "",
    maxDuration: "",
  });

  // Fetch data
  const {
    data: sessionTypesData,
    isLoading,
    error,
    refetch,
  } = useGetAllSessionTypes({
    size: 1000, // Fetch all for client-side filtering
  });

  // Mutations
  const deleteSessionTypeMutation = useDeleteSessionType();
  const activateSessionTypeMutation = useActivateSessionType();
  const deactivateSessionTypeMutation = useDeactivateSessionType();

  // Filter session types based on search criteria
  const filteredSessionTypes = useMemo(() => {
    const allSessionTypes = sessionTypesData?.content || [];

    if (
      !searchInputs.name &&
      !searchInputs.isActive &&
      !searchInputs.isTelemedicineAvailable &&
      !searchInputs.minDuration &&
      !searchInputs.maxDuration
    ) {
      return allSessionTypes;
    }

    return allSessionTypes.filter((sessionType) => {
      // Name filter
      if (
        searchInputs.name &&
        !sessionType.name
          ?.toLowerCase()
          .includes(searchInputs.name.toLowerCase())
      ) {
        return false;
      }

      // Active status filter
      if (
        searchInputs.isActive &&
        sessionType.isActive !== (searchInputs.isActive === "true")
      ) {
        return false;
      }

      // Telemedicine availability filter
      if (
        searchInputs.isTelemedicineAvailable &&
        sessionType.isTelemedicineAvailable !==
          (searchInputs.isTelemedicineAvailable === "true")
      ) {
        return false;
      }

      // Duration filters
      if (
        searchInputs.minDuration &&
        sessionType.defaultDurationMinutes < parseInt(searchInputs.minDuration)
      ) {
        return false;
      }
      if (
        searchInputs.maxDuration &&
        sessionType.defaultDurationMinutes > parseInt(searchInputs.maxDuration)
      ) {
        return false;
      }

      return true;
    });
  }, [sessionTypesData?.content, searchInputs]);

  // Pagination
  const paginatedSessionTypes = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredSessionTypes.slice(startIndex, startIndex + pageSize);
  }, [filteredSessionTypes, currentPage, pageSize]);

  const pagination = useMemo(
    () => ({
      currentPage,
      totalPages: Math.ceil(filteredSessionTypes.length / pageSize),
      totalElements: filteredSessionTypes.length,
      size: pageSize,
    }),
    [filteredSessionTypes.length, currentPage, pageSize]
  );

  // Handlers
  const handleDeleteClick = (sessionType) => {
    setDeleteModal({ open: true, sessionType });
  };

  const handleDeleteConfirm = async () => {
    const { sessionType } = deleteModal;
    if (!sessionType) return;

    try {
      await deleteSessionTypeMutation.mutateAsync(sessionType.id);
      setDeleteModal({ open: false, sessionType: null });
    } catch (error) {
      console.error("Failed to delete session type:", error);
    }
  };

  const handleEditClick = (sessionType) => {
    setEditingSessionType(sessionType);
    setShowSessionTypeForm(true);
  };

  const handleCreateClick = () => {
    setEditingSessionType(null);
    setShowSessionTypeForm(true);
  };

  const handleToggleStatus = async (sessionType) => {
    try {
      if (sessionType.isActive) {
        await deactivateSessionTypeMutation.mutateAsync(sessionType.id);
      } else {
        await activateSessionTypeMutation.mutateAsync(sessionType.id);
      }
    } catch (error) {
      console.error("Failed to toggle session type status:", error);
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
      name: "",
      isActive: "",
      isTelemedicineAvailable: "",
      minDuration: "",
      maxDuration: "",
    });
    setCurrentPage(0);
  };

  const hasActiveFilters = Object.values(searchInputs).some((v) => v);

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Session Types Access Issue
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
    <div className="p-6 h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-1">
          <h1 className="text-2xl font-bold mr-6">Session Types Management</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/sessions")}
            className="flex items-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Manage Sessions
          </Button>
        </div>
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
          <Plus size={16} />
          Add Session Type
        </Button>
      </div>

      {/* Search Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              placeholder="Search by name..."
              value={searchInputs.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={searchInputs.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Telemedicine
            </label>
            <select
              value={searchInputs.isTelemedicineAvailable}
              onChange={(e) =>
                handleInputChange("isTelemedicineAvailable", e.target.value)
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Min Duration (min)
            </label>
            <Input
              type="number"
              placeholder="15"
              value={searchInputs.minDuration}
              onChange={(e) => handleInputChange("minDuration", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Max Duration (min)
            </label>
            <Input
              type="number"
              placeholder="60"
              value={searchInputs.maxDuration}
              onChange={(e) => handleInputChange("maxDuration", e.target.value)}
            />
          </div>
        </div>
        {hasActiveFilters && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredSessionTypes.length} of{" "}
              {sessionTypesData?.content?.length || 0} session types found
            </span>
            <Button onClick={clearSearch} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Session Types List */}
      <div className="mb-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading session types...</p>
          </div>
        ) : paginatedSessionTypes.length === 0 ? (
          <Card className="p-8 text-center">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {hasActiveFilters
                ? "No session types found matching your search criteria."
                : "No session types found. Create the first session type to get started."}
            </p>
            {!hasActiveFilters && (
              <Button onClick={handleCreateClick} className="mt-4">
                Add First Session Type
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSessionTypes.map((sessionType) => (
              <Card
                key={sessionType.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5 text-blue-500" />
                        {sessionType.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {sessionType.defaultDurationMinutes} minutes
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {role === "ADMIN" && (
                        <>
                          <Button
                            onClick={() => handleToggleStatus(sessionType)}
                            variant={
                              sessionType.isActive ? "outline" : "default"
                            }
                            size="sm"
                          >
                            {sessionType.isActive ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => handleEditClick(sessionType)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(sessionType)}
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
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sessionType.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sessionType.isActive ? "Active" : "Inactive"}
                      </span>
                      {sessionType.isTelemedicineAvailable && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Video className="h-3 w-3" />
                          Telemedicine
                        </span>
                      )}
                    </div>
                    {sessionType.description && (
                      <p className="text-sm text-gray-600">
                        {sessionType.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {paginatedSessionTypes.length} of {pagination.totalElements}{" "}
            session types
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, sessionType: null })}
        title="Delete Session Type"
        description={`Are you sure you want to delete "${deleteModal.sessionType?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default SessionTypesPage;
