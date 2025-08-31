import React, { useState } from "react";
import { Baby, Users, CheckSquare, XSquare, CheckCircle } from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";
import AppointmentActions from "../AppointmentActions.jsx";
import AppointmentDetailsModal from "../AppointmentDetailsModal.jsx";
import useUserStore from "../../store/useUserStore.js";

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
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <Baby size={48} className="text-blue-600" />
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-800 mb-2">
          {selectedDate.toDateString() === new Date().toDateString()
            ? "Today's Appointments"
            : `${selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })} Appointments`}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Total: {totalAppointments}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-green-500" />
            <span>Checked In: {checkedInCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Completed: {completedCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <XSquare className="w-4 h-4 text-red-500" />
            <span>Cancelled: {cancelledCount}</span>
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
      <div className="text-sm font-semibold text-gray-700 mb-3 text-center">
        Scheduled Appointments
      </div>
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
              <td className="px-2 py-2 font-medium text-xs">
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
