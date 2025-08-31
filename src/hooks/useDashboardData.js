import { useGetAllAppointments } from "./useScheduleQueries.js";
import { useGetAllDoctors } from "./useDoctorQueries.js";
import { useGetAllPatients } from "./usePatientQueries.js";
import { useGetAllAvailabilities } from "./useTimingQueries.js";
import { useChangeAppointmentStatus } from "./useScheduleQueries.js";
import useUserStore from "../store/useUserStore.js";

export const useDashboardData = () => {
  // Get the logged-in user's ID
  const userId = useUserStore((state) => state.userId);

  // Fetch real data from backend
  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useGetAllAppointments({
    size: 100, // Get more appointments to filter locally
  });

  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useGetAllDoctors({
    size: 10, // Get recent doctors
  });

  const {
    data: patientsData,
    isLoading: patientsLoading,
    error: patientsError,
  } = useGetAllPatients({
    size: 10, // Get recent patients
  });

  const {
    data: availabilitiesData,
    isLoading: availabilitiesLoading,
    error: availabilitiesError,
  } = useGetAllAvailabilities({
    startDate: new Date().toISOString().split("T")[0], // Today
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Next 7 days
  });

  // Get the status change mutation
  const changeStatusMutation = useChangeAppointmentStatus();

  // Process appointments data
  const allAppointments = appointmentsData?.data?.content || [];
  const upcomingAppointments = allAppointments.filter(
    (apt) => apt.status === "SCHEDULED" || apt.status === "CHECKED_IN"
  );

  const appointments = {
    total: appointmentsData?.data?.totalElements || 0,
    completed:
      allAppointments.filter((apt) => apt.status === "COMPLETED").length || 0,
    upcoming:
      upcomingAppointments.map((apt) => ({
        id: apt.id,
        patientName: apt.patientName || "Unknown Patient",
        time: apt.startTime,
        status: apt.status?.toLowerCase() || "scheduled",
        doctorName: apt.doctorName || "Unknown Doctor",
        date: apt.appointmentDate,
      })) || [],
  };

  // Process doctors data
  const doctors = {
    totalCount: doctorsData?.data?.totalElements || 0,
    availableCount:
      doctorsData?.data?.content?.filter((doc) => doc.status === "ACTIVE")
        .length || 0,
    list:
      doctorsData?.data?.content?.map((doc) => ({
        id: doc.id,
        name: doc.name,
        status: doc.status?.toLowerCase() || "pending",
        speciality: doc.speciality || "General",
        experienceYears: doc.experienceYears || 0,
        slots: doc.slots || ["9:00 AM", "11:00 AM", "2:00 PM"], // Default slots if not provided
      })) || [],
  };

  // Calculate booking statistics with fallback data
  const bookingStats = {
    total: appointments.total || 0,
    completed: appointments.completed || 0,
    cancelled:
      allAppointments.filter((apt) => apt.status === "CANCELLED").length || 0,
    rescheduled: 0, // This will be calculated from history if needed
    byDoctor: doctors.availableCount || 0,
    byPatient: patientsData?.data?.totalElements || 0,
    missedNoShow: 0, // This will be calculated from history if needed
    missedRescheduled: 0, // This will be calculated from history if needed
  };

  // Ensure all values are numbers to prevent NaN in charts
  Object.keys(bookingStats).forEach((key) => {
    if (typeof bookingStats[key] !== "number" || isNaN(bookingStats[key])) {
      bookingStats[key] = 0;
    }
  });

  const handleAppointmentStatus = async (id, newStatus, options = {}) => {
    try {
      const statusData = {
        status: newStatus.toUpperCase(),
        changedById: userId, // Use actual logged-in user ID
        reason: options.reason || "",
      };

      // Add cancellation type if status is CANCELLED
      if (newStatus.toUpperCase() === "CANCELLED") {
        statusData.cancellationType =
          options.cancellationType || "CANCELLED_BY_PATIENT";
        if (options.rescheduledToAppointmentId) {
          statusData.rescheduledToAppointmentId =
            options.rescheduledToAppointmentId;
        }
      }

      await changeStatusMutation.mutateAsync({ id, statusData });
      console.log(`Appointment ${id} status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Failed to update appointment status:", error);
      throw error;
    }
  };

  const handleDoctorStatus = (id, newStatus) => {
    // This would typically call an API to update the doctor status
    console.log(`Updating doctor ${id} to status: ${newStatus}`);
  };

  const handleSlotSelection = (doctorName, time) => {
    // This would typically navigate to appointment creation
    console.log(`Time slot selected for ${doctorName}: ${time}`);
  };

  return {
    appointments,
    doctors,
    bookingStats,
    rawAppointments: allAppointments,
    rawDoctors: doctorsData?.data?.content || [],
    rawPatients: patientsData?.data?.content || [],
    rawAvailabilities: availabilitiesData?.data?.content || [],
    handleAppointmentStatus,
    handleDoctorStatus,
    handleSlotSelection,
    isLoading:
      appointmentsLoading ||
      doctorsLoading ||
      patientsLoading ||
      availabilitiesLoading,
    errors: {
      appointments: appointmentsError,
      doctors: doctorsError,
      patients: patientsError,
      availabilities: availabilitiesError,
    },
  };
};
