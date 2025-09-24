import React, { useState, useMemo } from "react";
import {  useNavigate  } from "@tanstack/react-router";
import {
  useDeleteSession,
  useActivateSession,
  useDeactivateSession,
} from "../hooks/useSessionQueries.js";
import { useGetAllEnrichedSessions } from "../hooks/useEnrichedSessionQueries.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import useUserStore from "../store/useUserStore.js";
import { useBranchFilter } from "../hooks/useBranchFilter.js";
import { useState, useMemo } from "react";

const SessionsList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    session: null,
  });
  const { role } = useUserStore();

  // Get the effective branch ID for filtering
  const { branchId, hasSelection } = useBranchFilter();

  // Client-side search state
  const [searchInputs, setSearchInputs] = useState({
    sessionType: "",
    doctor: "",
    minPrice: "",
    maxPrice: "",
    status: "active", // Default to active sessions
  });

  // Fetch enriched sessions - already includes doctor and practice details
  const { data, isLoading, error, refetch } = useGetAllEnrichedSessions(
    {
      size: 1000, // Fetch all for client-side filtering
      ...(branchId && { branchId }), // Only include branchId if it's not null
    },
    {
      enabled: hasSelection, // Fetch when we have a selection (including "all")
    }
  );

  // Mutations
  const deleteSession = useDeleteSession();
  const activateSession = useActivateSession();
  const deactivateSession = useDeactivateSession();

  // Client-side filtering
  const filteredSessions = useMemo(() => {
    const allSessions = data?.content || [];

    if (
      !searchInputs.sessionType &&
      !searchInputs.doctor &&
      !searchInputs.minPrice &&
      !searchInputs.maxPrice &&
      !searchInputs.status
    ) {
      return allSessions;
    }

    return allSessions.filter((session) => {
      // Session type filter
      if (searchInputs.sessionType) {
        const typeMatch = session.sessionType?.name
          ?.toLowerCase()
          .includes(searchInputs.sessionType.toLowerCase());
        if (!typeMatch) return false;
      }

      // Doctor filter
      if (searchInputs.doctor) {
        const doctorMatch = session.doctor?.name
          ?.toLowerCase()
          .includes(searchInputs.doctor.toLowerCase());
        if (!doctorMatch) return false;
      }

      // Price filters
      if (searchInputs.minPrice) {
        const minPrice = parseFloat(searchInputs.minPrice);
        if (session.price < minPrice) return false;
      }

      if (searchInputs.maxPrice) {
        const maxPrice = parseFloat(searchInputs.maxPrice);
        if (session.price > maxPrice) return false;
      }

      // Status filter
      if (searchInputs.status) {
        if (searchInputs.status === "active" && !session.isActive) return false;
        if (searchInputs.status === "inactive" && session.isActive)
          return false;
      }

      return true;
    });
  }, [data?.content, searchInputs]);

  // Client-side pagination
  const paginatedSessions = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredSessions.slice(startIndex, endIndex);
  }, [filteredSessions, currentPage, pageSize]);

  // Pagination info
  const pagination = useMemo(
    () => ({
      currentPage,
      totalPages: Math.ceil(filteredSessions.length / pageSize),
      totalElements: filteredSessions.length,
      size: pageSize,
    }),
    [filteredSessions.length, currentPage, pageSize]
  );

  const clearSearch = () => {
    setSearchInputs({
      sessionType: "",
      doctor: "",
      minPrice: "",
      maxPrice: "",
      status: "active", // Reset to active
    });
    setCurrentPage(0);
  };

  const handleDeleteClick = (session) => {
    setDeleteModal({ open: true, session });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.session) {
      try {
        await deleteSession.mutateAsync(deleteModal.session.id);
        setDeleteModal({ open: false, session: null });
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    }
  };

  const handleToggleActive = (session) => {
    if (session.isActive) {
      deactivateSession.mutate(session.id);
    } else {
      activateSession.mutate(session.id);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleInputChange = (field, value) => {
    setSearchInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading sessions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Session Access Issue
          </h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">This might be due to:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Backend authorization requirements</li>
              <li>Missing doctor association</li>
              <li>Service configuration issues</li>
            </ul>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
            <Button
              onClick={() => navigate({ to: "/session-types" })}
              variant="default"
            >
              Manage Session Types Instead
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const doctors = doctorsData?.data?.content || [];
  const hasActiveFilters = Object.values(searchInputs).some((v) => v);

  return (
    <div className="p-6 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Session Offerings</h1>
        <Button onClick={() => navigate({ to: "/sessions/add" })}>
          Add New Session
        </Button>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search Sessions (Instant Results)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Session Type
                </label>
                <Input
                  name="sessionType"
                  placeholder="Search by session type..."
                  value={searchInputs.sessionType}
                  onChange={(e) =>
                    handleInputChange("sessionType", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Doctor</label>
                <Input
                  name="doctor"
                  placeholder="Search by doctor name..."
                  value={searchInputs.doctor}
                  onChange={(e) => handleInputChange("doctor", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border rounded-md"
                  value={searchInputs.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="all">All Sessions</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Min Price
                </label>
                <Input
                  name="minPrice"
                  type="number"
                  step="0.01"
                  placeholder="Minimum price"
                  value={searchInputs.minPrice}
                  onChange={(e) =>
                    handleInputChange("minPrice", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Price
                </label>
                <Input
                  name="maxPrice"
                  type="number"
                  step="0.01"
                  placeholder="Maximum price"
                  value={searchInputs.maxPrice}
                  onChange={(e) =>
                    handleInputChange("maxPrice", e.target.value)
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
          Showing {paginatedSessions.length} of {pagination.totalElements}{" "}
          sessions
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
            Filtered from {data?.content?.length || 0} total
          </span>
        )}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {session.sessionType?.name || "Session"}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        session.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {session.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Doctor:</strong> {session.doctor?.name || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Practice:</strong> {session.practice?.name || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Price:</strong>
                  <span
                    className={
                      hasActiveFilters &&
                      (searchInputs.minPrice || searchInputs.maxPrice)
                        ? "bg-green-100 px-1 rounded"
                        : ""
                    }
                  >
                    ${session.price}
                  </span>
                </p>
                <p className="text-sm">
                  <strong>Duration:</strong>{" "}
                  {session.sessionType?.defaultDurationMinutes || "N/A"} mins
                </p>
                <p className="text-sm">
                  <strong>Mode:</strong>{" "}
                  {session.sessionType?.isTelemedicineAvailable
                    ? "Telemedicine"
                    : "In-person"}
                </p>
                {session.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {session.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: `/sessions/${session.id}` })}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: `/sessions/${session.id}/edit` })}
                >
                  Edit
                </Button>
                {session.isActive ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(session)}
                  >
                    Delete
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleToggleActive(session)}
                    disabled={activateSession.isPending}
                  >
                    {activateSession.isPending ? "Activating..." : "Activate"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {paginatedSessions.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            {hasActiveFilters
              ? "No sessions found matching your search criteria."
              : "No sessions found."}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, session: null })}
        title="Delete Session"
        description="Are you sure you want to delete this session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default SessionsList;
