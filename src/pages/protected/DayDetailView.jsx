import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import AppointmentActions from "../../components/AppointmentActions.jsx";
import { ErrorModal } from "../../components/ui/error-modal.jsx";
import { useGetAllEnrichedDoctors } from "../../hooks/useEnrichedDoctorQueries";
import { useGetAllEnrichedPatients } from "../../hooks/useEnrichedPatientQueries";
import {
  useGetAllAppointments,
  useCreateAppointment,
} from "../../hooks/useScheduleQueries";
import {
  useGetDoctorAvailability,
  useGetTimeSlots,
} from "../../hooks/useTimingQueries";
import { useGetAllSessions } from "../../hooks/useSessionQueries";
import { useBranchFilter } from "../../hooks/useBranchFilter.js";
const DayDetailView = ({
  selectedDate,
  selectedDoctor,
  onBack,
  onDateChange,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Get the effective branch ID for filtering
  const { branchId, hasSelection } = useBranchFilter();

  const [bookingForm, setBookingForm] = useState({
    patientId: "",
    sessionId: "",
    notes: "",
    consultationType: "IN_PERSON",
  });

  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  // Fetch data
  const { data: doctorsData } = useGetAllEnrichedDoctors(
    {
      size: 100,
      ...(branchId && { branchId }), // Only include branchId if it's not null
    },
    {
      enabled: hasSelection, // Fetch when we have a selection (including "all")
    }
  );
  const { data: patientsData } = useGetAllEnrichedPatients(
    {
      size: 100,
      ...(branchId && { branchId }), // Only include branchId if it's not null
    },
    {
      enabled: hasSelection, // Fetch when we have a selection (including "all")
    }
  );
  const { data: appointmentsData } = useGetAllAppointments(
    {
      size: 100,
      ...(branchId && { branchId }), // Only include branchId if it's not null
    },
    {
      enabled: hasSelection, // Fetch when we have a selection (including "all")
    }
  );
  const { data: timeSlotsData } = useGetTimeSlots(
    selectedDoctor,
    currentDate,
    null, // practiceId
    branchId, // branchId
    { enabled: !!selectedDoctor && hasSelection }
  );
  const { data: sessionsData } = useGetAllSessions(
    {
      isActive: true,
      size: 100,
      ...(branchId && { branchId }), // Only include branchId if it's not null
    },
    {
      enabled: hasSelection, // Fetch when we have a selection (including "all")
    }
  );
  const createAppointmentMutation = useCreateAppointment();

  const doctors = doctorsData?.data?.content || [];
  const patients = patientsData?.data?.content || [];
  const appointments = appointmentsData?.data?.content || [];
  const timeSlots = timeSlotsData?.data?.slots || [];
  const allSessions = sessionsData?.content || [];

  // Filter data for current date and doctor, excluding cancelled appointments
  const dayAppointments = appointments.filter(
    (a) =>
      a.appointmentDate === currentDate &&
      a.doctorId === selectedDoctor &&
      a.status?.toUpperCase() !== "CANCELLED"
  );

  const doctorSessions = allSessions.filter(
    (s) => s.doctorId === selectedDoctor
  );

  // Get available time slots from API
  const availableSlots = timeSlots
    .filter((slot) => slot.status === "available")
    .map((slot) => slot.startTime.substring(0, 5))
    .sort();

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
      setErrorModal({
        open: true,
        title: "Missing Required Fields",
        message:
          "Please fill in all required fields (patient, session, and time).",
      });
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
      setErrorModal({
        open: true,
        title: "Failed to Create Appointment",
        message:
          error.message ||
          "An error occurred while creating the appointment. Please try again.",
      });
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
                      <AppointmentActions
                        appointment={appointment}
                        onView={(appointment) => {
                          // TODO: Open appointment details modal
                          console.log("View appointment:", appointment);
                        }}
                        size="sm"
                        className="justify-end"
                        patients={patients}
                        doctors={doctors}
                        hideViewAction={true}
                      />
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
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-xl rounded-lg p-6 w-full max-w-md mx-4">
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
                  className="w-full p-2 border border-white/30 rounded-lg bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-gray-800"
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
                  className="w-full p-2 border border-white/30 rounded-lg bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-gray-800"
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
                  className="w-full p-2 border border-white/30 rounded-lg bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-gray-800"
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
                  className="w-full p-2 border border-white/30 rounded-lg bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-gray-800"
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
                  className="w-full p-2 border border-white/30 rounded-lg bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-gray-800"
                  rows="3"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 bg-white/70 border border-white/50 text-gray-700 hover:bg-white/80 font-medium rounded-lg transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAppointmentMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Error Modal */}
      <ErrorModal
        open={errorModal.open}
        onOpenChange={(open) => setErrorModal({ open, title: "", message: "" })}
        title={errorModal.title}
        description={errorModal.message}
      />
    </div>
  );
};

export default DayDetailView;
