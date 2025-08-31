import React, { useState } from "react";
import {
  Baby,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  CheckSquare,
  XSquare,
} from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";
import { ConfirmModal } from "../ui/confirm-modal.jsx";
import useUserStore from "../../store/useUserStore.js";

const AppointmentCard = ({ appointments, onStatusChange }) => {
  // Get the logged-in user's ID
  const userId = useUserStore((state) => state.userId);

  // State for modals
  const [checkInModal, setCheckInModal] = useState({
    open: false,
    appointment: null,
  });
  const [cancelModal, setCancelModal] = useState({
    open: false,
    appointment: null,
  });

  const getStatusColor = (status) => {
    if (status === "completed") return "text-green-500";
    if (status === "cancelled") return "text-red-500";
    if (status === "checked_in") return "text-blue-500";
    return "text-gray-400";
  };

  const handleCheckIn = async (appointmentId) => {
    try {
      await onStatusChange(appointmentId, "checked_in", {
        reason: "Patient checked in",
      });
      setCheckInModal({ open: false, appointment: null });
    } catch (error) {
      console.error("Failed to check in patient:", error);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await onStatusChange(appointmentId, "cancelled", {
        reason: "Appointment cancelled by doctor",
        cancellationType: "CANCELLED_BY_DOCTOR",
      });
      setCancelModal({ open: false, appointment: null });
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  // Calculate statistics
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
          Today's Appointments
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
              <td className="px-2 py-2 flex justify-center items-center gap-1">
                <CheckCircle
                  onClick={() =>
                    setCheckInModal({ open: true, appointment: appt })
                  }
                  className={`cursor-pointer hover:text-green-500 w-4 h-4 ${
                    getStatusColor(appt.status) === "text-green-500"
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                  title="Check In Patient"
                />
                <XCircle
                  onClick={() =>
                    setCancelModal({ open: true, appointment: appt })
                  }
                  className={`cursor-pointer hover:text-red-500 w-4 h-4 ${
                    getStatusColor(appt.status) === "text-red-500"
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                  title="Cancel Appointment"
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

      {/* Check In Confirmation Modal */}
      <ConfirmModal
        open={checkInModal.open}
        onOpenChange={(open) => setCheckInModal({ open, appointment: null })}
        title="Check In Patient"
        description={`Mark ${checkInModal.appointment?.patientName} as checked in?`}
        confirmText="Check In"
        cancelText="Cancel"
        variant="default"
        onConfirm={() => handleCheckIn(checkInModal.appointment?.id)}
      />

      {/* Cancel Appointment Confirmation Modal */}
      <ConfirmModal
        open={cancelModal.open}
        onOpenChange={(open) => setCancelModal({ open, appointment: null })}
        title="Cancel Appointment"
        description={`Cancel appointment for ${cancelModal.appointment?.patientName}?`}
        confirmText="Cancel Appointment"
        cancelText="Keep Appointment"
        variant="destructive"
        onConfirm={() => handleCancel(cancelModal.appointment?.id)}
      />
    </>
  );
};

export default AppointmentCard;
