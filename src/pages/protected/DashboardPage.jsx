import React, { useState } from "react";
import { useOutletContext } from "react-router";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardCards from "@/components/dashboard/DashboardCards.jsx";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import { useDashboardData } from "@/hooks/useDashboardData.js";

const DashboardPage = () => {
  const { activeItem } = useOutletContext();
  const { data: user } = useUserProfile();
  const [selectedDate, setSelectedDate] = useState(new Date());

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
  } = useDashboardData(selectedDate);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          userName={user?.data.name}
          activeItemDescription={activeItem.description}
        />

        {isLoading ? (
          <div className="flex justify-center items-center p-8 sm:p-12 lg:p-16">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
              <span className="text-sm sm:text-base text-gray-600 font-medium">
                Loading dashboard data...
              </span>
            </div>
          </div>
        ) : (
          <div className="pb-8 sm:pb-12">
            <DashboardCards
              appointments={appointments}
              doctors={doctors}
              bookingStats={bookingStats}
              onAppointmentStatusChange={handleAppointmentStatus}
              onDoctorStatusChange={handleDoctorStatus}
              onSlotSelection={handleSlotSelection}
              selectedDate={selectedDate}
              rawPatients={rawPatients}
              rawDoctors={rawDoctors}
            />
          </div>
        )}

        {/* Error Display */}
        {errors && Object.values(errors).some((error) => error) && (
          <div
            className="mt-4 p-4 sm:p-6 
                         bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl 
                         shadow-sm"
          >
            <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">
              Dashboard Data Issues
            </h3>
            <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">
              Some dashboard data could not be loaded. This may be due to
              backend service issues or network problems. The application will
              continue to work with available data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
