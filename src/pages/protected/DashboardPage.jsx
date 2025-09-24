import React, { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardCards from "@/components/dashboard/DashboardCards.jsx";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import { useDashboardData } from "@/hooks/useDashboardData.js";
import { usePageEntranceAnimation, useCardRevealAnimation } from "@/hooks/useAnimations.js";
import { motion } from "motion/react";

const DashboardPage = () => {
  const location = useLocation();

  // Get active item info based on current route
  const getActiveItem = () => {
    const mapping = {
      "/dashboard": {
        name: "Dashboard",
        description: "Welcome to Admin Dashboard",
      },
      "/doctors": {
        name: "Doctor",
        description: "Manage Doctors with ease",
      },
      "/doctors/awards": {
        name: "Awards",
        description: "Manage doctor awards",
      },
      "/doctors/qualifications": {
        name: "Qualifications",
        description: "Manage doctor qualifications",
      },
      "/doctors/specializations": {
        name: "Specializations",
        description: "Manage doctor specializations",
      },
      "/patients": {
        name: "Patient",
        description: "Patient Management is a breeze",
      },
      "/patients/allergies": {
        name: "Allergies",
        description: "Manage patient allergies",
      },
      "/patients/medications": {
        name: "Medications",
        description: "Manage patient medications",
      },
      "/patients/emergency-contacts": {
        name: "Emergency Contacts",
        description: "Manage emergency contacts",
      },
      "/timing": {
        name: "Timing",
        description: "Effortless Timing Management",
      },
      "/sessions": {
        name: "Session",
        description: "Unified Session & Session Type Management",
      },
      "/sessions/types": {
        name: "Session Types",
        description: "Manage session types",
      },
      "/schedule": {
        name: "Schedule",
        description: "Appointment Scheduling Made Easy",
      },
      "/reports": {
        name: "Report",
        description: "Generate Reports in a Click",
      },
      "/profile": {
        name: "Profile",
        description: "Manage your profile",
      },
    };
    return (
      mapping[location.pathname] || { name: "Unknown", description: "Page" }
    );
  };

  const activeItem = getActiveItem();
  const { data: user } = useUserProfile();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Animation hooks
  const pageRef = usePageEntranceAnimation({ duration: 0.6, enableStagger: true });
  const cardsRef = useCardRevealAnimation({ stagger: 0.2, duration: 0.7 });

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
    <motion.div 
      ref={pageRef}
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="animate-child">
          <DashboardHeader
            userName={user?.data.name}
            activeItemDescription={activeItem.description}
            variant="glass"
          />
        </div>

        {isLoading ? (
          <motion.div 
            className="flex justify-center items-center p-8 sm:p-12 lg:p-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
              <span className="text-sm sm:text-base text-gray-600 font-medium">
                Loading dashboard data...
              </span>
            </div>
          </motion.div>
        ) : (
          <div ref={cardsRef} className="pb-8 sm:pb-12 animate-child">
            <div className="card-animate">
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
          </div>
        )}

        {/* Error Display with enhanced styling */}
        {errors && Object.values(errors).some((error) => error) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4 p-4 sm:p-6 
                       bg-gradient-to-r from-yellow-50 to-orange-50 
                       border border-yellow-200 rounded-xl 
                       shadow-lg backdrop-blur-sm animate-child"
          >
            <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">
              Dashboard Data Issues
            </h3>
            <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">
              Some dashboard data could not be loaded. This may be due to
              backend service issues or network problems. The application will
              continue to work with available data.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardPage;
