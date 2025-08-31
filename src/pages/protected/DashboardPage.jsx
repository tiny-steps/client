import React from "react";
import { useOutletContext } from "react-router";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardCards from "@/components/dashboard/DashboardCards.jsx";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import DashboardCalendar from "@/components/DashboardCalendar.jsx";
import { useDashboardData } from "@/hooks/useDashboardData.js";

const DashboardPage = () => {
  const { activeItem } = useOutletContext();
  const { data: user } = useUserProfile();

  // Use the custom hook for dashboard data management
  const {
    appointments,
    doctors,
    bookingStats,
    rawAppointments,
    rawDoctors,
    rawPatients,
    rawAvailabilities,
    handleAppointmentStatus,
    handleDoctorStatus,
    handleSlotSelection,
    isLoading,
    errors,
  } = useDashboardData();

  return (
    <>
      <DashboardHeader
        userName={user?.data.name}
        activeItemDescription={activeItem.description}
      />

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading dashboard data...</span>
        </div>
      ) : (
        <>
          <DashboardCards
            appointments={appointments}
            doctors={doctors}
            bookingStats={bookingStats}
            onAppointmentStatusChange={handleAppointmentStatus}
            onDoctorStatusChange={handleDoctorStatus}
            onSlotSelection={handleSlotSelection}
          />

          <div className="mx-20 pl-10">
            <DashboardCalendar
              appointments={rawAppointments || []}
              availabilities={rawAvailabilities || []}
              doctors={rawDoctors}
              patients={rawPatients}
              onAppointmentClick={(appointment) => {
                console.log("Appointment clicked:", appointment);
                // The DashboardCalendar now handles the appointment modal internally
              }}
              onTimeSlotClick={(time) => {
                console.log("Time slot clicked:", time);
                // TODO: Open booking modal
              }}
            />
          </div>
        </>
      )}

      {/* Error Display */}
      {errors && Object.values(errors).some((error) => error) && (
        <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Dashboard Data Issues
          </h3>
          <p className="text-yellow-700 text-sm">
            Some dashboard data could not be loaded. This may be due to backend
            service issues or network problems. The application will continue to
            work with available data.
          </p>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
