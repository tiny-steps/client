import React, { useState } from "react";
import {
  Baby,
  Users,
  CheckSquare,
  XSquare,
  CheckCircle,
  Plus,
  Clock,
} from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";
import AppointmentActions from "../AppointmentActions.jsx";
import AppointmentDetailsModal from "../AppointmentDetailsModal.jsx";
import EnhancedAppointmentModal from "../EnhancedAppointmentModal.jsx";
import useUserStore from "../../store/useUserStore.js";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { useGetTimeSlots } from "../../hooks/useTimingQueries.js";

const AppointmentCard = ({
  appointments,
  onStatusChange,
  selectedDate = new Date(),
  patients = [],
  doctors = [],
  sessions = [],
  onNewAppointment = () => {},
}) => {
  // Get the logged-in user's ID
  const userId = useUserStore((state) => state.userId);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const { isMobile, isTablet } = useWindowSize();

  // Filter appointments for today only - moved up to use in hook
  const today = new Date().toDateString();
  const selectedDateString = selectedDate.toDateString();
  const isToday = selectedDateString === today;

  // Get the first available doctor for slot checking (in a real app, this would be configurable)
  const firstDoctor = doctors?.length > 0 ? doctors[0] : null;
  const todayDateString = selectedDate.toISOString().split("T")[0];

  // Fetch available time slots for today to determine if booking should be enabled
  const { data: timeSlotsData } = useGetTimeSlots(
    firstDoctor?.id,
    todayDateString,
    null, // practiceId
    null, // branchId - not available in this context
    { enabled: !!firstDoctor?.id && isToday }
  );

  // Filter available slots to only include future times (for today only)
  const allAvailableSlots =
    timeSlotsData?.data?.slots?.filter((slot) => slot.status === "available") ||
    [];
  const futureAvailableSlots = isToday
    ? allAvailableSlots.filter((slot) => {
        const currentTime = new Date();
        const slotDateTime = new Date();
        const [hours, minutes] = slot.startTime.split(":").map(Number);
        slotDateTime.setHours(hours, minutes, 0, 0);
        return slotDateTime > currentTime;
      })
    : allAvailableSlots;

  const availableSlots = futureAvailableSlots;
  const hasAvailableSlots = availableSlots.length > 0;

  // Get today's appointments if viewing today, otherwise get selected date appointments
  const todaysAppointments =
    appointments.upcoming?.filter((apt) => {
      if (!apt.date) return false;
      const aptDate = new Date(apt.date).toDateString();
      return aptDate === selectedDateString;
    }) || [];

  // Calculate statistics for the selected date
  const totalAppointments = todaysAppointments.length;
  const checkedInCount = todaysAppointments.filter(
    (apt) => apt.status === "checked_in"
  ).length;
  const completedCount = todaysAppointments.filter(
    (apt) => apt.status === "completed"
  ).length;
  const cancelledCount = todaysAppointments.filter(
    (apt) => apt.status === "cancelled"
  ).length;

  const frontContent = (
    <div className="flex flex-col h-full w-full relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 pb-10">
        {/* Icon */}
        <Baby
          size={isMobile ? 36 : isTablet ? 42 : 48}
          className="text-blue-600 transition-all duration-200"
        />

        {/* Appointment Count */}
        <div className="text-center w-full">
          <div
            className={`font-bold text-gray-800 mb-1 leading-tight ${
              isMobile ? "text-lg" : "text-xl sm:text-2xl"
            }`}
          >
            {selectedDate.toDateString() === new Date().toDateString()
              ? "Today's Appointments"
              : `Appointments`}
          </div>

          {/* Large Appointment Number */}
          <div
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 mb-3 ${
              isMobile ? "text-3xl" : ""
            }`}
          >
            {totalAppointments}
          </div>

          {/* Slots Available */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
            <Clock className="w-4 h-4" />
            <span>
              {isToday
                ? `${availableSlots.length} slots available today`
                : `View details for ${selectedDate.toLocaleDateString()}`}
            </span>
          </div>
        </div>
      </div>

      {/* Book Appointment Button - Bottom Center */}
      {isToday && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowNewAppointmentModal(true);
          }}
          disabled={!hasAvailableSlots}
          className={`absolute top-52 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            hasAvailableSlots
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          title={
            hasAvailableSlots ? "Book new appointment" : "No slots available"
          }
        >
          <Plus size={16} />
          <span className="whitespace-nowrap">
            {isMobile ? "Book" : "Book Appointment"}
          </span>
        </button>
      )}
    </div>
  );

  const backContent = (
    <div
      className="w-full h-full overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header positioned inline with back icon */}
      <div className="absolute top-3 left-12 sm:top-4 sm:left-14 z-10">
        <h3 className="font-bold text-gray-800 text-base whitespace-nowrap">
          {isToday
            ? "Today's Appointments"
            : `${selectedDate.toLocaleDateString()} Appointments`}
        </h3>
      </div>
      <div className="pt-8">
        {isMobile ? (
          // Mobile card layout
          <div className="space-y-2">
            {todaysAppointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedAppointment(appt);
                  setShowAppointmentModal(true);
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-medium text-gray-700">
                    {appt.time}
                  </div>
                  <AppointmentActions
                    appointment={appt}
                    onView={(appointment) => {
                      setSelectedAppointment(appointment);
                      setShowAppointmentModal(true);
                    }}
                    size="sm"
                    patients={patients}
                    doctors={doctors}
                  />
                </div>
                <div className="text-xs text-gray-600">
                  <div className="font-medium truncate">{appt.patientName}</div>
                </div>
              </div>
            ))}
            {todaysAppointments.length === 0 && (
              <div className="text-center text-gray-500 text-xs py-4">
                {isToday ? (
                  <div className="space-y-2">
                    <div>No appointments today</div>
                    <button
                      onClick={() => setShowNewAppointmentModal(true)}
                      disabled={!hasAvailableSlots}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-colors text-xs ${
                        hasAvailableSlots
                          ? "bg-blue-100 hover:bg-blue-200 text-blue-600"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      title={
                        hasAvailableSlots
                          ? "Add new appointment"
                          : "No slots available"
                      }
                    >
                      <Plus size={12} />
                      Add Appointment
                    </button>
                  </div>
                ) : (
                  "No scheduled appointments"
                )}
              </div>
            )}
          </div>
        ) : (
          // Desktop table layout
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-white/10 backdrop-blur-sm border-b border-white/20">
              <tr>
                <th scope="col" className="px-2 py-2">
                  Patient
                </th>
                <th scope="col" className="px-2 py-2">
                  Time
                </th>
                <th scope="col" className="px-2 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {todaysAppointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="bg-white/5 backdrop-blur-sm border-b border-white/10 hover:bg-white/10 transition-colors"
                >
                  <td className="px-2 py-2 font-medium text-xs truncate max-w-24">
                    {appt.patientName}
                  </td>
                  <td className="px-2 py-2 text-xs">{appt.time}</td>
                  <td className="px-2 py-2 flex justify-center items-center">
                    <AppointmentActions
                      appointment={appt}
                      onView={(appointment) => {
                        setSelectedAppointment(appointment);
                        setShowAppointmentModal(true);
                      }}
                      size="sm"
                      patients={patients}
                      doctors={doctors}
                    />
                  </td>
                </tr>
              ))}
              {todaysAppointments.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-2 py-4 text-center text-gray-500 text-xs"
                  >
                    {isToday ? (
                      <div className="space-y-2">
                        <div>No appointments today</div>
                        <button
                          onClick={() => setShowNewAppointmentModal(true)}
                          disabled={!hasAvailableSlots}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-colors text-xs ${
                            hasAvailableSlots
                              ? "bg-blue-100 hover:bg-blue-200 text-blue-600"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                          title={
                            hasAvailableSlots
                              ? "Add new appointment"
                              : "No slots available"
                          }
                        >
                          <Plus size={12} />
                          Add Appointment
                        </button>
                      </div>
                    ) : (
                      "No scheduled appointments"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const handleNewAppointmentSubmit = async (appointmentData) => {
    try {
      await onNewAppointment(appointmentData);
      setShowNewAppointmentModal(false);
    } catch (error) {
      console.error("Failed to create appointment:", error);
      // Modal will handle error display
    }
  };

  return (
    <>
      <FlippableCard frontContent={frontContent} backContent={backContent} />

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setSelectedAppointment(null);
        }}
        onStatusChange={onStatusChange}
        patients={patients}
        doctors={doctors}
      />

      {/* New Appointment Modal */}
      <EnhancedAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSubmit={handleNewAppointmentSubmit}
        selectedDate={selectedDate.toISOString().split("T")[0]}
        patients={patients}
        doctors={doctors}
        sessions={sessions}
        appointments={appointments.upcoming || []}
      />
    </>
  );
};

export default AppointmentCard;
