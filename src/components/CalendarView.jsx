import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import AppointmentActions from "./AppointmentActions.jsx";
import {
  useGetTimeSlotsForWeek,
  useGetTimeSlotsForMonth,
} from "../hooks/useTimingBatchQueries.js";

const CalendarView = ({
  appointments,
  availabilities,
  filteredAvailabilities,
  timeSlots = [],
  availableTimeSlots = [],
  selectedDoctor,
  selectedDate,
  onDateChange,
  onDoctorChange,
  doctors = [],
  patients = [],
  onTimeSlotClick,
  onDateClick,
  showAppointmentModal = false,
  setShowAppointmentModal = () => {},
  selectedTimeSlot = null,
  setSelectedTimeSlot = () => {},
  onAppointmentClick = () => {},
  onDayDetailClick = () => {},
  branchId = null,
}) => {
  const [view, setView] = useState("today");
  const [internalCurrentDate, setInternalCurrentDate] = useState(
    new Date("2025-08-17T11:52:00")
  );
  const { width } = useWindowSize();
  const isMobile = width < 768;

  // Handler functions for Phase 2-4
  const handleAppointmentClick = (appointment) => {
    onAppointmentClick(appointment);
  };

  const handleDayClick = (date) => {
    console.log("DayDetailView clicked for date:", date);
    onDayDetailClick(date);
  };

  const handleCancelAppointment = (appointment) => {
    onCancelAppointment(appointment);
  };

  // Use selectedDate if available, otherwise use internal state
  const currentDate = selectedDate
    ? new Date(selectedDate)
    : internalCurrentDate;

  // Calculate week start for batch timeslots fetching
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Batch fetch timeslots for weekly view
  const weekStartDate = getWeekStart(currentDate);
  const { data: weekTimeSlotsData } = useGetTimeSlotsForWeek(
    selectedDoctor,
    weekStartDate,
    null, // practiceId
    branchId, // branchId
    { enabled: !!selectedDoctor && view === "weekly" }
  );

  // Batch fetch timeslots for monthly view
  const { data: monthTimeSlotsData } = useGetTimeSlotsForMonth(
    selectedDoctor,
    currentDate,
    null, // practiceId
    branchId, // branchId
    { enabled: !!selectedDoctor && view === "monthly" }
  );

  // Get timeslots map based on current view
  const getTimeSlotsForDate = (date) => {
    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0];

    if (view === "weekly" && weekTimeSlotsData?.data) {
      return weekTimeSlotsData.data[dateStr] || [];
    }

    if (view === "monthly" && monthTimeSlotsData?.data) {
      return monthTimeSlotsData.data[dateStr] || [];
    }

    // Fallback to single date timeslots for today view
    if (
      view === "today" &&
      timeSlots &&
      dateStr === (selectedDate || currentDate.toISOString().split("T")[0])
    ) {
      return timeSlots;
    }

    return [];
  };

  useEffect(() => {
    if (isMobile) {
      setView("today");
    }
  }, [isMobile]);

  const today = new Date("2025-08-17T11:52:00");

  // Helper function to format date as YYYY-MM-DD using local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
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
                : "text-gray-600 hover:bg-gray-200 :bg-gray-600"
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
              <label className="block text-sm font-medium mb-1 text-gray-700 ">
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
              <label className="block text-sm font-medium mb-1 text-gray-700 ">
                Doctor
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-white/80 backdrop-blur-md"
                value={selectedDoctor || ""}
                onChange={(e) => onDoctorChange(e.target.value)}
              >
                <option value="">Select Doctor</option>
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
                onDateChange && onDateChange(formatLocalDate(new Date()))
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

    // Use new time slots API if available, otherwise generate from availability
    const displayTimeSlots =
      timeSlots.length > 0
        ? timeSlots.map((slot) => slot.startTime.substring(0, 5)).sort()
        : filteredAvailabilities && filteredAvailabilities.length > 0
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
      <div className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          {onDateChange && (
            <button
              onClick={handlePrevDay}
              className="p-1 rounded-full hover:bg-gray-200 :bg-gray-600"
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
              className="p-1 rounded-full hover:bg-gray-200 :bg-gray-600"
            >
              <ChevronRight />
            </button>
          )}
        </div>
        {displayTimeSlots.length === 0 && selectedDoctor && (
          <div className="text-center py-8 mb-4">
            <div className="text-gray-500 text-lg mb-2">
              No slots available for today.
            </div>
            <div className="text-gray-400 text-sm">
              Please add doctor's availability in timing section.
            </div>
          </div>
        )}
        {displayTimeSlots.length > 0 && (
          <div className="space-y-4">
            {displayTimeSlots.map((time) => {
              const hour = parseInt(time.split(":")[0]);
              // Find appointment for this time slot and date
              const appointment = appointments?.find((a) => {
                // Convert appointment time from "10:30:00" to "10:30" format
                const appointmentTime = a.startTime?.substring(0, 5);
                return (
                  appointmentTime === time &&
                  a.appointmentDate === formatLocalDate(displayDate)
                );
              });
              const isAvailable =
                timeSlots.length > 0
                  ? timeSlots.some(
                      (slot) =>
                        slot.startTime.substring(0, 5) === time &&
                        slot.status === "available"
                    )
                  : filteredAvailabilities
                  ? isTimeSlotAvailable(time, filteredAvailabilities) &&
                    !appointment
                  : !appointment;

              return (
                <div key={time} className="flex border-t border-gray-200 pt-2">
                  <div className="w-16 text-right pr-4 text-sm text-gray-500">
                    {`${hour % 12 === 0 ? 12 : hour % 12}:${
                      time.split(":")[1]
                    } ${hour < 12 ? "AM" : "PM"}`}
                  </div>
                  <div className="flex-1 pl-4 border-l border-gray-200 ">
                    {appointment ? (
                      <div className="text-xs bg-red-100 text-red-800 p-1 rounded mb-1 max-w-full">
                        <div className="font-medium truncate text-xs">
                          {appointment.patientName}
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {appointment.doctorName} - {appointment.sessionName}
                        </div>
                        <div className="mt-2">
                          <AppointmentActions
                            appointment={appointment}
                            onView={onAppointmentClick}
                            size="sm"
                            className="justify-start"
                            patients={patients}
                            doctors={doctors}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 ${
                          isAvailable
                            ? "bg-green-100 text-green-800 "
                            : "bg-gray-100 text-gray-500 "
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
      <div className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-gray-200 :bg-gray-600"
          >
            <ChevronLeft />
          </button>
          <h3 className="text-lg font-semibold">
            {startOfWeek.toLocaleString("default", { month: "long" })}{" "}
            {startOfWeek.getFullYear()}
          </h3>
          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-gray-200 :bg-gray-600"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600 ">
          {weekDays.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-l border-gray-200 sm:text-sm text-xs">
          {days.map((day) => {
            const dayOfWeek = day.getDay();
            const backendDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

            // Get timeslots for this specific date using the efficient API
            const dayTimeSlotsFromAPI = getTimeSlotsForDate(day);
            const dayTimeSlots =
              dayTimeSlotsFromAPI.length > 0
                ? dayTimeSlotsFromAPI
                    .filter((slot) => slot.status === "available")
                    .map((slot) => slot.startTime.substring(0, 5))
                : [];

            // Fallback to availability logic if no time slots from API
            const dayAvailabilities =
              dayTimeSlots.length === 0 && availabilities
                ? availabilities.filter(
                    (availability) =>
                      availability.dayOfWeek === backendDayOfWeek &&
                      availability.active &&
                      availability.durations &&
                      availability.durations.length > 0
                  )
                : [];
            const hasAvailability =
              dayTimeSlots.length > 0 || dayAvailabilities.length > 0;

            return (
              <div
                key={day.toISOString()}
                className={`p-1 sm:p-2 h-16 sm:h-24 border-r border-b border-gray-200 relative ${
                  day.toDateString() === today.toDateString()
                    ? "bg-blue-50 "
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
                {(() => {
                  // Check for appointments first
                  const dayAppointments =
                    appointments?.filter(
                      (a) => a.appointmentDate === formatLocalDate(day)
                    ) || [];

                  if (dayAppointments.length > 0) {
                    // Show red dots for booked appointments
                    const allDayTimeSlots =
                      dayTimeSlots.length > 0
                        ? dayTimeSlots
                        : generateTimeSlotsFromAvailability(dayAvailabilities);
                    const totalSlots = allDayTimeSlots.length;
                    const availableCount = Math.max(
                      0,
                      allDayTimeSlots.length - dayAppointments.length
                    );

                    return (
                      <div className="mt-2">
                        {/* Slot count in top right */}
                        <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-xs font-medium text-gray-600 ">
                          {availableCount}/{totalSlots}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {dayAppointments.map((appointment, index) => (
                            <div
                              key={index}
                              className="w-2 h-2 bg-red-500 rounded-full cursor-pointer hover:scale-125 transition-transform"
                              title={`${
                                appointment.patientName
                              } - ${appointment.startTime?.substring(0, 5)}`}
                              onClick={() =>
                                handleDayClick(formatLocalDate(day))
                              }
                            />
                          ))}
                        </div>
                        <div className="flex space-x-1 sm:space-x-2 mt-1 sm:mt-2">
                          <button
                            className="text-xs sm:text-sm text-blue-600 cursor-pointer hover:underline"
                            onClick={() => handleDayClick(formatLocalDate(day))}
                          >
                            View Details
                          </button>
                          {availableCount > 0 && (
                            <button
                              className="text-xs sm:text-sm text-green-600 cursor-pointer hover:underline"
                              onClick={() =>
                                onDateClick && onDateClick(formatLocalDate(day))
                              }
                            >
                              Book Appointment
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  } else if (selectedDoctor && hasAvailability) {
                    // Show green dots for available time slots
                    const allDayTimeSlots =
                      dayTimeSlots.length > 0
                        ? dayTimeSlots
                        : generateTimeSlotsFromAvailability(dayAvailabilities);
                    const totalSlots = allDayTimeSlots.length;
                    const availableCount = allDayTimeSlots.length;

                    return (
                      <div className="mt-2">
                        {/* Slot count in top right */}
                        <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-xs font-medium text-gray-600 ">
                          {availableCount}/{totalSlots}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {dayTimeSlots.slice(0, 8).map((time, index) => (
                            <div
                              key={index}
                              className="w-2 h-2 bg-green-500 rounded-full cursor-pointer hover:scale-125 transition-transform"
                              title={`Available at ${time}`}
                              onClick={() =>
                                onDateClick && onDateClick(formatLocalDate(day))
                              }
                            />
                          ))}
                          {dayTimeSlots.length > 8 && (
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full"
                              title={`+${dayTimeSlots.length - 8} more slots`}
                            />
                          )}
                        </div>
                        <div className="flex space-x-1 sm:space-x-2 mt-1 sm:mt-2">
                          <button
                            className="text-xs sm:text-sm text-blue-600 cursor-pointer hover:underline"
                            onClick={() => handleDayClick(formatLocalDate(day))}
                          >
                            View Details
                          </button>
                          <button
                            className="text-xs sm:text-sm text-green-600 cursor-pointer hover:underline"
                            onClick={() =>
                              onDateClick && onDateClick(formatLocalDate(day))
                            }
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
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
      <div className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-gray-200 :bg-gray-600"
          >
            <ChevronLeft />
          </button>
          <h3 className="text-lg font-semibold">
            {monthNames[gridDate.getMonth()]} {gridDate.getFullYear()}
          </h3>
          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-gray-200 :bg-gray-600"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600 ">
          {weekDays.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-l border-gray-200 sm:text-sm text-xs">
          {calendarDays.map((d) => {
            if (!d.day) {
              return (
                <div
                  key={d.key}
                  className="p-2 h-24 border-r border-b border-gray-200 "
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

            // Get timeslots for this specific date using the efficient API
            const dayTimeSlotsFromAPI = getTimeSlotsForDate(dayDate);
            const dayTimeSlots =
              dayTimeSlotsFromAPI.length > 0
                ? dayTimeSlotsFromAPI
                    .filter((slot) => slot.status === "available")
                    .map((slot) => slot.startTime.substring(0, 5))
                : [];

            // Fallback to availability logic if no time slots from API
            const dayAvailabilities =
              dayTimeSlots.length === 0 && availabilities
                ? availabilities.filter(
                    (availability) =>
                      availability.dayOfWeek === backendDayOfWeek &&
                      availability.active &&
                      availability.durations &&
                      availability.durations.length > 0
                  )
                : [];
            const hasAvailability =
              dayTimeSlots.length > 0 || dayAvailabilities.length > 0;

            return (
              <div
                key={d.key}
                className={`p-1 sm:p-2 h-16 sm:h-24 border-r border-b border-gray-200 relative ${
                  d.day === today.getDate() && d.isCurrentMonth
                    ? "bg-blue-50 "
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
                {(() => {
                  // Check for appointments first
                  const dayAppointments =
                    appointments?.filter(
                      (a) => a.appointmentDate === formatLocalDate(dayDate)
                    ) || [];

                  if (dayAppointments.length > 0) {
                    // Show red dots for booked appointments
                    const allDayTimeSlots =
                      dayTimeSlots.length > 0
                        ? dayTimeSlots
                        : generateTimeSlotsFromAvailability(dayAvailabilities);
                    const totalSlots = allDayTimeSlots.length;
                    const availableCount = Math.max(
                      0,
                      allDayTimeSlots.length - dayAppointments.length
                    );

                    return (
                      <div className="mt-1 sm:mt-2">
                        {/* Slot count in top right */}
                        <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-xs font-medium text-gray-600 ">
                          {availableCount}/{totalSlots}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {dayAppointments
                            .slice(0, 6)
                            .map((appointment, index) => (
                              <div
                                key={index}
                                className="w-1.5 h-1.5 bg-red-500 rounded-full cursor-pointer hover:scale-125 transition-transform"
                                title={`${
                                  appointment.patientName
                                } - ${appointment.startTime?.substring(0, 5)}`}
                                onClick={() =>
                                  handleDayClick(formatLocalDate(dayDate))
                                }
                              />
                            ))}
                          {dayAppointments.length > 6 && (
                            <div
                              className="w-1.5 h-1.5 bg-red-400 rounded-full"
                              title={`+${
                                dayAppointments.length - 6
                              } more appointments`}
                            />
                          )}
                        </div>
                        <div className="flex space-x-1 sm:space-x-2 mt-1 sm:mt-2">
                          <button
                            className="text-xs sm:text-sm text-blue-600 cursor-pointer hover:underline"
                            onClick={() =>
                              handleDayClick(formatLocalDate(dayDate))
                            }
                          >
                            View Details
                          </button>
                          {availableCount > 0 && (
                            <button
                              className="text-xs sm:text-sm text-green-600 cursor-pointer hover:underline"
                              onClick={() => {
                                const dateString = formatLocalDate(dayDate);
                                onDateClick && onDateClick(dateString);
                              }}
                            >
                              Book
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  } else if (selectedDoctor && hasAvailability) {
                    // Show green dots for available time slots
                    const allDayTimeSlots =
                      dayTimeSlots.length > 0
                        ? dayTimeSlots
                        : generateTimeSlotsFromAvailability(dayAvailabilities);
                    const totalSlots = allDayTimeSlots.length;
                    const availableCount = allDayTimeSlots.length;

                    return (
                      <div className="mt-1 sm:mt-2">
                        {/* Slot count in top right */}
                        <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-xs font-medium text-gray-600 ">
                          {availableCount}/{totalSlots}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {allDayTimeSlots.slice(0, 6).map((time, index) => (
                            <div
                              key={index}
                              className="w-1.5 h-1.5 bg-green-500 rounded-full cursor-pointer hover:scale-125 transition-transform"
                              title={`Available at ${time}`}
                              onClick={() => {
                                const dateString = formatLocalDate(dayDate);
                                onDateClick && onDateClick(dateString);
                              }}
                            />
                          ))}
                          {allDayTimeSlots.length > 6 && (
                            <div
                              className="w-1.5 h-1.5 bg-green-400 rounded-full"
                              title={`+${
                                allDayTimeSlots.length - 6
                              } more slots`}
                            />
                          )}
                        </div>
                        <div className="flex space-x-1 sm:space-x-2 mt-1 sm:mt-2">
                          <button
                            className="text-xs sm:text-sm text-blue-600 cursor-pointer hover:underline"
                            onClick={() =>
                              handleDayClick(formatLocalDate(dayDate))
                            }
                          >
                            View Details
                          </button>
                          <button
                            className="text-xs sm:text-sm text-green-600 cursor-pointer hover:underline"
                            onClick={() => {
                              const dateString = formatLocalDate(dayDate);
                              onDateClick && onDateClick(dateString);
                            }}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
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
      {!selectedDoctor ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Please Select a Doctor
            </h3>
            <p className="text-gray-500 ">
              Choose a doctor from the dropdown above to view their schedule
            </p>
          </div>
        </div>
      ) : (
        <>
          {view === "today" && renderTodayView()}
          {!isMobile && view === "weekly" && renderWeeklyView()}
          {!isMobile && view === "monthly" && renderMonthlyView()}
        </>
      )}
    </div>
  );
};

export default CalendarView;
