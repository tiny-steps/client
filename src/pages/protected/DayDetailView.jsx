import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  CheckCircle,
  Eye,
  Clock,
} from "lucide-react";
import { useGetAllEnrichedDoctors } from "../../hooks/useEnrichedDoctorQueries";
import { useGetAllEnrichedPatients } from "../../hooks/useEnrichedPatientQueries";
import {
  useGetAllAppointments,
  useCreateAppointment,
  useChangeAppointmentStatus,
} from "../../hooks/useScheduleQueries";
import { useGetDoctorAvailability } from "../../hooks/useTimingQueries";
import { useGetAllSessions } from "../../hooks/useSessionQueries";
import useUserStore from "../../store/useUserStore.js";

const DayDetailView = ({
  selectedDate,
  selectedDoctor,
  onBack,
  onDateChange,
}) => {
  // Get the logged-in user's ID
  const userId = useUserStore((state) => state.userId);

  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    patientId: "",
    sessionId: "",
    notes: "",
    consultationType: "IN_PERSON",
  });

  // Fetch data
  const { data: doctorsData } = useGetAllEnrichedDoctors({ size: 100 });
  const { data: patientsData } = useGetAllEnrichedPatients({ size: 100 });
  const { data: appointmentsData } = useGetAllAppointments({ size: 100 });
  const { data: availabilityData } = useGetDoctorAvailability(
    selectedDoctor,
    { date: currentDate },
    { enabled: !!selectedDoctor }
  );
  const { data: sessionsData } = useGetAllSessions({
    isActive: true,
    size: 100,
  });
  const createAppointmentMutation = useCreateAppointment();
  const changeStatusMutation = useChangeAppointmentStatus();

  const doctors = doctorsData?.data?.content || [];
  const patients = patientsData?.data?.content || [];
  const appointments = appointmentsData?.data?.content || [];
  const availabilities = availabilityData || [];
  const allSessions = sessionsData?.content || [];

  // Filter data for current date and doctor
  const dayAppointments = appointments.filter(
    (a) => a.appointmentDate === currentDate && a.doctorId === selectedDoctor
  );

  const doctorSessions = allSessions.filter(
    (s) => s.doctorId === selectedDoctor
  );

  // Generate available time slots
  const generateAvailableTimeSlots = () => {
    if (!selectedDoctor || !availabilities.length) return [];

    const selectedDateObj = new Date(currentDate);
    const dayOfWeek = selectedDateObj.getDay();
    const backendDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    const dayAvailabilities = availabilities.filter((availability) => {
      return availability.dayOfWeek === backendDayOfWeek && availability.active;
    });

    const availableSlots = new Set();
    dayAvailabilities.forEach((availability) => {
      if (availability.durations) {
        availability.durations.forEach((duration) => {
          if (duration.startTime && duration.endTime) {
            const start = new Date(`2000-01-01T${duration.startTime}`);
            let end = new Date(`2000-01-01T${duration.endTime}`);

            if (end < start) {
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
                end = new Date(`2000-01-01T${correctedEndTime}`);
              } else {
                end.setDate(end.getDate() + 1);
              }
            }

            // Generate 30-minute slots
            const current = new Date(start);
            while (current < end) {
              const timeString = current.toTimeString().substring(0, 5);
              availableSlots.add(timeString);
              current.setMinutes(current.getMinutes() + 30);
            }
          }
        });
      }
    });

    // Filter out booked slots
    const bookedSlots = new Set(
      dayAppointments
        .filter(
          (apt) => apt.status === "SCHEDULED" || apt.status === "CHECKED_IN"
        )
        .map((apt) => apt.startTime?.substring(0, 5))
    );

    return Array.from(availableSlots)
      .filter((slot) => !bookedSlots.has(slot))
      .sort();
  };

  const availableSlots = generateAvailableTimeSlots();

  // Navigation handlers
  const handlePrevDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const newDate = prevDate.toISOString().split("T")[0];
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const newDate = nextDate.toISOString().split("T")[0];
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  // Booking handlers
  const handleTimeSlotClick = (time) => {
    setSelectedTimeSlot(time);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTimeSlot || !bookingForm.patientId || !bookingForm.sessionId) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const selectedSession = doctorSessions.find(
        (s) => s.id === bookingForm.sessionId
      );
      if (!selectedSession) {
        throw new Error("Selected session not found");
      }

      const appointmentData = {
        patientId: bookingForm.patientId,
        doctorId: selectedDoctor,
        sessionTypeId: selectedSession.sessionType?.id,
        appointmentDate: currentDate,
        startTime: selectedTimeSlot,
        consultationType: bookingForm.consultationType,
        notes: bookingForm.notes,
        status: "SCHEDULED",
      };

      await createAppointmentMutation.mutateAsync(appointmentData);
      setShowBookingModal(false);
      setSelectedTimeSlot(null);
      setBookingForm({
        patientId: "",
        sessionId: "",
        notes: "",
        consultationType: "IN_PERSON",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment");
    }
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async (cancellationType, reason = "") => {
    if (!selectedAppointment) return;

    try {
      await changeStatusMutation.mutateAsync({
        id: selectedAppointment.id,
        statusData: {
          status: "CANCELLED",
          changedById: userId, // Use actual logged-in user ID
          reason,
          cancellationType,
        },
      });
      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment");
    }
  };

  const handleCompleteAppointment = async (appointment) => {
    if (
      !window.confirm(
        `Mark appointment with ${
          patients.find((p) => p.id === appointment.patientId)?.name ||
          "patient"
        } as completed?`
      )
    ) {
      return;
    }

    try {
      await changeStatusMutation.mutateAsync({
        id: appointment.id,
        statusData: {
          status: "COMPLETED",
          changedById: userId, // Use actual logged-in user ID
          reason: "Appointment completed successfully",
        },
      });
    } catch (error) {
      console.error("Error completing appointment:", error);
      alert("Failed to complete appointment");
    }
  };

  const handleCheckInAppointment = async (appointment) => {
    if (
      !window.confirm(
        `Check in patient ${
          patients.find((p) => p.id === appointment.patientId)?.name ||
          "patient"
        }?`
      )
    ) {
      return;
    }

    try {
      await changeStatusMutation.mutateAsync({
        id: appointment.id,
        statusData: {
          status: "CHECKED_IN",
          changedById: userId, // Use actual logged-in user ID
          reason: "Patient checked in",
        },
      });
    } catch (error) {
      console.error("Error checking in appointment:", error);
      alert("Failed to check in appointment");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCheckInTime = (checkedInAt) => {
    if (!checkedInAt) return "Not checked in";
    const date = new Date(checkedInAt);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: "bg-blue-100 text-blue-800",
      CHECKED_IN: "bg-green-100 text-green-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 :bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Day Detail View</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 :bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-semibold">{formatDate(currentDate)}</h2>
          <button
            onClick={handleNextDay}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 :bg-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Doctor Information</h3>
        <p className="text-gray-600">
          {doctors.find((d) => d.id === selectedDoctor)?.name ||
            "Unknown Doctor"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Booked Appointments</h3>
          {dayAppointments.length === 0 ? (
            <p className="text-gray-500 ">No appointments for this day</p>
          ) : (
            <div className="space-y-3">
              {dayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900 ">
                          {appointment.startTime?.substring(0, 5)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status === "COMPLETED"
                            ? "Completed"
                            : appointment.status === "CANCELLED"
                            ? "Cancelled"
                            : appointment.status === "CHECKED_IN"
                            ? "Checked In"
                            : "Scheduled"}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 ">
                        {patients.find((p) => p.id === appointment.patientId)
                          ?.name || "Unknown Patient"}
                      </p>
                      <p className="text-sm text-gray-600 ">
                        {appointment.sessionName || "General Consultation"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Check-in: {formatCheckInTime(appointment.checkedInAt)}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {/* View Appointment */}
                      <button
                        onClick={() => {
                          // TODO: Open appointment details modal
                          console.log("View appointment:", appointment);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Appointment"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Check In */}
                      {appointment.status === "SCHEDULED" && (
                        <button
                          onClick={() => handleCheckInAppointment(appointment)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Check In Patient"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}

                      {/* Complete */}
                      {(appointment.status === "SCHEDULED" ||
                        appointment.status === "CHECKED_IN") && (
                        <button
                          onClick={() => handleCompleteAppointment(appointment)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Mark as Complete"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Cancel */}
                      {appointment.status !== "CANCELLED" &&
                        appointment.status !== "COMPLETED" && (
                          <button
                            onClick={() => handleCancelAppointment(appointment)}
                            className="p-2 text-red-600 hover:bg-red-100 :bg-red-900/20 rounded-lg transition-colors"
                            title="Cancel Appointment"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Slots */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
          {availableSlots.length === 0 ? (
            <p className="text-gray-500 ">No available slots for this day</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSlotClick(time)}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 :bg-green-900/40 transition-colors text-center"
                >
                  <div className="text-sm font-medium text-green-800 ">
                    {time}
                  </div>
                  <div className="text-xs text-green-600 ">Available</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Book Appointment</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="text"
                  value={selectedTimeSlot}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 "
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Patient *
                </label>
                <select
                  value={bookingForm.patientId}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      patientId: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white "
                  required
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Session *
                </label>
                <select
                  value={bookingForm.sessionId}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      sessionId: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white "
                  required
                >
                  <option value="">Select session</option>
                  {doctorSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Consultation Type
                </label>
                <select
                  value={bookingForm.consultationType}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      consultationType: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white "
                >
                  <option value="IN_PERSON">In Person</option>
                  <option value="TELEMEDICINE">Telemedicine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, notes: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white "
                  rows="3"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 :bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAppointmentMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {createAppointmentMutation.isPending
                    ? "Booking..."
                    : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Cancel Appointment</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Cancel appointment with{" "}
                {patients.find((p) => p.id === selectedAppointment.patientId)
                  ?.name || "patient"}
                at {selectedAppointment.startTime?.substring(0, 5)}?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() =>
                  handleCancelConfirm(
                    "CANCELLED_BY_DOCTOR",
                    "Cancelled by doctor"
                  )
                }
                className="w-full p-3 text-left bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
              >
                <div className="font-medium text-red-800">
                  Cancelled by Doctor
                </div>
                <div className="text-sm text-red-600">
                  Doctor initiated cancellation
                </div>
              </button>

              <button
                onClick={() =>
                  handleCancelConfirm(
                    "CANCELLED_BY_PATIENT",
                    "Cancelled by patient"
                  )
                }
                className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors"
              >
                <div className="font-medium text-orange-800">
                  Cancelled by Patient
                </div>
                <div className="text-sm text-orange-600">
                  Patient initiated cancellation
                </div>
              </button>

              <button
                onClick={() =>
                  handleCancelConfirm("NO_SHOW", "Patient did not show up")
                }
                className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-800">No Show</div>
                <div className="text-sm text-gray-600">
                  Patient did not attend the appointment
                </div>
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayDetailView;
