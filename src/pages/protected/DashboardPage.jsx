import React from 'react';
import { useOutletContext } from 'react-router';
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardCards from "@/components/dashboard/DashboardCards.jsx";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import CalendarView from "@/components/CalendarView.jsx";
import { useDashboardData } from "@/hooks/useDashboardData.js";

const DashboardPage = () => {
    const { activeItem } = useOutletContext();
    const { data: user } = useUserProfile();

    // Use the custom hook for dashboard data management
    const {
        appointments,
        doctors,
        bookingStats,
        handleAppointmentStatus,
        handleDoctorStatus,
        handleSlotSelection,
    } = useDashboardData();

    return (
        <>
            <DashboardHeader
                userName={user?.data.name}
                activeItemDescription={activeItem.description}
            />

            <DashboardCards
                appointments={appointments}
                doctors={doctors}
                bookingStats={bookingStats}
                onAppointmentStatusChange={handleAppointmentStatus}
                onDoctorStatusChange={handleDoctorStatus}
                onSlotSelection={handleSlotSelection}
            />

            <div className="mx-20 pl-10">
                <CalendarView appointments={appointments} doctors={doctors} />
            </div>
        </>
    );
};

export default DashboardPage;
