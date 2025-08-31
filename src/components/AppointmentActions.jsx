import React, { useState } from "react";
import { Eye, CheckCircle, X, Clock } from "lucide-react";
import { useChangeAppointmentStatus } from "../hooks/useScheduleQueries.js";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import { ErrorModal } from "./ui/error-modal.jsx";
import CancelAppointmentModal from "./ui/cancel-appointment-modal.jsx";
import AppointmentDetailsModal from "./AppointmentDetailsModal.jsx";
import useUserStore from "../store/useUserStore.js";

const AppointmentActions = ({
  appointment,
  onView,
  size = "sm",
  showLabels = false,
  className = "",
  patients = [],
  doctors = [],
  hideViewAction = false,
}) => {
  const userId = useUserStore((state) => state.userId);
  const changeStatusMutation = useChangeAppointmentStatus();
  const queryClient = useQueryClient();

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
    title: "",
    message: "",
  });

  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isSmall = size === "sm";
  const iconSize = isSmall ? 14 : 16;
  const buttonSize = isSmall ? "w-6 h-6" : "w-8 h-8";

  const handleAction = async (action) => {
    if (!appointment) {
      console.warn("❌ No appointment provided to handleAction");
      return;
    }

    try {
      let statusData = {
        status: "",
        changedById: userId,
        reason: "",
      };

      const appointmentStatus = appointment.status?.toUpperCase();

      switch (action) {
        case "check-in":
          if (appointmentStatus === "SCHEDULED") {
            statusData.status = "CHECKED_IN";
            statusData.reason = "Patient checked in";
          } else {
            console.warn(
              "Cannot check in appointment with status:",
              appointment.status
            );
            return;
          }
          break;
        case "complete":
          if (
            appointmentStatus === "SCHEDULED" ||
            appointmentStatus === "CHECKED_IN"
          ) {
            statusData.status = "COMPLETED";
            statusData.reason = "Appointment completed successfully";
          } else {
            console.warn(
              "Cannot complete appointment with status:",
              appointment.status
            );
            return;
          }
          break;

        default:
          return;
      }

      await changeStatusMutation.mutateAsync({
        id: appointment.id,
        statusData,
      });

      setConfirmModal({ open: false, action: null, title: "", message: "" });

      // Refresh appointments data
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    } catch (error) {
      console.error(`Failed to ${action} appointment:`, error);
      setErrorModal({
        open: true,
        title: `Failed to ${action} appointment`,
        message:
          error.message ||
          `An error occurred while trying to ${action} the appointment. Please try again.`,
      });
    }
  };

  const showConfirmModal = (action, title, message) => {
    setConfirmModal({ open: true, action, title, message });
  };

  const handleCancelAppointment = async (cancelData) => {
    try {
      const { cancellationType, reason, appointment: appt } = cancelData;

      const statusData = {
        status: "CANCELLED",
        changedById: userId,
        reason: reason,
        cancellationType: cancellationType,
      };

      await changeStatusMutation.mutateAsync({
        id: appt.id,
        statusData,
      });

      setShowCancelModal(false);

      // Refresh appointments data
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      // Also refresh dashboard data if it exists
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      setErrorModal({
        open: true,
        title: "Failed to cancel appointment",
        message:
          error.message ||
          "An error occurred while cancelling the appointment. Please try again.",
      });
      setShowCancelModal(false);
    }
  };

  const canCheckIn = appointment?.status?.toUpperCase() === "SCHEDULED";
  const canComplete =
    appointment?.status?.toUpperCase() === "SCHEDULED" ||
    appointment?.status?.toUpperCase() === "CHECKED_IN";
  const canCancel =
    appointment?.status?.toUpperCase() === "SCHEDULED" ||
    appointment?.status?.toUpperCase() === "CHECKED_IN";

  // Status check completed

  return (
    <>
      <div className={`flex gap-1 ${className}`}>
        {/* View Appointment */}
        {!hideViewAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetailsModal(true);
            }}
            className={`${buttonSize} flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition-colors`}
            title="View appointment details"
          >
            <Eye size={iconSize} />
            {showLabels && <span className="ml-1 text-xs">View</span>}
          </button>
        )}

        {/* Check-in Appointment */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canCheckIn) {
              showConfirmModal(
                "check-in",
                "Check In Patient",
                `Are you sure you want to check in ${
                  appointment.patientName || "the patient"
                }?`
              );
            }
          }}
          className={`${buttonSize} flex items-center justify-center rounded transition-colors ${
            canCheckIn
              ? "bg-green-100 hover:bg-green-200 text-green-600"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          title={
            canCheckIn
              ? "Check in patient"
              : "Cannot check in - appointment not scheduled"
          }
          disabled={!canCheckIn}
        >
          <Clock size={iconSize} />
          {showLabels && <span className="ml-1 text-xs">Check-in</span>}
        </button>

        {/* Complete Appointment */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canComplete) {
              showConfirmModal(
                "complete",
                "Complete Appointment",
                `Are you sure you want to mark the appointment with ${
                  appointment.patientName || "the patient"
                } as completed?`
              );
            }
          }}
          className={`${buttonSize} flex items-center justify-center rounded transition-colors ${
            canComplete
              ? "bg-purple-100 hover:bg-purple-200 text-purple-600"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          title={
            canComplete
              ? "Complete appointment"
              : "Cannot complete - appointment not in progress"
          }
          disabled={!canComplete}
        >
          <CheckCircle size={iconSize} />
          {showLabels && <span className="ml-1 text-xs">Complete</span>}
        </button>

        {/* Cancel Appointment */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canCancel) {
              setShowCancelModal(true);
            }
          }}
          className={`${buttonSize} flex items-center justify-center rounded transition-colors ${
            canCancel
              ? "bg-red-100 hover:bg-red-200 text-red-600"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          title={
            canCancel
              ? "Cancel appointment"
              : "Cannot cancel - appointment not in progress"
          }
          disabled={!canCancel}
        >
          <X size={iconSize} />
          {showLabels && <span className="ml-1 text-xs">Cancel</span>}
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onOpenChange={(open) =>
          setConfirmModal({ open, action: null, title: "", message: "" })
        }
        onConfirm={() => handleAction(confirmModal.action)}
        title={confirmModal.title}
        description={confirmModal.message}
      />

      {/* Error Modal */}
      <ErrorModal
        open={errorModal.open}
        onOpenChange={(open) => setErrorModal({ open, title: "", message: "" })}
        title={errorModal.title}
        description={errorModal.message}
      />

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={appointment}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onStatusChange={async (id, action, options) => {
          try {
            let statusData = {
              status: "",
              changedById: userId,
              reason: "",
            };

            switch (action) {
              case "check-in":
                statusData.status = "CHECKED_IN";
                statusData.reason = "Patient checked in";
                break;
              case "complete":
                statusData.status = "COMPLETED";
                statusData.reason = "Appointment completed successfully";
                break;
              case "cancel":
                statusData.status = "CANCELLED";
                statusData.reason =
                  options?.reason || "Appointment cancelled by doctor";
                statusData.cancellationType =
                  options?.cancellationType || "CANCELLED_BY_DOCTOR";
                break;
              default:
                return;
            }

            await changeStatusMutation.mutateAsync({
              id,
              statusData,
            });

            // Refresh appointments data
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
          } catch (error) {
            console.error(`Failed to ${action} appointment:`, error);
            setErrorModal({
              open: true,
              title: `Failed to ${action} appointment`,
              message:
                error.message ||
                `An error occurred while trying to ${action} the appointment. Please try again.`,
            });
          }
        }}
        patients={patients}
        doctors={doctors}
      />

      {/* Cancel Appointment Modal */}
      <CancelAppointmentModal
        appointment={appointment}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelAppointment}
        isLoading={changeStatusMutation.isPending}
      />
    </>
  );
};

export default AppointmentActions;
