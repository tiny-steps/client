import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  useGetAllSessionTypes,
  useDeleteSession,
  useDeleteSessionType,
  useActivateSession,
  useDeactivateSession,
  useActivateSessionType,
  useDeactivateSessionType,
  useReactivateSession,
  useReactivateSessionType,
} from "../hooks/useSessionQueries.js";
import { useGetAllEnrichedSessions } from "../hooks/useEnrichedSessionQueries.js";
import { useBranchFilter } from "../hooks/useBranchFilter.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import useUserStore from "../store/useUserStore.js";
import { BookOpen, Settings, Plus, Search, Filter } from "lucide-react";
import SessionTypeForm from "./forms/SessionTypeForm.jsx";
import { useState, useMemo } from "react";

const UnifiedSessionManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sessions"); // 'sessions' or 'session-types'
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    item: null,
    type: null,
  });
  const [showSessionTypeForm, setShowSessionTypeForm] = useState(false);
  const { role } = useUserStore();

  // Get the effective branch ID for filtering
  const { branchId, hasSelection } = useBranchFilter();

  // Search states for both tabs
  const [sessionSearchInputs, setSessionSearchInputs] = useState({
    sessionType: "",
    doctor: "",
    minPrice: "",
    maxPrice: "",
  });

  const [sessionTypeSearchInputs, setSessionTypeSearchInputs] = useState({
    name: "",
    isActive: "active", // Default to active
    isTelemedicineAvailable: "",
    minDuration: "",
    maxDuration: "",
  });

  // Fetch enriched sessions data
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useGetAllEnrichedSessions(
    {
      size: 1000,
      ...(branchId && { branchId }), // Only include branchId if it's not null
    },
    {
      enabled: hasSelection, // Fetch when we have a selection (including "all")
    }
  );

  const {
    data: sessionTypesData,
    isLoading: sessionTypesLoading,
    error: sessionTypesError,
    refetch: refetchSessionTypes,
  } = useGetAllSessionTypes(
    {
      size: 1000,
      ...(branchId && { branchId }), // Only include branchId if it's not null
    },
    {
      enabled: hasSelection, // Fetch when we have a selection (including "all")
    }
  );

  // Mutations
  const deleteSession = useDeleteSession();
  const deleteSessionType = useDeleteSessionType();
  const activateSession = useActivateSession();
  const deactivateSession = useDeactivateSession();
  const activateSessionType = useActivateSessionType();
  const deactivateSessionType = useDeactivateSessionType();
  const reactivateSession = useReactivateSession();
  const reactivateSessionType = useReactivateSessionType();

  // Sessions are already enriched, no need for additional doctor fetching

  // Filter sessions based on search
  const filteredSessions = useMemo(() => {
    const allSessions = sessionsData?.content || [];
    const { sessionType, doctor, minPrice, maxPrice } = sessionSearchInputs;

    if (!sessionType && !doctor && !minPrice && !maxPrice) {
      return allSessions;
    }

    return allSessions.filter((session) => {
      if (
        sessionType &&
        !session.sessionType?.name
          ?.toLowerCase()
          .includes(sessionType.toLowerCase())
      )
        return false;
      if (
        doctor &&
        !session.doctor?.name?.toLowerCase().includes(doctor.toLowerCase())
      )
        return false;
      if (minPrice && session.price < parseFloat(minPrice)) return false;
      if (maxPrice && session.price > parseFloat(maxPrice)) return false;
      return true;
    });
  }, [sessionsData?.content, sessionSearchInputs]);

  // Filter session types based on search
  const filteredSessionTypes = useMemo(() => {
    const allSessionTypes = sessionTypesData?.content || [];
    const {
      name,
      isActive,
      isTelemedicineAvailable,
      minDuration,
      maxDuration,
    } = sessionTypeSearchInputs;

    if (
      !name &&
      !isActive &&
      !isTelemedicineAvailable &&
      !minDuration &&
      !maxDuration
    ) {
      return allSessionTypes;
    }

    return allSessionTypes.filter((sessionType) => {
      if (name && !sessionType.name?.toLowerCase().includes(name.toLowerCase()))
        return false;
      if (isActive && isActive !== "all") {
        if (isActive === "active" && !sessionType.isActive) return false;
        if (isActive === "inactive" && sessionType.isActive) return false;
      }
      if (
        isTelemedicineAvailable &&
        sessionType.isTelemedicineAvailable !==
          (isTelemedicineAvailable === "true")
      )
        return false;
      if (
        minDuration &&
        sessionType.defaultDurationMinutes < parseInt(minDuration)
      )
        return false;
      if (
        maxDuration &&
        sessionType.defaultDurationMinutes > parseInt(maxDuration)
      )
        return false;
      return true;
    });
  }, [sessionTypesData?.content, sessionTypeSearchInputs]);

  // Pagination
  const currentData =
    activeTab === "sessions" ? filteredSessions : filteredSessionTypes;
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return currentData.slice(startIndex, startIndex + pageSize);
  }, [currentData, currentPage, pageSize]);

  const pagination = useMemo(
    () => ({
      currentPage,
      totalPages: Math.ceil(currentData.length / pageSize),
      totalElements: currentData.length,
      size: pageSize,
    }),
    [currentData.length, currentPage, pageSize]
  );

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const handleDeleteClick = (item, type) => {
    setDeleteModal({ open: true, item, type });
  };

  const handleDeleteConfirm = async () => {
    const { item, type } = deleteModal;
    if (!item) return;

    try {
      if (type === "session") {
        await deleteSession.mutateAsync(item.id);
      } else {
        await deleteSessionType.mutateAsync(item.id);
      }
      setDeleteModal({ open: false, item: null, type: null });
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  const handleToggleActive = async (item, type) => {
    try {
      if (type === "session") {
        if (item.isActive) {
          await deactivateSession.mutateAsync(item.id);
        } else {
          await activateSession.mutateAsync(item.id);
        }
      } else if (type === "session-type") {
        if (item.active) {
          await deactivateSessionType.mutateAsync(item.id);
        } else {
          await activateSessionType.mutateAsync(item.id);
        }
      }
    } catch (error) {
      console.error(`Failed to toggle ${type} status:`, error);
    }
  };

  const handleReactivate = async (item, type) => {
    try {
      if (type === "session") {
        await reactivateSession.mutateAsync(item.id);
      } else if (type === "session-type") {
        await reactivateSessionType.mutateAsync(item.id);
      }
    } catch (error) {
      console.error(`Failed to reactivate ${type}:`, error);
    }
  };

  const clearSearch = () => {
    if (activeTab === "sessions") {
      setSessionSearchInputs({
        sessionType: "",
        doctor: "",
        minPrice: "",
        maxPrice: "",
      });
    } else {
      setSessionTypeSearchInputs({
        name: "",
        isActive: "active", // Reset to active
        isTelemedicineAvailable: "",
        minDuration: "",
        maxDuration: "",
      });
    }
    setCurrentPage(0);
  };

  const isLoading =
    activeTab === "sessions" ? sessionsLoading : sessionTypesLoading;
  const error = activeTab === "sessions" ? sessionsError : sessionTypesError;
  const hasActiveFilters =
    activeTab === "sessions"
      ? Object.values(sessionSearchInputs).some((v) => v)
      : Object.values(sessionTypeSearchInputs).some((v) => v);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">
          Loading {activeTab === "sessions" ? "sessions" : "session types"}...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            {activeTab === "sessions" ? "Session" : "Session Type"} Access Issue
          </h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button
            onClick={() =>
              activeTab === "sessions"
                ? refetchSessions()
                : refetchSessionTypes()
            }
            variant="outline"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 h-full w-full">
      {/* Header with Tab Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-1">
          <h1 className="text-2xl font-bold mr-6">Session Management</h1>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleTabChange("sessions")}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "sessions"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Sessions
            </button>
            <button
              onClick={() => handleTabChange("session-types")}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "session-types"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Session Types
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {activeTab === "sessions" ? (
            <>
              <Button
                onClick={() => setShowSessionTypeForm(true)}
                variant="outline"
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Session Type
              </Button>
              <Button
                onClick={() => navigate("/sessions/add")}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Session
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setShowSessionTypeForm(true)}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Session Type
            </Button>
          )}
        </div>
      </div>

      {/* Search/Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Search {activeTab === "sessions" ? "Sessions" : "Session Types"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "sessions" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search by session type..."
                  value={sessionSearchInputs.sessionType}
                  onChange={(e) =>
                    setSessionSearchInputs((prev) => ({
                      ...prev,
                      sessionType: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Search by doctor name..."
                  value={sessionSearchInputs.doctor}
                  onChange={(e) =>
                    setSessionSearchInputs((prev) => ({
                      ...prev,
                      doctor: e.target.value,
                    }))
                  }
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Min price"
                  value={sessionSearchInputs.minPrice}
                  onChange={(e) =>
                    setSessionSearchInputs((prev) => ({
                      ...prev,
                      minPrice: e.target.value,
                    }))
                  }
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Max price"
                  value={sessionSearchInputs.maxPrice}
                  onChange={(e) =>
                    setSessionSearchInputs((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input
                  placeholder="Search by name..."
                  value={sessionTypeSearchInputs.name}
                  onChange={(e) =>
                    setSessionTypeSearchInputs((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <select
                  className="px-3 py-2 border rounded-md"
                  value={sessionTypeSearchInputs.isActive}
                  onChange={(e) =>
                    setSessionTypeSearchInputs((prev) => ({
                      ...prev,
                      isActive: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Session Types</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
                <select
                  className="px-3 py-2 border rounded-md"
                  value={sessionTypeSearchInputs.isTelemedicineAvailable}
                  onChange={(e) =>
                    setSessionTypeSearchInputs((prev) => ({
                      ...prev,
                      isTelemedicineAvailable: e.target.value,
                    }))
                  }
                >
                  <option value="">All Types</option>
                  <option value="true">Telemedicine</option>
                  <option value="false">In-Person Only</option>
                </select>
                <Input
                  type="number"
                  placeholder="Min duration"
                  value={sessionTypeSearchInputs.minDuration}
                  onChange={(e) =>
                    setSessionTypeSearchInputs((prev) => ({
                      ...prev,
                      minDuration: e.target.value,
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Max duration"
                  value={sessionTypeSearchInputs.maxDuration}
                  onChange={(e) =>
                    setSessionTypeSearchInputs((prev) => ({
                      ...prev,
                      maxDuration: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 items-center mt-4">
            <Button type="button" variant="outline" onClick={clearSearch}>
              Clear All
            </Button>
            {hasActiveFilters && (
              <div className="text-sm text-blue-600 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Filters active</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 flex items-center gap-2 mb-4">
        <span>
          Showing {paginatedData.length} of {pagination.totalElements}{" "}
          {activeTab === "sessions" ? "sessions" : "session types"}
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
            Filtered from{" "}
            {activeTab === "sessions"
              ? sessionsData?.content?.length || 0
              : sessionTypesData?.content?.length || 0}{" "}
            total
          </span>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() =>
              navigate(
                activeTab === "sessions"
                  ? `/sessions/${item.id}`
                  : `/session-types/${item.id}`
              )
            }
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {activeTab === "sessions"
                      ? item.sessionType?.name || "Session"
                      : item.name}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        (activeTab === "sessions" ? item.isActive : item.active)
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {(activeTab === "sessions" ? item.isActive : item.active)
                        ? "Active"
                        : "Inactive"}
                    </span>
                    {activeTab === "session-types" &&
                      item.isTelemedicineAvailable && (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Telemedicine
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === "sessions" ? (
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Doctor:</strong> {item.doctor?.name || "N/A"}
                  </p>
                  <p className="text-sm">
                    <strong>Practice:</strong> {item.practice?.name || "N/A"}
                  </p>
                  <p className="text-sm">
                    <strong>Price:</strong> ${item.price}
                  </p>
                  <p className="text-sm">
                    <strong>Duration:</strong>{" "}
                    {item.sessionType?.defaultDurationMinutes || "N/A"} mins
                  </p>
                  <p className="text-sm">
                    <strong>Mode:</strong>{" "}
                    {item.sessionType?.isTelemedicineAvailable
                      ? "Telemedicine"
                      : "In-person"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-sm">
                    <strong>Duration:</strong> {item.defaultDurationMinutes}{" "}
                    minutes
                  </p>
                </div>
              )}

              <div
                className="flex gap-2 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigate(
                      activeTab === "sessions"
                        ? `/sessions/${item.id}/edit`
                        : `/session-types/${item.id}/edit`
                    )
                  }
                >
                  Edit
                </Button>
                {(activeTab === "sessions" ? item.isActive : item.active) ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      handleDeleteClick(
                        item,
                        activeTab === "sessions" ? "session" : "session-type"
                      )
                    }
                  >
                    Delete
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() =>
                      handleToggleActive(
                        item,
                        activeTab === "sessions" ? "session" : "session-type"
                      )
                    }
                  >
                    Activate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            {hasActiveFilters
              ? `No ${
                  activeTab === "sessions" ? "sessions" : "session types"
                } found matching your criteria.`
              : `No ${
                  activeTab === "sessions" ? "sessions" : "session types"
                } found.`}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearSearch} className="mt-2">
              Clear Filters
            </Button>
          )}
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {currentPage + 1} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= pagination.totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) =>
          setDeleteModal({ open, item: null, type: null })
        }
        title={`Delete ${
          deleteModal.type === "session" ? "Session" : "Session Type"
        }`}
        description={`Are you sure you want to delete this ${
          deleteModal.type === "session" ? "session" : "session type"
        }? This action cannot be undone.`}
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
              <CardTitle className="text-gray-900">Add Session Type</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionTypeForm
                mode="create"
                onSuccess={() => {
                  setShowSessionTypeForm(false);
                  refetchSessionTypes();
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UnifiedSessionManager;
