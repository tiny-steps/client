import React, { useState } from "react";
import { createPortal } from "react-dom";
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
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Appointment Details</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Patient Information */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <User className="text-blue-600" size={20} />
                  <div>
                    <div className="font-medium text-gray-900">
                      {patient
                        ? `${patient.firstName} ${patient.lastName}`
                        : appointment.patientName || "Unknown Patient"}
                    </div>
                    <div className="text-sm text-gray-600">Patient</div>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Stethoscope className="text-green-600" size={20} />
                  <div>
                    <div className="font-medium text-gray-900">
                      {doctor
                        ? `${doctor.firstName} ${doctor.lastName}`
                        : appointment.doctorName || "Unknown Doctor"}
                    </div>
                    <div className="text-sm text-gray-600">Doctor</div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-500" size={16} />
                    <span className="text-sm text-gray-600">
                      Date: {formatDate(appointment.appointmentDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-gray-500" size={16} />
                    <span className="text-sm text-gray-600">
                      Time: {formatTime(appointment.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="text-gray-500" size={16} />
                    <span className="text-sm text-gray-600">
                      Status:{" "}
                      <span className="font-medium capitalize">
                        {appointment.status?.toLowerCase()}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  {appointment.status === "SCHEDULED" && (
                    <button
                      onClick={() =>
                        setConfirmModal({ open: true, action: "check-in" })
                      }
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock size={16} />
                      Check In
                    </button>
                  )}

                  {(appointment.status === "SCHEDULED" ||
                    appointment.status === "CHECKED_IN") && (
                    <button
                      onClick={() =>
                        setConfirmModal({ open: true, action: "complete" })
                      }
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal({ open, action: null })}
        onConfirm={() => handleAction(confirmModal.action)}
        title={`${
          confirmModal.action === "check-in" ? "Check In" : "Complete"
        } Appointment`}
        message={`Are you sure you want to ${confirmModal.action} this appointment?`}
      />
    </>
  );
};

export default AppointmentDetailsModal;
