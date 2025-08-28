import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const DashboardCalendar = ({
  appointments = [],
  availabilities = [],
  doctors = [],
  patients = [],
  onAppointmentClick = () => {},
  onTimeSlotClick = () => {},
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Navigation functions
  const handlePrevDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate);
  };

  // Get appointments for current date
  const dayAppointments = appointments.filter(
    (a) => a.appointmentDate === formatLocalDate(currentDate)
  );

  // Get availability for current date
  const selectedDateObj = new Date(currentDate);
  const dayOfWeek = selectedDateObj.getDay();
  const backendDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  const dayAvailabilities = availabilities.filter((availability) => {
    return availability.dayOfWeek === backendDayOfWeek && availability.active;
  });

  // Generate all available time slots for the day
  const allAvailableSlots =
    generateTimeSlotsFromAvailability(dayAvailabilities);

  // Get booked time slots
  const bookedSlots = dayAppointments.map((a) => a.startTime?.substring(0, 5));

  // Create a set of all relevant time slots (available + booked)
  const relevantSlots = new Set([...allAvailableSlots, ...bookedSlots]);
  const timeSlots = Array.from(relevantSlots).sort();

  // Check if there are any slots for today
  const hasAnySlots = timeSlots.length > 0;

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 dark:bg-gray-800/20 dark:border-gray-700/30 p-6 rounded-lg shadow-lg">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevDay}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-center">
          {formatDate(currentDate)}
        </h2>
        <button
          onClick={handleNextDay}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      {!hasAnySlots ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Doctors Available Today
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try navigating to another day to find available appointments
          </p>
          <button
            onClick={handleNextDay}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Day
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {timeSlots.map((time) => {
            // Check if this time slot has an appointment
            const appointment = dayAppointments.find(
              (a) => a.startTime?.substring(0, 5) === time
            );

            // Check if this time slot is available
            const isAvailable = allAvailableSlots.includes(time);

            // Find which doctors are available at this time
            const availableDoctors = dayAvailabilities
              .filter((availability) => {
                return availability.durations?.some((duration) => {
                  const start = new Date(`2000-01-01T${duration.startTime}`);
                  const end = new Date(`2000-01-01T${duration.endTime}`);
                  const slotTime = new Date(`2000-01-01T${time}`);
                  return slotTime >= start && slotTime < end;
                });
              })
              .map(
                (availability) => availability.doctorName || "Unknown Doctor"
              );

            if (appointment) {
              // Enrich appointment data with names
              const patient = patients.find(
                (p) => p.id === appointment.patientId
              );
              const doctor = doctors.find((d) => d.id === appointment.doctorId);
              const patientName = patient
                ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim()
                : "Unknown Patient";
              const doctorName = doctor
                ? `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim()
                : "Unknown Doctor";

              // Booked appointment slot
              return (
                <div
                  key={time}
                  className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  onClick={() => onAppointmentClick(appointment)}
                >
                  <div className="w-16 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {time}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">
                        Booked
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                      {patientName} - {doctorName}
                    </div>
                    {appointment.sessionTypeId && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Session ID: {appointment.sessionTypeId}
                      </div>
                    )}
                  </div>
                </div>
              );
            } else {
              // Available time slot
              return (
                <div
                  key={time}
                  className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                  onClick={() => onTimeSlotClick(time)}
                >
                  <div className="w-16 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {time}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        Available
                      </span>
                    </div>
                    {availableDoctors.length > 0 && (
                      <div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                        {availableDoctors.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          })}

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Total Appointments: {dayAppointments.length}</span>
              <span>
                Available Slots:{" "}
                {Math.max(0, allAvailableSlots.length - bookedSlots.length)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCalendar;
