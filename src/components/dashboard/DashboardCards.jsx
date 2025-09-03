import React from "react";
import AppointmentCard from "./AppointmentCard.jsx";
import DoctorCard from "./DoctorCard.jsx";
import BookingStatsCard from "./BookingStatsCard.jsx";
import NotificationCard from "./NotificationCard.jsx";
import ReportCard from "./ReportCard.jsx";
import PaymentCard from "./PaymentCard.jsx";
import AnalyticsCard from "./AnalyticsCard.jsx";

const DashboardCards = ({
  appointments,
  doctors,
  bookingStats,
  onAppointmentStatusChange,
  onDoctorStatusChange,
  onSlotSelection,
  selectedDate,
  rawPatients = [],
  rawDoctors = [],
}) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Primary Dashboard Cards - Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
        <div className="w-full flex justify-center">
          <AppointmentCard
            appointments={appointments}
            onStatusChange={onAppointmentStatusChange}
            selectedDate={selectedDate}
            patients={rawPatients}
            doctors={rawDoctors}
          />
        </div>
        <div className="w-full flex justify-center">
          <DoctorCard
            doctors={doctors}
            onStatusChange={onDoctorStatusChange}
            onSlotSelection={onSlotSelection}
          />
        </div>
        <div className="w-full flex justify-center md:col-span-2 xl:col-span-1">
          <BookingStatsCard bookingStats={bookingStats} />
        </div>
      </div>

      {/* Quick Action Cards - Secondary Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="w-full flex justify-center">
          <NotificationCard selectedDate={selectedDate} />
        </div>
        <div className="w-full flex justify-center">
          <ReportCard selectedDate={selectedDate} />
        </div>
        <div className="w-full flex justify-center">
          <PaymentCard selectedDate={selectedDate} />
        </div>
        <div className="w-full flex justify-center">
          <AnalyticsCard selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
