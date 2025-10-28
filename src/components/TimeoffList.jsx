import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { timeoffService } from "../services/timeoffService.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import {
  format,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import { cn } from "../lib/utils.js";

const TimeoffList = ({
  doctorId,
  timeoffs = [],
  isLoading = false,
  onEdit,
  onAdd,
  showActions = true,
  showFilters = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("startDate");

  const queryClient = useQueryClient();

  const deleteTimeOffMutation = useMutation({
    mutationFn: ({ timeOffId }) =>
      timeoffService.deleteTimeOff(doctorId, timeOffId),
    onSuccess: () => {
      queryClient.invalidateQueries(["timeoffs", doctorId]);
      queryClient.refetchQueries(["timeoffs", doctorId]);
    },
  });

  const cancelTimeOffMutation = useMutation({
    mutationFn: ({ timeOffId }) =>
      timeoffService.cancelTimeOff(doctorId, timeOffId),
    onSuccess: () => {
      queryClient.invalidateQueries(["timeoffs", doctorId]);
      queryClient.refetchQueries(["timeoffs", doctorId]);
    },
  });

  // Filter and search timeoffs
  const filteredTimeoffs = timeoffs
    .filter((timeoff) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          timeoff.description?.toLowerCase().includes(searchLower) ||
          timeoff.reason?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "startDate":
          return new Date(a.startDatetime) - new Date(b.startDatetime);
        case "endDate":
          return new Date(a.endDatetime) - new Date(b.endDatetime);
        case "createdAt":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

  const getTimeStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isToday(start)) return "today";
    if (isTomorrow(start)) return "tomorrow";
    if (isYesterday(start)) return "yesterday";
    if (isBefore(end, now)) return "past"; // Changed to check end date for past status
    if (isAfter(start, now)) return "upcoming";
    return "current";
  };

  const isPastTimeOff = (startDate, endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    return isBefore(end, now);
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const isSameDay = start.toDateString() === end.toDateString();

    if (isSameDay) {
      return format(start, "MMM dd, yyyy 'at' h:mm a");
    } else {
      return `${format(start, "MMM dd")} - ${format(end, "MMM dd, yyyy")}`;
    }
  };

  const handleDelete = (timeOffId, description) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      deleteTimeOffMutation.mutate({ timeOffId });
    }
  };

  const handleCancel = (timeOffId, description) => {
    if (window.confirm(`Are you sure you want to cancel "${description}"?`)) {
      cancelTimeOffMutation.mutate({ timeOffId });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading time offs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Time Off Requests
          </CardTitle>
          {showActions && onAdd && (
            <Button onClick={onAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Time Off
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        {showFilters && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search time offs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="startDate">Sort by Start Date</option>
                <option value="endDate">Sort by End Date</option>
                <option value="createdAt">Sort by Created Date</option>
              </select>
            </div>
          </div>
        )}

        {/* Timeoff List */}
        {filteredTimeoffs.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No time offs found</p>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? "Try adjusting your search"
                : "No time off requests have been made yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTimeoffs.map((timeoff) => {
              const timeStatus = getTimeStatus(
                timeoff.startDatetime,
                timeoff.endDatetime
              );
              const isPast = isPastTimeOff(
                timeoff.startDatetime,
                timeoff.endDatetime
              );
              const canEdit = !isPast; // Only future timeoffs can be edited
              const canCancel = !isPast; // Only future timeoffs can be cancelled

              return (
                <div
                  key={timeoff.id}
                  className={cn(
                    "border rounded-lg p-4 transition-all hover:shadow-md",
                    timeStatus === "today" && "border-blue-200 bg-blue-50",
                    timeStatus === "tomorrow" &&
                      "border-yellow-200 bg-yellow-50",
                    timeStatus === "past" && "border-gray-200 bg-gray-50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg">
                          {timeoff.description}
                        </h3>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatDateRange(
                              timeoff.startDatetime,
                              timeoff.endDatetime
                            )}
                          </span>
                        </div>

                        {timeoff.reason && (
                          <p className="text-gray-700">{timeoff.reason}</p>
                        )}

                        {timeoff.emergencyContact && (
                          <p className="text-sm">
                            <span className="font-medium">
                              Emergency Contact:
                            </span>{" "}
                            {timeoff.emergencyContact}
                          </p>
                        )}

                        {timeoff.recurrenceRule && (
                          <p className="text-sm">
                            <span className="font-medium">Recurrence:</span>{" "}
                            {timeoff.recurrenceRule}
                          </p>
                        )}

                        {timeoff.isAvailable && (
                          <Badge variant="outline" className="text-xs">
                            Special Availability
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {showActions && (
                      <div className="flex items-center gap-2 ml-4">
                        {onEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(timeoff)}
                            disabled={!canEdit}
                            className="h-8 w-8 p-0"
                            title={
                              !canEdit
                                ? "Cannot edit past time offs"
                                : "Edit time off"
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleCancel(timeoff.id, timeoff.description)
                          }
                          disabled={!canCancel}
                          className="h-8 w-8 p-0"
                          title={
                            !canCancel
                              ? "Cannot cancel past time offs"
                              : "Cancel time off"
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(timeoff.id, timeoff.description)
                          }
                          disabled={isPast}
                          className="h-8 w-8 p-0"
                          title={
                            isPast
                              ? "Cannot delete past time offs"
                              : "Delete time off"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeoffList;
