import React, { useState } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Stethoscope,
  Calendar,
  FileText,
} from "lucide-react";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import useUserStore from "../store/useUserStore.js";

const AppointmentDetailsModal = ({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
  patients = [],
  doctors = [],
}) => {
  const userId = useUserStore((state) => state.userId);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
  });

  if (!appointment) return null;

  // Find patient and doctor details
  const patient = patients.find((p) => p.id === appointment.patientId);
  const doctor = doctors.find((d) => d.id === appointment.doctorId);

  const patientName = patient
    ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim()
    : appointment.patientName || "Unknown Patient";

  const doctorName = doctor
    ? `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim()
    : appointment.doctorName || "Unknown Doctor";

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
      CHECKED_IN: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const statusMap = {
      SCHEDULED: "Scheduled",
      CHECKED_IN: "Checked In",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
    };
    return statusMap[status] || status;
  };

  const handleAction = async (action) => {
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
          statusData.reason = "Appointment cancelled by doctor";
          statusData.cancellationType = "CANCELLED_BY_DOCTOR";
          break;
        default:
          return;
      }

      await onStatusChange(appointment.id, statusData.status.toLowerCase(), {
        reason: statusData.reason,
        cancellationType: statusData.cancellationType,
      });

      setConfirmModal({ open: false, action: null });
      onClose();
    } catch (error) {
      console.error(`Failed to ${action} appointment:`, error);
    }
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return time.includes(":") ? time.substring(0, 5) : time;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Appointment Details</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex justify-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {getStatusText(appointment.status)}
                </span>
              </div>

              {/* Patient Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">{patientName}</div>
                  <div className="text-sm text-gray-600">Patient</div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Stethoscope className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">{doctorName}</div>
                  <div className="text-sm text-gray-600">Doctor</div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDate(appointment.appointmentDate)}
                    </div>
                    <div className="text-sm text-gray-600">Date</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatTime(appointment.startTime)}
                    </div>
                    <div className="text-sm text-gray-600">Time</div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Notes</div>
                    <div className="text-sm text-gray-600">
                      {appointment.notes}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                <div className="flex gap-2">
                  {appointment.status === "SCHEDULED" && (
                    <button
                      onClick={() =>
                        setConfirmModal({ open: true, action: "check-in" })
                      }
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Check In
                    </button>
                  )}

                  {(appointment.status === "SCHEDULED" ||
                    appointment.status === "CHECKED_IN") && (
                    <button
                      onClick={() =>
                        setConfirmModal({ open: true, action: "complete" })
                      }
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </button>
                  )}

                  {appointment.status === "SCHEDULED" && (
                    <button
                      onClick={() =>
                        setConfirmModal({ open: true, action: "cancel" })
                      }
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal({ open, action: null })}
        title={
          confirmModal.action === "check-in"
            ? "Check In Patient"
            : confirmModal.action === "complete"
            ? "Complete Appointment"
            : confirmModal.action === "cancel"
            ? "Cancel Appointment"
            : ""
        }
        description={
          confirmModal.action === "check-in"
            ? `Mark ${patientName} as checked in?`
            : confirmModal.action === "complete"
            ? `Mark appointment with ${patientName} as completed?`
            : confirmModal.action === "cancel"
            ? `Cancel appointment for ${patientName}?`
            : ""
        }
        confirmText={
          confirmModal.action === "check-in"
            ? "Check In"
            : confirmModal.action === "complete"
            ? "Complete"
            : confirmModal.action === "cancel"
            ? "Cancel Appointment"
            : ""
        }
        cancelText="Cancel"
        variant={confirmModal.action === "cancel" ? "destructive" : "default"}
        onConfirm={() => handleAction(confirmModal.action)}
      />
    </>
  );
};

export default AppointmentDetailsModal;
