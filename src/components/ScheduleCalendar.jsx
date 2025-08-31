import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import { ErrorModal } from "./ui/error-modal.jsx";
import { useNavigate } from "react-router";
import {
  useGetAllAppointments,
  useCreateAppointment,
  useChangeAppointmentStatus,
  useDeleteAppointment,
} from "../hooks/useScheduleQueries.js";
import { useGetAllDoctors } from "../hooks/useDoctorQueries.js";
import { useGetAllPatients } from "../hooks/usePatientQueries.js";
import { useGetDoctorAvailability } from "../hooks/useTimingQueries.js";
import useUserStore from "../store/useUserStore.js";
import { Eye, CheckCircle, X, Clock } from "lucide-react";

const ScheduleCalendar = () => {
  // Get the logged-in user's ID
  const userId = useUserStore((state) => state.userId);

  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState("day"); // day, week, month
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cancelModal, setCancelModal] = useState({
    open: false,
    appointment: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    appointment: null,
  });
  const [createModal, setCreateModal] = useState({ open: false });
  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
    refetch,
  } = useGetAllAppointments({
    date: selectedDate,
    doctorId: selectedDoctor || undefined,
  });

  const { data: doctorsData } = useGetAllDoctors({ size: 100 });
  const { data: patientsData } = useGetAllPatients({ size: 100 });

  // Fetch doctor availability for the selected date
  const selectedDateObj = new Date(selectedDate);
  const dayOfWeek = selectedDateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const { data: availabilityData, isLoading: availabilityLoading } =
    useGetDoctorAvailability(
      selectedDoctor,
      { date: selectedDate },
      { enabled: !!selectedDoctor }
    );

  const createAppointment = useCreateAppointment();
  const changeStatus = useChangeAppointmentStatus();
  const deleteAppointment = useDeleteAppointment();

  const allAppointments = appointmentsData?.data?.content || [];
  // Filter out cancelled appointments so their time slots become available
  const appointments = allAppointments.filter(
    (appointment) => appointment.status?.toUpperCase() !== "CANCELLED"
  );
  const doctors = doctorsData?.data?.content || [];
  const patients = patientsData?.data?.content || [];
  const allAvailabilities = availabilityData || [];

  // Filter availabilities by day of week
  const availabilities = allAvailabilities.filter((availability) => {
    // Backend uses 1 = Monday, 7 = Sunday, frontend uses 0 = Sunday, 1 = Monday
    const backendDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    return availability.dayOfWeek === backendDayOfWeek && availability.active;
  });

  // Debug: Log availability data
  console.log("Schedule Calendar Debug:", {
    selectedDoctor,
    selectedDate,
    dayOfWeek,
    allAvailabilities,
    filteredAvailabilities: availabilities,
  });

  // Generate time slots based on doctor availability
  const timeSlots = useMemo(() => {
    if (!selectedDoctor || !availabilities.length) {
      // Return empty array if no doctor selected or no availability
      return [];
    }

    // Get available time slots from doctor's availability durations
    const availableSlots = new Set();
    availabilities.forEach((availability) => {
      console.log("Processing availability:", availability);
      if (availability.durations) {
        availability.durations.forEach((duration) => {
          console.log("Processing duration:", duration);
          if (duration.startTime && duration.endTime) {
            // Generate slots between start and end time
            const start = new Date(`2000-01-01T${duration.startTime}`);
            let end = new Date(`2000-01-01T${duration.endTime}`);

            console.log("Time range:", {
              startTime: duration.startTime,
              endTime: duration.endTime,
              start: start.toTimeString(),
              end: end.toTimeString(),
            });

            // Handle case where end time is earlier than start time (crosses midnight)
            if (end < start) {
              // Check if this might be a PM time that was stored as AM
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
                console.log("Corrected end time (AM to PM):", correctedEndTime);
              } else {
                end.setDate(end.getDate() + 1);
                console.log(
                  "Adjusted end time (crossed midnight):",
                  end.toTimeString()
                );
              }
            }

            // Generate slots every 30 minutes within the duration range
            const slotInterval = 30; // 30-minute intervals
            while (start < end) {
              const timeSlot = start.toTimeString().slice(0, 5);
              availableSlots.add(timeSlot);
              console.log("Added time slot:", timeSlot);
              start.setMinutes(start.getMinutes() + slotInterval);
            }
          }
        });
      }
    });

    return Array.from(availableSlots).sort();
  }, [selectedDoctor, availabilities]);

  // Debug: Log time slots after generation
  console.log("Generated time slots:", timeSlots.slice(0, 10));

  const getAppointmentForSlot = (time) => {
    return appointments.find((apt) => {
      const aptTime = new Date(apt.appointmentDateTime)
        .toTimeString()
        .slice(0, 5);
      return aptTime === time;
    });
  };

  const isTimeSlotAvailable = (time) => {
    // Check if the time slot is within doctor's availability
    if (!selectedDoctor || !availabilities.length) {
      return false; // Show as unavailable if no doctor selected or no availability data
    }

    // Check if there's an appointment at this time
    const appointment = getAppointmentForSlot(time);
    if (appointment) {
      return false; // Slot is booked
    }

    // Check if the time is within any availability duration
    return availabilities.some((availability) =>
      availability.durations?.some((duration) => {
        if (!duration.startTime || !duration.endTime) return false;

        const slotTime = new Date(`2000-01-01T${time}`);
        const startTime = new Date(`2000-01-01T${duration.startTime}`);
        const endTime = new Date(`2000-01-01T${duration.endTime}`);

        // Handle case where end time is earlier than start time (crosses midnight)
        if (endTime < startTime) {
          endTime.setDate(endTime.getDate() + 1);
        }

        return slotTime >= startTime && slotTime < endTime;
      })
    );
  };

  const handleCancelAppointment = async () => {
    if (cancelModal.appointment) {
      await changeStatus.mutateAsync({
        id: cancelModal.appointment.id,
        statusData: {
          status: "CANCELLED",
          changedById: userId, // Use actual logged-in user ID
          reason: "Cancelled by staff",
          cancellationType: "CANCELLED_BY_DOCTOR",
        },
      });
      setCancelModal({ open: false, appointment: null });
    }
  };

  const [completeModal, setCompleteModal] = useState({
    open: false,
    appointment: null,
  });

  const [checkInModal, setCheckInModal] = useState({
    open: false,
    appointment: null,
  });

  const handleCompleteAppointment = async (appointment) => {
    setCompleteModal({ open: true, appointment });
  };

  const handleCompleteConfirm = async () => {
    if (!completeModal.appointment) return;

    try {
      await changeStatus.mutateAsync({
        id: completeModal.appointment.id,
        statusData: {
          status: "COMPLETED",
          changedById: userId,
          reason: "Appointment completed successfully",
        },
      });
      setCompleteModal({ open: false, appointment: null });
    } catch (error) {
      console.error("Error completing appointment:", error);
      setErrorModal({
        open: true,
        title: "Failed to Complete Appointment",
        message:
          error.message ||
          "An error occurred while completing the appointment. Please try again.",
      });
    }
  };

  const handleCheckInAppointment = async (appointment) => {
    setCheckInModal({ open: true, appointment });
  };

  const handleCheckInConfirm = async () => {
    if (!checkInModal.appointment) return;

    try {
      await changeStatus.mutateAsync({
        id: checkInModal.appointment.id,
        statusData: {
          status: "CHECKED_IN",
          changedById: userId,
          reason: "Patient checked in",
        },
      });
      setCheckInModal({ open: false, appointment: null });
    } catch (error) {
      console.error("Error checking in appointment:", error);
      setErrorModal({
        open: true,
        title: "Failed to Check In Appointment",
        message:
          error.message ||
          "An error occurred while checking in the appointment. Please try again.",
      });
    }
  };

  const handleDeleteAppointment = async () => {
    if (deleteModal.appointment) {
      await deleteAppointment.mutateAsync(deleteModal.appointment.id);
      setDeleteModal({ open: false, appointment: null });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
      CHECKED_IN: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatCheckInTime = (checkedInAt) => {
    if (!checkedInAt) return "Not checked in";
    const date = new Date(checkedInAt);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (appointmentsLoading || (selectedDoctor && availabilityLoading))
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          New Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Doctor</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">View</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() =>
                  setSelectedDate(new Date().toISOString().split("T")[0])
                }
              >
                Today
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "day" && (
        <Card>
          <CardHeader>
            <CardTitle>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
            {selectedDoctor && (
              <p className="text-sm text-gray-600">
                Showing time slots based on selected doctor's availability
              </p>
            )}
          </CardHeader>
          <CardContent>
            {timeSlots.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">
                  No slots available for today.
                </div>
                <div className="text-gray-400 text-sm">
                  Please add doctor's availability in timing section.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {timeSlots.map((time) => {
                  const appointment = getAppointmentForSlot(time);
                  return (
                    <div
                      key={time}
                      className="flex items-center gap-4 p-2 border rounded hover:bg-gray-50"
                    >
                      <span className="w-16 text-sm font-medium">{time}</span>
                      {appointment ? (
                        <div
                          className={`flex-1 p-3 rounded border ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {appointment.patientName}
                              </p>
                              <p className="text-sm">
                                Dr. {appointment.doctorName}
                              </p>
                              <p className="text-xs mt-1">
                                {appointment.sessionType}
                              </p>
                              <p className="text-xs text-gray-500">
                                Check-in:{" "}
                                {formatCheckInTime(appointment.checkedInAt)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {/* View Appointment */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  navigate(`/appointments/${appointment.id}`)
                                }
                                title="View Appointment"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

                              {/* Check In */}
                              {appointment.status === "SCHEDULED" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleCheckInAppointment(appointment)
                                  }
                                  title="Check In Patient"
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Clock className="w-4 h-4" />
                                </Button>
                              )}

                              {/* Complete */}
                              {(appointment.status === "SCHEDULED" ||
                                appointment.status === "CHECKED_IN") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleCompleteAppointment(appointment)
                                  }
                                  title="Mark as Complete"
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}

                              {/* Cancel */}
                              {appointment.status === "SCHEDULED" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    setCancelModal({ open: true, appointment })
                                  }
                                  title="Cancel Appointment"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`flex-1 p-3 border rounded text-center ${
                            isTimeSlotAvailable(time)
                              ? "border-green-300 bg-green-50 text-green-700"
                              : "border-gray-300 bg-gray-50 text-gray-400"
                          }`}
                        >
                          {isTimeSlotAvailable(time)
                            ? "Available"
                            : "Not Available"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === "week" && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-8 gap-2">
              <div className="font-medium">Time</div>
              {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() + dayOffset);
                return (
                  <div
                    key={dayOffset}
                    className="font-medium text-center text-sm"
                  >
                    {date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </div>
                );
              })}
              {timeSlots
                .filter((_, i) => i % 2 === 0)
                .map((time) => (
                  <React.Fragment key={time}>
                    <div className="text-sm py-4">{time}</div>
                    {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                      const date = new Date(selectedDate);
                      date.setDate(date.getDate() + dayOffset);
                      const dayAppointments = appointments.filter((apt) => {
                        const aptDate = new Date(
                          apt.appointmentDateTime
                        ).toDateString();
                        return aptDate === date.toDateString();
                      });
                      const appointment = dayAppointments.find((apt) => {
                        const aptTime = new Date(apt.appointmentDateTime)
                          .toTimeString()
                          .slice(0, 5);
                        return aptTime === time;
                      });
                      return (
                        <div
                          key={`${time}-${dayOffset}`}
                          className="border rounded p-1 min-h-[60px] hover:bg-gray-50"
                        >
                          {appointment && (
                            <div
                              className={`text-xs p-1 rounded ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              <p className="font-medium truncate">
                                {appointment.patientName}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmModal
        open={cancelModal.open}
        onOpenChange={(open) => setCancelModal({ open, appointment: null })}
        title="Cancel Appointment"
        description={`Cancel appointment for ${cancelModal.appointment?.patientName}?`}
        confirmText="Cancel Appointment"
        variant="destructive"
        onConfirm={handleCancelAppointment}
      />

      <ConfirmModal
        open={completeModal.open}
        onOpenChange={(open) => setCompleteModal({ open, appointment: null })}
        title="Complete Appointment"
        description={`Mark appointment with ${completeModal.appointment?.patientName} as completed?`}
        confirmText="Complete Appointment"
        onConfirm={handleCompleteConfirm}
      />

      <ConfirmModal
        open={checkInModal.open}
        onOpenChange={(open) => setCheckInModal({ open, appointment: null })}
        title="Check In Patient"
        description={`Check in patient ${checkInModal.appointment?.patientName}?`}
        confirmText="Check In"
        onConfirm={handleCheckInConfirm}
      />

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

export default ScheduleCalendar;
