import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
  addMonths,
  subMonths,
} from "date-fns";
import { cn } from "../lib/utils.js";

const TimeoffCalendar = ({
  timeoffs = [],
  onDateClick,
  onTimeoffClick,
  currentMonth = new Date(),
  onMonthChange,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get timeoffs for the current month
  const monthTimeoffs = useMemo(() => {
    return timeoffs.filter((timeoff) => {
      const start = new Date(timeoff.startDatetime);
      const end = new Date(timeoff.endDatetime);
      return (
        (start >= monthStart && start <= monthEnd) ||
        (end >= monthStart && end <= monthEnd) ||
        (start <= monthStart && end >= monthEnd)
      );
    });
  }, [timeoffs, monthStart, monthEnd]);

  // Get timeoffs for a specific date
  const getTimeoffsForDate = (date) => {
    return monthTimeoffs.filter((timeoff) => {
      const start = new Date(timeoff.startDatetime);
      const end = new Date(timeoff.endDatetime);
      return (
        isSameDay(start, date) ||
        isSameDay(end, date) ||
        (start < date && end > date)
      );
    });
  };

  // Get status color for timeoff
  const getTimeoffStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 border-yellow-300 text-yellow-800",
      APPROVED: "bg-green-100 border-green-300 text-green-800",
      REJECTED: "bg-red-100 border-red-300 text-red-800",
      CANCELLED: "bg-gray-100 border-gray-300 text-gray-800",
      ACTIVE: "bg-blue-100 border-blue-300 text-blue-800",
      COMPLETED: "bg-purple-100 border-purple-300 text-purple-800",
    };
    return colors[status] || colors.PENDING;
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      PENDING: Clock,
      APPROVED: CheckCircle,
      REJECTED: XCircle,
      CANCELLED: XCircle,
      ACTIVE: CheckCircle,
      COMPLETED: CheckCircle,
    };
    return icons[status] || Clock;
  };

  // Navigate months
  const goToPreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    onMonthChange?.(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    onMonthChange?.(newMonth);
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    onMonthChange?.(today);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateClick?.(date);
  };

  const handleTimeoffClick = (timeoff, event) => {
    event.stopPropagation();
    onTimeoffClick?.(timeoff);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Time Off Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day) => {
            const dayTimeoffs = getTimeoffsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);
            const isSelected = isSameDay(day, selectedDate);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[100px] p-2 border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50",
                  !isCurrentMonth && "bg-gray-50 text-gray-400",
                  isTodayDate && "bg-blue-50 border-blue-200",
                  isSelected && "bg-blue-100 border-blue-300"
                )}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isTodayDate && "text-blue-600 font-bold"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayTimeoffs.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayTimeoffs.length}
                    </Badge>
                  )}
                </div>

                {/* Timeoffs for this day */}
                <div className="space-y-1">
                  {dayTimeoffs.slice(0, 2).map((timeoff) => {
                    const StatusIcon = getStatusIcon(timeoff.status);
                    return (
                      <div
                        key={timeoff.id}
                        className={cn(
                          "text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow",
                          getTimeoffStatusColor(timeoff.status)
                        )}
                        onClick={(e) => handleTimeoffClick(timeoff, e)}
                      >
                        <div className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          <span className="truncate">
                            {timeoff.description}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {dayTimeoffs.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayTimeoffs.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Status Legend</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { status: "PENDING", label: "Pending" },
              { status: "APPROVED", label: "Approved" },
              { status: "REJECTED", label: "Rejected" },
              { status: "CANCELLED", label: "Cancelled" },
              { status: "ACTIVE", label: "Active" },
              { status: "COMPLETED", label: "Completed" },
            ].map(({ status, label }) => {
              const StatusIcon = getStatusIcon(status);
              return (
                <div
                  key={status}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded text-xs border",
                    getTimeoffStatusColor(status)
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Info */}
        {selectedDate && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium mb-2">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h4>
            {getTimeoffsForDate(selectedDate).length > 0 ? (
              <div className="space-y-2">
                {getTimeoffsForDate(selectedDate).map((timeoff) => (
                  <div
                    key={timeoff.id}
                    className={cn(
                      "p-3 rounded border cursor-pointer hover:shadow-sm transition-shadow",
                      getTimeoffStatusColor(timeoff.status)
                    )}
                    onClick={() => onTimeoffClick?.(timeoff)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{timeoff.description}</h5>
                        <p className="text-xs opacity-75">
                          {format(new Date(timeoff.startDatetime), "h:mm a")} -{" "}
                          {format(new Date(timeoff.endDatetime), "h:mm a")}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {timeoff.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No time offs scheduled for this date
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeoffCalendar;


