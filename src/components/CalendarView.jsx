import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useWindowSize } from "../hooks/useWindowSize";

const CalendarView = ({
  appointments,
  availabilities,
  filteredAvailabilities,
  selectedDoctor,
  selectedDate,
  onDateChange,
  onDoctorChange,
  doctors = [],
  onTimeSlotClick,
  onDateClick,
  showAppointmentModal = false,
  setShowAppointmentModal = () => {},
  selectedTimeSlot = null,
  setSelectedTimeSlot = () => {},
}) => {
  const [view, setView] = useState("today");
  const [internalCurrentDate, setInternalCurrentDate] = useState(
    new Date("2025-08-17T11:52:00")
  );
  const { width } = useWindowSize();
  const isMobile = width < 768;

  // Use selectedDate if available, otherwise use internal state
  const currentDate = selectedDate
    ? new Date(selectedDate)
    : internalCurrentDate;

  useEffect(() => {
    if (isMobile) {
      setView("today");
    }
  }, [isMobile]);

  const today = new Date("2025-08-17T11:52:00");

  // Helper function to format date as YYYY-MM-DD using local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to generate time slots from availability data
  const generateTimeSlotsFromAvailability = (availabilities) => {
    const availableSlots = new Set();
    availabilities.forEach((availability) => {
      if (availability.durations) {
        availability.durations.forEach((duration) => {
          if (duration.startTime && duration.endTime) {
            const start = new Date(`2000-01-01T${duration.startTime}`);
            let end = new Date(`2000-01-01T${duration.endTime}`);

            // Handle case where end time is earlier than start time (crosses midnight)
            if (end < start) {
              const endHour = parseInt(duration.endTime.split(":")[0]);
              if (
                endHour < 12 &&
                endHour < parseInt(duration.startTime.split(":")[0])
              ) {
                // This looks like it should be PM, not AM
                const correctedEndTime = duration.endTime.replace(
                  /^(\d{1,2}):/,
                  (match, hour) => {
                    const correctedHour = parseInt(hour) + 12;
                    return `${correctedHour.toString().padStart(2, "0")}:`;
                  }
                );
                end = new Date(`2000-01-01T${correctedEndTime}`);
              } else {
                end.setDate(end.getDate() + 1);
              }
            }

            while (start < end) {
              availableSlots.add(start.toTimeString().slice(0, 5));
              start.setMinutes(start.getMinutes() + 30);
            }
          }
        });
      }
    });
    return Array.from(availableSlots).sort();
  };

  // Helper function to check if a time slot is available
  const isTimeSlotAvailable = (time, availabilities) => {
    if (!availabilities || availabilities.length === 0) return false;

    return availabilities.some((availability) =>
      availability.durations?.some((duration) => {
        if (!duration.startTime || !duration.endTime) return false;
        const slotTime = new Date(`2000-01-01T${time}`);
        const startTime = new Date(`2000-01-01T${duration.startTime}`);
        let endTime = new Date(`2000-01-01T${duration.endTime}`);

        if (endTime < startTime) {
          const endHour = parseInt(duration.endTime.split(":")[0]);
          if (
            endHour < 12 &&
            endHour < parseInt(duration.startTime.split(":")[0])
          ) {
            const correctedEndTime = duration.endTime.replace(
              /^(\d{1,2}):/,
              (match, hour) => {
                const correctedHour = parseInt(hour) + 12;
                return `${correctedHour.toString().padStart(2, "0")}:`;
              }
            );
            endTime = new Date(`2000-01-01T${correctedEndTime}`);
          } else {
            endTime.setDate(endTime.getDate() + 1);
          }
        }
        return slotTime >= startTime && slotTime < endTime;
      })
    );
  };

  const handlePrev = () => {
    if (view === "weekly") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setInternalCurrentDate(newDate);
      // Clear selectedDate when navigating to show the navigation effect
      if (onDateChange) onDateChange(null);
    } else if (view === "monthly") {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setInternalCurrentDate(newDate);
      // Clear selectedDate when navigating to show the navigation effect
      if (onDateChange) onDateChange(null);
    }
  };

  const handleNext = () => {
    if (view === "weekly") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setInternalCurrentDate(newDate);
      // Clear selectedDate when navigating to show the navigation effect
      if (onDateChange) onDateChange(null);
    } else if (view === "monthly") {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setInternalCurrentDate(newDate);
      // Clear selectedDate when navigating to show the navigation effect
      if (onDateChange) onDateChange(null);
    }
  };

  const renderToolbar = () => (
    <div className="hidden md:flex justify-center items-center mb-6 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg">
      <div className="flex space-x-2 bg-white/20 backdrop-blur-md border border-white/30 p-1 rounded-md shadow-lg">
        {["today", "weekly", "monthly"].map((viewType) => (
          <button
            key={viewType}
            onClick={() => setView(viewType)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              view === viewType
                ? "bg-blue-500 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const renderFilters = () => {
    if (!onDateChange && !onDoctorChange) return null;

    return (
      <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {onDateChange && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={selectedDate || formatLocalDate(new Date())}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white/80 backdrop-blur-md"
              />
            </div>
          )}
          {onDoctorChange && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Doctor
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-white/80 backdrop-blur-md"
                value={selectedDoctor || ""}
                onChange={(e) => onDoctorChange(e.target.value)}
              >
                <option value="">All Doctors</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-end">
            <button
              onClick={() =>
                onDateChange &&
                onDateChange(formatLocalDate(new Date()))
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTodayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
    const displayDate = selectedDate ? new Date(selectedDate) : today;

    // Generate time slots based on availability if provided
    const timeSlots =
      filteredAvailabilities && filteredAvailabilities.length > 0
        ? generateTimeSlotsFromAvailability(filteredAvailabilities)
        : [];

    const handlePrevDay = () => {
      if (onDateChange) {
        const prevDate = new Date(displayDate);
        prevDate.setDate(prevDate.getDate() - 1);
                        onDateChange(formatLocalDate(prevDate));
      }
    };

    const handleNextDay = () => {
      if (onDateChange) {
        const nextDate = new Date(displayDate);
        nextDate.setDate(nextDate.getDate() + 1);
                        onDateChange(formatLocalDate(nextDate));
      }
    };

    return (
      <div className="bg-white/20 backdrop-blur-md border border-white/30 dark:bg-gray-800/20 dark:border-gray-700/30 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          {onDateChange && (
            <button
              onClick={handlePrevDay}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <ChevronLeft />
            </button>
          )}
          <h3 className="text-lg font-semibold text-center flex-1">
            {displayDate.toDateString()}
          </h3>
          {onDateChange && (
            <button
              onClick={handleNextDay}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <ChevronRight />
            </button>
          )}
        </div>
        {((filteredAvailabilities && filteredAvailabilities.length === 0) ||
          timeSlots.length === 0) &&
          selectedDoctor && (
            <div className="text-center py-8 mb-4">
              <div className="text-gray-500 text-lg mb-2">
                No slots available for today.
              </div>
              <div className="text-gray-400 text-sm">
                Please add doctor's availability in timing section.
              </div>
            </div>
          )}
        {timeSlots.length > 0 && (
          <div className="space-y-4">
            {timeSlots.map((time) => {
              const hour = parseInt(time.split(":")[0]);
              const isAvailable = filteredAvailabilities
                ? isTimeSlotAvailable(time, filteredAvailabilities)
                : true;
              const appointment = appointments?.upcoming?.find(
                (a) => a.time === time
              );

              return (
                <div
                  key={time}
                  className="flex border-t border-gray-200 dark:border-gray-700 pt-2"
                >
                  <div className="w-16 text-right pr-4 text-sm text-gray-500">
                    {`${hour % 12 === 0 ? 12 : hour % 12}:${
                      time.split(":")[1]
                    } ${hour < 12 ? "AM" : "PM"}`}
                  </div>
                  <div className="flex-1 pl-4 border-l border-gray-200 dark:border-gray-700">
                    {appointment ? (
                      <div className="text-xs bg-blue-100 dark:bg-blue-900 p-1 rounded mb-1">
                        {appointment.patientName} at {appointment.time}
                      </div>
                    ) : (
                      <div
                        className={`text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 ${
                          isAvailable
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
                        }`}
                        onClick={() => {
                          if (isAvailable && onTimeSlotClick) {
                            onTimeSlotClick(time);
                          }
                        }}
                      >
                        {isAvailable ? "Available" : "Not Available"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div className="bg-white/20 backdrop-blur-md border border-white/30 dark:bg-gray-800/20 dark:border-gray-700/30 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <ChevronLeft />
          </button>
          <h3 className="text-lg font-semibold">
            {startOfWeek.toLocaleString("default", { month: "long" })}{" "}
            {startOfWeek.getFullYear()}
          </h3>
          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600 dark:text-gray-300">
          {weekDays.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-700">
          {days.map((day) => {
            const dayOfWeek = day.getDay();
            const backendDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
            const dayAvailabilities = availabilities
              ? availabilities.filter(
                  (availability) =>
                    availability.dayOfWeek === backendDayOfWeek &&
                    availability.active &&
                    availability.durations &&
                    availability.durations.length > 0
                )
              : [];
            const hasAvailability = dayAvailabilities.length > 0;

            return (
              <div
                key={day.toISOString()}
                className={`p-2 h-24 border-r border-b border-gray-200 dark:border-gray-700 relative ${
                  day.toDateString() === today.toDateString()
                    ? "bg-blue-50 dark:bg-blue-900/50"
                    : ""
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    day.getMonth() !== currentDate.getMonth()
                      ? "text-gray-400"
                      : ""
                  }`}
                >
                  {day.getDate()}
                </span>
                {selectedDoctor && hasAvailability && (
                  <div
                    className="mt-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
                    onClick={() =>
                      onDateClick &&
                      onDateClick(formatLocalDate(day))
                    }
                    title={(() => {
                      const dayTimeSlots =
                        generateTimeSlotsFromAvailability(dayAvailabilities);
                      return dayTimeSlots.join(", ");
                    })()}
                  >
                    {(() => {
                      const dayTimeSlots =
                        generateTimeSlotsFromAvailability(dayAvailabilities);
                      const displaySlots = dayTimeSlots.slice(0, 4); // Show first 4 slots
                      const slotsText = displaySlots.join(", ");
                      return (
                        <div className="text-green-600 dark:text-green-400">
                          {slotsText}
                          {dayTimeSlots.length > 4 && (
                            <span className="text-gray-500">
                              {" "}
                              +{dayTimeSlots.length - 4} more
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
                {selectedDoctor && !hasAvailability && (
                  <div className="mt-2 text-xs text-gray-400">No slots</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    console.log("renderMonthlyView called - currentDate:", currentDate);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Always use currentDate for calendar grid generation (for navigation)
    const gridDate = currentDate;
    console.log(
      "Monthly View - selectedDate:",
      selectedDate,
      "currentDate:",
      currentDate,
      "gridDate:",
      gridDate
    );

    const firstDay = new Date(gridDate.getFullYear(), gridDate.getMonth(), 1);
    const lastDay = new Date(
      gridDate.getFullYear(),
      gridDate.getMonth() + 1,
      0
    );
    const daysInMonth = lastDay.getDate();
    const startDayIndex = firstDay.getDay();

    const calendarDays = [];

    // Add previous month's days
    const prevMonth = new Date(
      gridDate.getFullYear(),
      gridDate.getMonth() - 1,
      0
    );
    const prevMonthDays = prevMonth.getDate();
    const prevMonthYear =
      gridDate.getMonth() === 0
        ? gridDate.getFullYear() - 1
        : gridDate.getFullYear();
    const prevMonthIndex =
      gridDate.getMonth() === 0 ? 11 : gridDate.getMonth() - 1;

    for (let i = 0; i < startDayIndex; i++) {
      const day = prevMonthDays - startDayIndex + i + 1;
      calendarDays.push({
        key: `prev-${i}`,
        day: day,
        isCurrentMonth: false,
        month: prevMonthIndex,
        year: prevMonthYear,
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        key: `current-${i}`,
        day: i,
        isCurrentMonth: true,
        month: gridDate.getMonth(),
        year: gridDate.getFullYear(),
      });
    }

    // Add next month's days
    const nextMonthYear =
      gridDate.getMonth() === 11
        ? gridDate.getFullYear() + 1
        : gridDate.getFullYear();
    const nextMonthIndex =
      gridDate.getMonth() === 11 ? 0 : gridDate.getMonth() + 1;
    let nextDay = 1;
    while (calendarDays.length % 7 !== 0) {
      calendarDays.push({
        key: `next-${calendarDays.length}`,
        day: nextDay,
        isCurrentMonth: false,
        month: nextMonthIndex,
        year: nextMonthYear,
      });
      nextDay++;
    }

    return (
      <div className="bg-white/20 backdrop-blur-md border border-white/30 dark:bg-gray-800/20 dark:border-gray-700/30 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <ChevronLeft />
          </button>
          <h3 className="text-lg font-semibold">
            {monthNames[gridDate.getMonth()]} {gridDate.getFullYear()}
          </h3>
          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600 dark:text-gray-300">
          {weekDays.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-700">
          {calendarDays.map((d) => {
            if (!d.day) {
              return (
                <div
                  key={d.key}
                  className="p-2 h-24 border-r border-b border-gray-200 dark:border-gray-700"
                >
                  <span className="text-xs font-medium text-gray-400">
                    {d.day}
                  </span>
                </div>
              );
            }

            // Create a date object for this day
            const dayDate = new Date(
              d.year || currentDate.getFullYear(),
              d.month !== undefined ? d.month : currentDate.getMonth(),
              d.day
            );


            const dayOfWeek = dayDate.getDay();
            const backendDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
            const dayAvailabilities = availabilities
              ? availabilities.filter(
                  (availability) =>
                    availability.dayOfWeek === backendDayOfWeek &&
                    availability.active &&
                    availability.durations &&
                    availability.durations.length > 0
                )
              : [];
            const hasAvailability = dayAvailabilities.length > 0;

            return (
              <div
                key={d.key}
                className={`p-2 h-24 border-r border-b border-gray-200 dark:border-gray-700 relative ${
                  d.day === today.getDate() && d.isCurrentMonth
                    ? "bg-blue-50 dark:bg-blue-900/50"
                    : ""
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    !d.isCurrentMonth ? "text-gray-400" : ""
                  }`}
                >
                  {d.day}
                </span>
                {selectedDoctor && hasAvailability && (
                  <div
                    className="mt-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
                    onClick={() => {
                      const dateString = formatLocalDate(dayDate);

                      onDateClick && onDateClick(dateString);
                    }}
                    title={(() => {
                      const dayTimeSlots =
                        generateTimeSlotsFromAvailability(dayAvailabilities);
                      return dayTimeSlots.join(", ");
                    })()}
                  >
                    {(() => {
                      const dayTimeSlots =
                        generateTimeSlotsFromAvailability(dayAvailabilities);
                      const displaySlots = dayTimeSlots.slice(0, 3); // Show first 3 slots for monthly view
                      const slotsText = displaySlots.join(", ");
                      return (
                        <div className="text-green-600 dark:text-green-400">
                          {slotsText}
                          {dayTimeSlots.length > 3 && (
                            <span className="text-gray-500">
                              {" "}
                              +{dayTimeSlots.length - 3} more
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
                {selectedDoctor && !hasAvailability && (
                  <div className="mt-2 text-xs text-gray-400">No slots</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12">
      {renderFilters()}
      {renderToolbar()}
      {view === "today" && renderTodayView()}
      {!isMobile && view === "weekly" && renderWeeklyView()}
      {!isMobile && view === "monthly" && renderMonthlyView()}
    </div>
  );
};

export default CalendarView;
