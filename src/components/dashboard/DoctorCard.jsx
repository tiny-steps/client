import React, { useState } from "react";
import { Stethoscope, XCircle, Plus } from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";
import { useWindowSize } from "../../hooks/useWindowSize.js";

const DoctorCard = ({
  doctors,
  onStatusChange,
  onSlotSelection,
  selectedDate,
  onBookAppointment,
  onCreateTimeOff,
}) => {
  const { isMobile, isTablet } = useWindowSize();
  const [selectedSlots, setSelectedSlots] = useState({});

  // Get today's date string for API call
  const todayString = selectedDate
    ? selectedDate instanceof Date
      ? selectedDate.toISOString().split("T")[0]
      : selectedDate.toString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  // Ensure doctors data is valid
  const validDoctors = doctors || { availableCount: 0, list: [] };
  const doctorList = validDoctors.list || [];

  // For now, we'll show default slots until we implement proper time slot fetching
  // TODO: Implement proper time slot fetching for each doctor
  const getDefaultSlots = () => {
    const currentHour = new Date().getHours();
    const defaultSlots = [
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];
    return defaultSlots.filter((slot) => {
      const slotHour = parseInt(slot.split(":")[0]);
      return slotHour > currentHour; // Only show future slots for today
    });
  };

  const todaysSlots = getDefaultSlots();

  const handleSlotChange = (doctorId, slot) => {
    setSelectedSlots((prev) => ({ ...prev, [doctorId]: slot }));
    onSlotSelection(doctorId, slot);
  };

  const handleBookAppointment = (doctorId) => {
    const selectedSlot = selectedSlots[doctorId];
    if (selectedSlot && onBookAppointment) {
      onBookAppointment(doctorId, selectedSlot, selectedDate);
    }
  };

  const handleTimeOff = (doctorId) => {
    const selectedSlot = selectedSlots[doctorId];
    if (selectedSlot && onCreateTimeOff) {
      onCreateTimeOff(doctorId, selectedSlot, selectedDate);
    }
  };

  const getStatusColor = (status) => {
    if (status === "checked-in") return "text-green-500";
    if (status === "cancelled") return "text-red-500";
    return "text-gray-400";
  };

  const frontContent = (
    <div className="flex flex-col h-full w-full relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 pb-10">
        {/* Icon */}
        <Stethoscope
          size={isMobile ? 36 : isTablet ? 42 : 48}
          className="text-green-600 transition-all duration-200"
        />

        {/* Title and Count */}
        <div className="text-center w-full">
          <div
            className={`font-bold text-gray-800 mb-1 leading-tight ${
              isMobile ? "text-lg" : "text-xl sm:text-2xl"
            }`}
          >
            Doctors Available Today
          </div>

          {/* Large Available Count */}
          <div
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-green-600 mb-3 ${
              isMobile ? "text-3xl" : ""
            }`}
          >
            {validDoctors.availableCount || 0}
          </div>

          {/* Spacing element to match AppointmentCard slots text */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6 opacity-0">
            <span>spacing</span>
          </div>
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div className="w-full h-full flex flex-col">
      {/* Header positioned inline with back icon */}
      <div className="absolute top-3 left-12 sm:top-4 sm:left-14 z-10">
        <h3 className="font-bold text-gray-800 text-base whitespace-nowrap">
          Doctors
        </h3>
      </div>

      {/* Doctor count in top right with same color as front icon */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
        <span className="text-base font-bold text-green-600">
          {doctorList.length}
        </span>
      </div>
      <div className="flex-1 overflow-auto pt-8">
        {doctorList.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm text-center px-4">
            No doctors available
          </div>
        ) : (
          <div className="space-y-2">
            {isMobile ? (
              // Mobile card layout
              <div className="space-y-2">
                {doctorList.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium text-gray-800 truncate flex-1 mr-2">
                        {doc.name}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Plus
                          onClick={() => handleBookAppointment(doc.id)}
                          className={`cursor-pointer w-4 h-4 ${
                            selectedSlots[doc.id] && todaysSlots.length > 0
                              ? "text-blue-500 hover:text-blue-600"
                              : "text-gray-300 cursor-not-allowed"
                          }`}
                          title={
                            selectedSlots[doc.id] && todaysSlots.length > 0
                              ? "Book appointment at selected time"
                              : "Select a time slot first"
                          }
                        />
                        <XCircle
                          onClick={() => handleTimeOff(doc.id)}
                          className={`cursor-pointer w-4 h-4 ${
                            selectedSlots[doc.id] && todaysSlots.length > 0
                              ? "text-red-500 hover:text-red-600"
                              : "text-gray-300 cursor-not-allowed"
                          }`}
                          title={
                            selectedSlots[doc.id] && todaysSlots.length > 0
                              ? "Create time off at selected time"
                              : "Select a time slot first"
                          }
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div className="mb-1">
                        <span className="font-medium">Today's Slots:</span>
                      </div>
                      {todaysSlots.length > 1 ? (
                        <select
                          className="bg-white border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleSlotChange(doc.id, e.target.value)
                          }
                          value={selectedSlots[doc.id] || ""}
                        >
                          <option value="" disabled>
                            Select time
                          </option>
                          {todaysSlots.map((slot, index) => (
                            <option key={index} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-800">
                          {todaysSlots[0] || "No slots available"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop table layout
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-white/10 backdrop-blur-sm border-b border-white/20">
                    <tr>
                      <th scope="col" className="px-4 py-2">
                        Doctor
                      </th>
                      <th scope="col" className="px-4 py-2">
                        Slots
                      </th>
                      <th scope="col" className="px-4 py-2 text-center">
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
                        <td className="px-4 py-2 font-medium truncate max-w-24">
                          {doc.name}
                        </td>
                        <td className="px-4 py-2">
                          {todaysSlots.length > 1 ? (
                            <select
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleSlotChange(doc.id, e.target.value)
                              }
                              value={selectedSlots[doc.id] || ""}
                            >
                              <option value="" disabled>
                                Select time
                              </option>
                              {todaysSlots.map((slot, index) => (
                                <option key={index} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span>
                              {todaysSlots[0] || "No slots available"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 flex justify-center items-center gap-2">
                          <Plus
                            onClick={() => handleBookAppointment(doc.id)}
                            className={`cursor-pointer w-4 h-4 ${
                              selectedSlots[doc.id] && todaysSlots.length > 0
                                ? "text-blue-500 hover:text-blue-600"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title={
                              selectedSlots[doc.id] && todaysSlots.length > 0
                                ? "Book appointment at selected time"
                                : "Select a time slot first"
                            }
                          />
                          <XCircle
                            onClick={() => handleTimeOff(doc.id)}
                            className={`cursor-pointer w-4 h-4 ${
                              selectedSlots[doc.id] && todaysSlots.length > 0
                                ? "text-red-500 hover:text-red-600"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title={
                              selectedSlots[doc.id] && todaysSlots.length > 0
                                ? "Create time off at selected time"
                                : "Select a time slot first"
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hints section */}
      <div className="px-4 pt-2">
        <div className="text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="w-3 h-3 text-blue-500" />
              <span>Book appointment</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-3 h-3 text-red-500" />
              <span>Create time off</span>
            </div>
          </div>
          <div className="text-center">
            Select a time slot first to enable actions
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <FlippableCard frontContent={frontContent} backContent={backContent} />
  );
};

export default DoctorCard;
