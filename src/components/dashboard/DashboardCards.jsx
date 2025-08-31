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
    <div className="flex flex-wrap items-center justify-center gap-6">
      <AppointmentCard
        appointments={appointments}
        onStatusChange={onAppointmentStatusChange}
        selectedDate={selectedDate}
        patients={rawPatients}
        doctors={rawDoctors}
      />
      <DoctorCard
        doctors={doctors}
        onStatusChange={onDoctorStatusChange}
        onSlotSelection={onSlotSelection}
      />
      <BookingStatsCard bookingStats={bookingStats} />

      {/* Quick Action Cards */}
      <NotificationCard selectedDate={selectedDate} />
      <ReportCard selectedDate={selectedDate} />
      <PaymentCard selectedDate={selectedDate} />
      <AnalyticsCard selectedDate={selectedDate} />
    </div>
  );
};

export default DashboardCards;
