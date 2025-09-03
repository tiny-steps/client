import React from "react";
import { BookMarked } from "lucide-react";
import BookingPieChart from "../BookingPieChart.jsx";
import FlippableCard from "../FlipableCard.jsx";
import { useWindowSize } from "../../hooks/useWindowSize.js";

const BookingStatsCard = ({ bookingStats }) => {
  const { isMobile, isTablet } = useWindowSize();

  // Define color scheme for better UX
  const colors = {
    scheduled: "#3B82F6", // Blue - for scheduled appointments
    checkedIn: "#10B981", // Green - for checked in (positive action)
    cancelledByDoctor: "#F59E0B", // Amber - for doctor cancellations
    cancelledByPatient: "#EF4444", // Red - for patient cancellations
    rescheduled: "#8B5CF6", // Purple - for rescheduled
    noShow: "#6B7280", // Gray - for no shows
  };

  // Prepare chart data with detailed breakdown
  const chartData = [
    {
      label: "Scheduled",
      value: bookingStats.scheduled || 0,
      color: colors.scheduled,
    },
    {
      label: "Checked In",
      value: bookingStats.checkedIn || 0,
      color: colors.checkedIn,
    },
    {
      label: "Cancelled by Doctor",
      value: bookingStats.byDoctor || 0,
      color: colors.cancelledByDoctor,
    },
    {
      label: "Cancelled by Patient",
      value: bookingStats.byPatient || 0,
      color: colors.cancelledByPatient,
    },
    {
      label: "Rescheduled",
      value: bookingStats.rescheduled || 0,
      color: colors.rescheduled,
    },
    {
      label: "No Show",
      value: bookingStats.missedNoShow || 0,
      color: colors.noShow,
    },
  ].filter((item) => item.value > 0); // Only show categories with data

  const hasData = bookingStats.total > 0;

  const frontContent = (
    <div className="flex flex-col h-full w-full relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 pb-10">
        {/* Icon */}
        <BookMarked
          size={isMobile ? 36 : isTablet ? 42 : 48}
          className="text-purple-600 transition-all duration-200"
        />

        {/* Title and Count */}
        <div className="text-center w-full">
          <div
            className={`font-bold text-gray-800 mb-1 leading-tight ${
              isMobile ? "text-lg" : "text-xl sm:text-2xl"
            }`}
          >
            Today's Bookings
          </div>

          {/* Large Booking Count */}
          <div
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-purple-600 mb-3 ${
              isMobile ? "text-3xl" : ""
            }`}
          >
            {bookingStats.total}
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
          Booking Breakdown
        </h3>
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <BookMarked size={24} className="text-gray-400" />
          </div>
          <div className="text-gray-500">
            <div className="text-sm font-medium mb-1">No bookings yet</div>
            <div className="text-xs text-gray-400">Start scheduling</div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between px-4 pt-8">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <div className={isMobile ? "scale-75" : "scale-85"}>
              <BookingPieChart
                data={chartData}
                size={isMobile ? 100 : 120}
                showLegend={false}
              />
            </div>
          </div>

          {/* Statistics Grid */}
          <div
            className={`grid gap-2 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors.scheduled }}
              ></div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm font-semibold text-gray-800">
                  {bookingStats.scheduled || 0}
                </span>
                <span className="text-xs text-gray-600">Scheduled</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors.checkedIn }}
              ></div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm font-semibold text-gray-800">
                  {bookingStats.checkedIn || 0}
                </span>
                <span className="text-xs text-gray-600">Checked</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors.cancelledByDoctor }}
              ></div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm font-semibold text-gray-800">
                  {bookingStats.byDoctor || 0}
                </span>
                <span className="text-xs text-gray-600">
                  Cancelled by Doctor
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors.cancelledByPatient }}
              ></div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm font-semibold text-gray-800">
                  {bookingStats.byPatient || 0}
                </span>
                <span className="text-xs text-gray-600">
                  Cancelled by Patient
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors.rescheduled }}
              ></div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm font-semibold text-gray-800">
                  {bookingStats.rescheduled || 0}
                </span>
                <span className="text-xs text-gray-600">Reschedule</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors.noShow }}
              ></div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm font-semibold text-gray-800">
                  {bookingStats.missedNoShow || 0}
                </span>
                <span className="text-xs text-gray-600">No Show</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equal bottom spacing */}
      <div className="pb-4"></div>
    </div>
  );

  return (
    <FlippableCard frontContent={frontContent} backContent={backContent} />
  );
};

export default BookingStatsCard;
