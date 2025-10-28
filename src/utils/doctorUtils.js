// Utility functions for doctor-related operations

/**
 * Filters doctors to show only active ones
 * @param {Array} doctors - Array of doctor objects
 * @returns {Array} - Array of active doctors only
 */
export const getActiveDoctors = (doctors) => {
  if (!doctors || !Array.isArray(doctors)) {
    return [];
  }

  return doctors.filter((doctor) => {
    // Check if doctor has a status field and it's ACTIVE
    if (doctor.status) {
      return doctor.status === "ACTIVE";
    }

    // If no status field, assume active (for backward compatibility)
    return true;
  });
};

/**
 * Checks if a doctor is active
 * @param {Object} doctor - Doctor object
 * @returns {boolean} - True if doctor is active
 */
export const isDoctorActive = (doctor) => {
  if (!doctor) {
    return false;
  }

  // Check if doctor has a status field and it's ACTIVE
  if (doctor.status) {
    return doctor.status === "ACTIVE";
  }

  // If no status field, assume active (for backward compatibility)
  return true;
};

/**
 * Gets doctor display name
 * @param {Object} doctor - Doctor object
 * @returns {string} - Display name for the doctor
 */
export const getDoctorDisplayName = (doctor) => {
  if (!doctor) {
    return "";
  }

  // Try different name fields
  if (doctor.name) {
    return doctor.name;
  }

  if (doctor.firstName && doctor.lastName) {
    return `${doctor.firstName} ${doctor.lastName}`;
  }

  if (doctor.firstName) {
    return doctor.firstName;
  }

  return "Unknown Doctor";
};
