import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useGetAllEnrichedDoctors } from "../../hooks/useEnrichedDoctorQueries";
import { useGetAllEnrichedPatients } from "../../hooks/useEnrichedPatientQueries";
import { useGetAllAppointments } from "../../hooks/useScheduleQueries";
import { useGetDoctorAvailability } from "../../hooks/useTimingQueries";
import { useGetAllSessions } from "../../hooks/useSessionQueries";
import { useCreateAppointment } from "../../hooks/useScheduleQueries";

const DayDetailView = ({
  selectedDate,
  selectedDoctor,
  onBack,
  onDateChange,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
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

            while (start < end) {
              availableSlots.add(start.toTimeString().slice(0, 5));
              start.setMinutes(start.getMinutes() + 30);
            }
          }
        });
      }
    });

    // Filter out booked slots
    const bookedSlots = dayAppointments.map((a) =>
      a.startTime?.substring(0, 5)
    );
    return Array.from(availableSlots)
      .filter((slot) => !bookedSlots.includes(slot))
      .sort();
  };

  const availableSlots = generateAvailableTimeSlots();

  // Navigation functions
  const handlePrevDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const newDate = prevDate.toISOString().split("T")[0];
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const newDate = nextDate.toISOString().split("T")[0];
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  // Booking functions
  const handleTimeSlotClick = (time) => {
    setSelectedTimeSlot(time);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const selectedSession = doctorSessions.find(
      (s) => s.id === bookingForm.sessionId
    );
    if (!selectedSession) {
      alert("Please select a session");
      return;
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
      sessionDurationMinutes:
        selectedSession.sessionType?.defaultDurationMinutes,
    };

    try {
      await createAppointmentMutation.mutateAsync(appointmentData);
      setShowBookingModal(false);
      setBookingForm({
        patientId: "",
        sessionId: "",
        notes: "",
        consultationType: "IN_PERSON",
      });
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment");
    }
  };

  const handleCancelAppointment = (appointment) => {
    if (window.confirm(`Cancel appointment for ${appointment.patientName}?`)) {
      console.log("Cancelling appointment:", appointment);
      // TODO: Call cancel appointment API
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Day Detail View</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-semibold">{formatDate(currentDate)}</h2>
          <button
            onClick={handleNextDay}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Doctor Information</h3>
        {selectedDoctor && (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {doctors
                  .find((d) => d.id === selectedDoctor)
                  ?.firstName?.charAt(0) || "D"}
              </span>
            </div>
            <div>
              <p className="font-medium">
                {doctors.find((d) => d.id === selectedDoctor)?.name ||
                  "Unknown Doctor"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {doctors.find((d) => d.id === selectedDoctor)?.speciality ||
                  "General"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Booked Appointments</h3>
          {dayAppointments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No appointments for this day
            </p>
          ) : (
            <div className="space-y-3">
              {dayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {appointment.startTime?.substring(0, 5)}
                        </span>
                        <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                          Booked
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {patients.find((p) => p.id === appointment.patientId)
                          ?.name || "Unknown Patient"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.sessionName || "General Consultation"}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleCancelAppointment(appointment)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Cancel Appointment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Slots */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
          {availableSlots.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No available slots for this day
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSlotClick(time)}
                  className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-center"
                >
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">
                    {time}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Available
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Book Appointment</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Time Slot
                </label>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    {selectedTimeSlot}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Patient
                </label>
                <select
                  value={bookingForm.patientId}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      patientId: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Session Type
                </label>
                <select
                  value={bookingForm.sessionId}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      sessionId: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  required
                >
                  <option value="">Select Session</option>
                  {doctorSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.sessionType?.name} (
                      {session.sessionType?.defaultDurationMinutes} min)
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
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="IN_PERSON">In Person</option>
                  <option value="VIRTUAL">Virtual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, notes: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  rows="3"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
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
    </div>
  );
};

export default DayDetailView;
