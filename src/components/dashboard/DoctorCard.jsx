import React, { useState } from "react";
import {
  Stethoscope,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
} from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";
import { ConfirmModal } from "../ui/confirm-modal.jsx";

const DoctorCard = ({ doctors, onStatusChange, onSlotSelection }) => {
  // Ensure doctors data is valid
  const validDoctors = doctors || { availableCount: 0, list: [] };
  const doctorList = validDoctors.list || [];

  // State for modals and selected data
  const [bookingModal, setBookingModal] = useState({
    open: false,
    doctor: null,
    slot: null,
  });
  const [timeoffModal, setTimeoffModal] = useState({
    open: false,
    doctor: null,
    slot: null,
  });
  const [selectedSlots, setSelectedSlots] = useState({});

  const getStatusColor = (status) => {
    if (status === "checked-in") return "text-green-500";
    if (status === "cancelled") return "text-red-500";
    return "text-gray-400";
  };

  const handleSlotSelection = (doctorId, slot) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [doctorId]: slot,
    }));
  };

  const handleBooking = async (doctorId, slot) => {
    try {
      // Call the slot selection handler
      const doctor = doctorList.find((d) => d.id === doctorId);
      if (doctor && slot) {
        onSlotSelection(doctor.name, slot);
      }

      // Update doctor status to indicate booking
      await onStatusChange(doctorId, "checked-in");
      setBookingModal({ open: false, doctor: null, slot: null });
    } catch (error) {
      console.error("Failed to book appointment:", error);
    }
  };

  const handleTimeoff = async (doctorId, slot) => {
    try {
      // Update doctor status to indicate timeoff
      await onStatusChange(doctorId, "cancelled");
      setTimeoffModal({ open: false, doctor: null, slot: null });
    } catch (error) {
      console.error("Failed to add timeoff:", error);
    }
  };

  const frontContent = (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <Stethoscope size={48} className="text-green-600" />
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-800 mb-2">
          Doctors Available
        </div>
        <div className="text-3xl font-bold text-green-600">
          {validDoctors.availableCount}/{doctorList.length}
        </div>
        <div className="text-sm text-gray-600 mt-1">Active doctors today</div>
      </div>
    </div>
  );

  const backContent = (
    <div
      className="w-full h-full overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-sm font-semibold text-gray-700 mb-3 text-center">
        Doctor Schedule
      </div>
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-white/10 backdrop-blur-sm border-b border-white/20">
          <tr>
            <th scope="col" className="px-2 py-2">
              Doctor
            </th>
            <th scope="col" className="px-2 py-2">
              Slots
            </th>
            <th scope="col" className="px-2 py-2 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {doctorList.map((doc) => (
            <tr
              key={doc.id}
              className="bg-white/5 backdrop-blur-sm border-b border-white/10 hover:bg-white/10 transition-colors"
            >
              <td className="px-2 py-2 font-medium text-xs">{doc.name}</td>
              <td className="px-2 py-2">
                {(doc.slots || []).length > 1 ? (
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleSlotSelection(doc.id, e.target.value)
                    }
                    value={selectedSlots[doc.id] || ""}
                  >
                    <option value="">Select time</option>
                    {(doc.slots || []).map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs">{doc.slots?.[0] || "N/A"}</span>
                )}
              </td>
              <td className="px-2 py-2 flex justify-center items-center gap-1">
                <CheckCircle
                  onClick={() => {
                    const slot = selectedSlots[doc.id] || doc.slots?.[0];
                    if (slot) {
                      setBookingModal({ open: true, doctor: doc, slot });
                    }
                  }}
                  className={`cursor-pointer hover:text-green-500 w-4 h-4 ${
                    getStatusColor(doc.status) === "text-green-500"
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                  title="Book Appointment"
                />
                <XCircle
                  onClick={() => {
                    const slot = selectedSlots[doc.id] || doc.slots?.[0];
                    if (slot) {
                      setTimeoffModal({ open: true, doctor: doc, slot });
                    }
                  }}
                  className={`cursor-pointer hover:text-red-500 w-4 h-4 ${
                    getStatusColor(doc.status) === "text-red-500"
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                  title="Add Timeoff"
                />
              </td>
            </tr>
          ))}
          {doctorList.length === 0 && (
            <tr>
              <td
                colSpan="3"
                className="px-2 py-4 text-center text-gray-500 text-xs"
              >
                No doctors available
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

      {/* Booking Confirmation Modal */}
      <ConfirmModal
        open={bookingModal.open}
        onOpenChange={(open) =>
          setBookingModal({ open, doctor: null, slot: null })
        }
        title="Book Appointment"
        description={`Book appointment with ${bookingModal.doctor?.name} at ${bookingModal.slot}?`}
        confirmText="Book Appointment"
        cancelText="Cancel"
        variant="default"
        onConfirm={() =>
          handleBooking(bookingModal.doctor?.id, bookingModal.slot)
        }
      />

      {/* Timeoff Confirmation Modal */}
      <ConfirmModal
        open={timeoffModal.open}
        onOpenChange={(open) =>
          setTimeoffModal({ open, doctor: null, slot: null })
        }
        title="Add Timeoff"
        description={`Add timeoff for ${timeoffModal.doctor?.name} at ${timeoffModal.slot}?`}
        confirmText="Add Timeoff"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={() =>
          handleTimeoff(timeoffModal.doctor?.id, timeoffModal.slot)
        }
      />
    </>
  );
};

export default DoctorCard;
