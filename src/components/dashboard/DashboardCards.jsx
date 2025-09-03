import React from "react";
import AppointmentCard from "./AppointmentCard.jsx";
import DoctorCard from "./DoctorCard.jsx";
import BookingStatsCard from "./BookingStatsCard.jsx";
import NotificationCard from "./NotificationCard.jsx";
import ReportCard from "./ReportCard.jsx";
import PaymentCard from "./PaymentCard.jsx";
import AnalyticsCard from "./AnalyticsCard.jsx";
import { useCreateAppointment } from "@/hooks/useScheduleQueries.js";
import { useGetAllSessions } from "@/hooks/useSessionQueries.js";

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
  const createAppointmentMutation = useCreateAppointment();
  const { data: sessionsData } = useGetAllSessions();
  const sessions = sessionsData?.data?.content || [];

  const handleNewAppointment = async (appointmentData) => {
    try {
      await createAppointmentMutation.mutateAsync(appointmentData);
      // The query cache will be invalidated automatically by the mutation
    } catch (error) {
      console.error("Failed to create appointment:", error);
      throw error; // Re-throw to let the modal handle it
    }
  };
  return (
    <div className="w-full">
      {/* Primary Dashboard Cards - Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
        <div className="w-full flex justify-center">
          <AppointmentCard
            appointments={appointments}
            onStatusChange={onAppointmentStatusChange}
            selectedDate={selectedDate}
            patients={rawPatients}
            doctors={rawDoctors}
            sessions={sessions}
            onNewAppointment={handleNewAppointment}
          />
        </div>
        <div className="w-full flex justify-center">
          <DoctorCard
            doctors={doctors}
            onStatusChange={onDoctorStatusChange}
            onSlotSelection={onSlotSelection}
            selectedDate={selectedDate}
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
