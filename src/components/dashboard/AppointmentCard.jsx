import React, { useState } from "react";
import { Baby, Users, CheckSquare, XSquare, CheckCircle } from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";
import AppointmentActions from "../AppointmentActions.jsx";
import AppointmentDetailsModal from "../AppointmentDetailsModal.jsx";
import useUserStore from "../../store/useUserStore.js";
import { useWindowSize } from "../../hooks/useWindowSize.js";

const AppointmentCard = ({
  appointments,
  onStatusChange,
  selectedDate = new Date(),
  patients = [],
  doctors = [],
}) => {
  // Get the logged-in user's ID
  const userId = useUserStore((state) => state.userId);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const { isMobile, isTablet } = useWindowSize();

  // Calculate statistics (cancelled appointments are already excluded from dashboard data)
  const totalAppointments = appointments.total || 0;
  const checkedInCount =
    appointments.upcoming?.filter((apt) => apt.status === "checked_in")
      .length || 0;
  const completedCount = appointments.completed || 0;
  const cancelledCount =
    appointments.upcoming?.filter((apt) => apt.status === "cancelled").length ||
    0;

  const frontContent = (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
      <Baby 
        size={isMobile ? 40 : isTablet ? 48 : 56} 
        className="text-blue-600 transition-all duration-200" 
      />
      <div className="text-center w-full">
        <div className={`font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight ${
          isMobile ? 'text-base' : 'text-lg sm:text-xl'
        }`}>
          {selectedDate.toDateString() === new Date().toDateString()
            ? "Today's Appointments"
            : `${selectedDate.toLocaleDateString("en-US", {
                weekday: isMobile ? "short" : "long",
                year: "numeric",
                month: isMobile ? "short" : "long",
                day: "numeric",
              })} Appointments`}
        </div>
        <div className={`grid gap-2 sm:gap-3 text-xs sm:text-sm ${
          isMobile ? 'grid-cols-1 space-y-1' : 'grid-cols-2'
        }`}>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">Total: {totalAppointments}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
            <span className="truncate">Checked In: {checkedInCount}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
            <span className="truncate">Completed: {completedCount}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <XSquare className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
            <span className="truncate">Cancelled: {cancelledCount}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div
      className="w-full h-full overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`font-semibold text-gray-700 mb-3 text-center ${
        isMobile ? 'text-sm' : 'text-sm'
      }`}>
        Scheduled Appointments
      </div>
      {isMobile ? (
        // Mobile card layout
        <div className="space-y-2">
          {appointments.upcoming?.map((appt) => (
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
                <div className="font-medium truncate">
                  {appt.patientName}
                </div>
              </div>
            </div>
          ))}
          {(!appointments.upcoming || appointments.upcoming.length === 0) && (
            <div className="text-center text-gray-500 text-xs py-4">
              No scheduled appointments
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
            {appointments.upcoming?.map((appt) => (
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
            {(!appointments.upcoming || appointments.upcoming.length === 0) && (
              <tr>
                <td
                  colSpan="3"
                  className="px-2 py-4 text-center text-gray-500 text-xs"
                >
                  No scheduled appointments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

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
    </>
  );
};

export default AppointmentCard;
