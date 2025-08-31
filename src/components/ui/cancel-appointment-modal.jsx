import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "./button.jsx";

const CancelAppointmentModal = ({
  appointment,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [cancellationType, setCancellationType] = useState(
    "CANCELLED_BY_DOCTOR"
  );
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  const cancellationTypes = [
    {
      value: "CANCELLED_BY_DOCTOR",
      label: "Cancelled by Doctor",
      description: "Doctor initiated cancellation",
    },
    {
      value: "CANCELLED_BY_PATIENT",
      label: "Cancelled by Patient",
      description: "Patient requested cancellation",
    },
    {
      value: "NO_SHOW",
      label: "No Show",
      description: "Patient did not attend appointment",
    },
    {
      value: "RESCHEDULED",
      label: "Rescheduled",
      description: "Appointment moved to different time",
    },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!reason.trim()) {
      newErrors.reason = "Please provide a reason for cancellation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onConfirm({
      cancellationType,
      reason: reason.trim(),
      appointment,
    });
  };

  const handleClose = () => {
    setCancellationType("CANCELLED_BY_DOCTOR");
    setReason("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-xl rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Cancel Appointment
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Appointment Info */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">
            Cancelling appointment for:
          </div>
          <div className="font-medium text-gray-900">
            {appointment?.patientName || "Unknown Patient"}
          </div>
          <div className="text-sm text-gray-600">
            {appointment?.appointmentDate} at{" "}
            {appointment?.startTime || appointment?.time}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cancellation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cancellation Type *
            </label>
            <div className="space-y-3">
              {cancellationTypes.map((type) => (
                <div key={type.value} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={type.value}
                      name="cancellationType"
                      type="radio"
                      value={type.value}
                      checked={cancellationType === type.value}
                      onChange={(e) => setCancellationType(e.target.value)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor={type.value}
                      className="font-medium text-gray-900 cursor-pointer"
                    >
                      {type.label}
                    </label>
                    <p className="text-gray-500">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Cancellation *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errors.reason) {
                  setErrors((prev) => ({ ...prev, reason: "" }));
                }
              }}
              className={`w-full px-3 py-2 border rounded-lg bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-400 text-gray-800 resize-none ${
                errors.reason ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              rows={4}
              placeholder="Please provide a detailed reason for the cancellation..."
            />
            {errors.reason && (
              <p className="text-sm text-red-600 mt-1">{errors.reason}</p>
            )}
          </div>

          {/* Warning */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <strong>Warning:</strong> This action cannot be undone. The
                appointment will be permanently cancelled.
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-white/70 border border-white/50 text-gray-700 hover:bg-white/80 font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
              disabled={isLoading}
            >
              Keep Appointment
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Cancelling..." : "Cancel Appointment"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CancelAppointmentModal;
