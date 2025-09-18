/**
 * Utility functions for appointment booking validation
 */

/**
 * Check if a date is in the past (before today)
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean} - True if date is in the past
 */
export const isPastDate = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  const selectedDate = new Date(dateString);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate < today;
};

/**
 * Check if a time slot is in the past for today's date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} timeString - Time in HH:MM format
 * @returns {boolean} - True if time slot is in the past
 */
export const isPastTimeSlot = (dateString, timeString) => {
  const today = new Date();
  const selectedDate = new Date(dateString);

  // If it's not today, use date comparison
  if (selectedDate.toDateString() !== today.toDateString()) {
    return isPastDate(dateString);
  }

  // If it's today, check the time
  const [hours, minutes] = timeString.split(":").map(Number);
  const selectedDateTime = new Date(selectedDate);
  selectedDateTime.setHours(hours, minutes, 0, 0);

  return selectedDateTime < today;
};

/**
 * Convert time string to minutes since midnight
 * @param {string} timeString - Time in HH:MM format
 * @returns {number} - Minutes since midnight
 */
export const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string
 * @param {number} minutes - Minutes since midnight
 * @returns {string} - Time in HH:MM format
 */
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Check if two time slots overlap
 * @param {string} start1 - Start time of first slot (HH:MM)
 * @param {number} duration1 - Duration of first slot in minutes
 * @param {string} start2 - Start time of second slot (HH:MM)
 * @param {number} duration2 - Duration of second slot in minutes
 * @returns {boolean} - True if slots overlap
 */
export const doTimeSlotsOverlap = (start1, duration1, start2, duration2) => {
  const start1Minutes = timeToMinutes(start1);
  const end1Minutes = start1Minutes + duration1;

  const start2Minutes = timeToMinutes(start2);
  const end2Minutes = start2Minutes + duration2;

  // Check if there's any overlap
  return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
};

/**
 * Check if a new appointment conflicts with existing appointments
 * @param {string} newStartTime - Start time of new appointment (HH:MM)
 * @param {number} newDuration - Duration of new appointment in minutes
 * @param {Array} existingAppointments - Array of existing appointments
 * @param {string} appointmentDate - Date of the appointment (YYYY-MM-DD)
 * @returns {Object} - { hasConflict: boolean, conflictingAppointments: Array }
 */
export const checkAppointmentConflicts = (
  newStartTime,
  newDuration,
  existingAppointments,
  appointmentDate
) => {
  // Ensure existingAppointments is an array
  const appointments = Array.isArray(existingAppointments)
    ? existingAppointments
    : [];

  const conflictingAppointments = appointments.filter((appointment) => {
    // Only check appointments on the same date
    if (appointment.appointmentDate !== appointmentDate) {
      return false;
    }

    // Skip cancelled appointments
    if (appointment.status?.toUpperCase() === "CANCELLED") {
      return false;
    }

    // Get appointment duration (default to 30 minutes if not specified)
    const appointmentDuration =
      appointment.sessionDurationMinutes ||
      appointment.session?.sessionType?.defaultDurationMinutes ||
      30;

    return doTimeSlotsOverlap(
      newStartTime,
      newDuration,
      appointment.startTime,
      appointmentDuration
    );
  });

  return {
    hasConflict: conflictingAppointments.length > 0,
    conflictingAppointments,
  };
};

/**
 * Get the minimum selectable date (today)
 * @returns {string} - Date in YYYY-MM-DD format
 */
export const getMinSelectableDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/**
 * Format conflict message for user display
 * @param {Array} conflictingAppointments - Array of conflicting appointments
 * @returns {string} - Formatted conflict message
 */
export const formatConflictMessage = (conflictingAppointments) => {
  if (conflictingAppointments.length === 0) {
    return "";
  }

  const conflicts = conflictingAppointments
    .map((apt) => {
      const patientName =
        apt.patient?.firstName && apt.patient?.lastName
          ? `${apt.patient.firstName} ${apt.patient.lastName}`
          : "Unknown Patient";
      return `${apt.startTime} - ${patientName}`;
    })
    .join(", ");

  return `This time slot conflicts with existing appointment(s): ${conflicts}`;
};

/**
 * Validate appointment booking data
 * @param {Object} appointmentData - Appointment data to validate
 * @param {Array} existingAppointments - Array of existing appointments
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export const validateAppointmentBooking = (
  appointmentData,
  existingAppointments
) => {
  const errors = [];

  // Check if date is in the past
  if (isPastDate(appointmentData.appointmentDate)) {
    errors.push("Cannot book appointments for past dates");
  }

  // Check if time slot is in the past (for today)
  if (
    isPastTimeSlot(appointmentData.appointmentDate, appointmentData.startTime)
  ) {
    errors.push("Cannot book appointments for past time slots");
  }

  // Check for conflicts
  const conflictCheck = checkAppointmentConflicts(
    appointmentData.startTime,
    appointmentData.sessionDurationMinutes || 30,
    existingAppointments,
    appointmentData.appointmentDate
  );

  if (conflictCheck.hasConflict) {
    errors.push(formatConflictMessage(conflictCheck.conflictingAppointments));
  }

  return {
    isValid: errors.length === 0,
    errors,
    conflictingAppointments: conflictCheck.conflictingAppointments || [],
  };
};
