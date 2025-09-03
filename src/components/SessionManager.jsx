import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  useGetAllSessions,
  useDeleteSession,
} from "../hooks/useSessionQueries.js";
import { useGetAllEnrichedDoctors } from "../hooks/useEnrichedDoctorQueries.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import useUserStore from "../store/useUserStore.js";
import { BookOpen, Plus, Search, Settings } from "lucide-react";

const SessionManager = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    item: null,
  });
  const { role } = useUserStore();

  // Search states for sessions
  const [sessionSearchInputs, setSessionSearchInputs] = useState({
    sessionType: "",
    doctor: "",
    minPrice: "",
    maxPrice: "",
  });

  // Fetch data for sessions
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useGetAllSessions({
    size: 1000,
  });

  // Mutations
  const deleteSession = useDeleteSession();

  const { data: doctorsData } = useGetAllEnrichedDoctors({ size: 100 });

  // Enrich sessions with doctor information
  const enrichedSessions = useMemo(() => {
    const allSessions = sessionsData?.content || [];
    const allDoctors = doctorsData?.data?.content || [];

    return allSessions.map((session) => {
      const doctor = allDoctors.find((d) => d.id === session.doctorId);
      return {
        ...session,
        doctor: doctor
          ? {
              id: doctor.id,
              name: `${doctor.firstName} ${doctor.lastName}`,
              speciality: doctor.speciality,
              email: doctor.email,
              phone: doctor.phone,
            }
          : null,
      };
    });
  }, [sessionsData?.content, doctorsData?.data?.content]);

  // Filter sessions based on search
  const filteredSessions = useMemo(() => {
    const { sessionType, doctor, minPrice, maxPrice } = sessionSearchInputs;

    if (!sessionType && !doctor && !minPrice && !maxPrice) {
      return enrichedSessions;
    }

    return enrichedSessions.filter((session) => {
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
  }, [enrichedSessions, sessionSearchInputs]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredSessions.slice(startIndex, startIndex + pageSize);
  }, [filteredSessions, currentPage, pageSize]);

  const pagination = useMemo(
    () => ({
      currentPage,
      totalPages: Math.ceil(filteredSessions.length / pageSize),
      totalElements: filteredSessions.length,
      size: pageSize,
    }),
    [filteredSessions.length, currentPage, pageSize]
  );

  // Handlers
  const handleDeleteClick = (item) => {
    setDeleteModal({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    const { item } = deleteModal;
    if (!item) return;

    try {
      await deleteSession.mutateAsync(item.id);
      setDeleteModal({ open: false, item: null });
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const clearSearch = () => {
    setSessionSearchInputs({
      sessionType: "",
      doctor: "",
      minPrice: "",
      maxPrice: "",
    });
    setCurrentPage(0);
  };

  const isLoading = sessionsLoading;
  const error = sessionsError;
  const hasActiveFilters = Object.values(sessionSearchInputs).some((v) => v);

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
          <Button onClick={() => refetchSessions()} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-1">
          <h1 className="text-2xl font-bold mr-6">Session Management</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/sessions/types")}
            className="flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Session Types
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/sessions/add")}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Session
          </Button>
        </div>
      </div>

      {/* Search/Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Search Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            {hasActiveFilters && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {filteredSessions.length} of {enrichedSessions.length || 0}{" "}
                  sessions found
                </span>
                <Button onClick={clearSearch} variant="outline" size="sm">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 flex items-center gap-2 mb-4">
        <span>
          Showing {paginatedData.length} of {pagination.totalElements} sessions
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
            Filtered from {enrichedSessions.length || 0} total
          </span>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate(`/sessions/${item.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {item.sessionType?.name || "Session"}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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

              <div
                className="flex gap-2 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/sessions/${item.id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(item)}
                >
                  Delete
                </Button>
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
              ? "No sessions found matching your criteria."
              : "No sessions found."}
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
        onOpenChange={(open) => setDeleteModal({ open, item: null })}
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

export default SessionManager;
