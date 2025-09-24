import React from "react";
import { useLocation } from "@tanstack/react-router";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import TimingManager from "../../components/TimingManager.jsx";

const TimingPage = () => {
  const location = useLocation();
  
  // Get active item info based on current route
  const getActiveItem = () => {
    const mapping = {
    "/dashboard": {
        "name": "Dashboard",
        "description": "Welcome to Admin Dashboard"
    },
    "/doctors": {
        "name": "Doctor",
        "description": "Manage Doctors with ease"
    },
    "/doctors/awards": {
        "name": "Awards",
        "description": "Manage doctor awards"
    },
    "/doctors/qualifications": {
        "name": "Qualifications",
        "description": "Manage doctor qualifications"
    },
    "/doctors/specializations": {
        "name": "Specializations",
        "description": "Manage doctor specializations"
    },
    "/patients": {
        "name": "Patient",
        "description": "Patient Management is a breeze"
    },
    "/patients/allergies": {
        "name": "Allergies",
        "description": "Manage patient allergies"
    },
    "/patients/medications": {
        "name": "Medications",
        "description": "Manage patient medications"
    },
    "/patients/emergency-contacts": {
        "name": "Emergency Contacts",
        "description": "Manage emergency contacts"
    },
    "/timing": {
        "name": "Timing",
        "description": "Effortless Timing Management"
    },
    "/sessions": {
        "name": "Session",
        "description": "Unified Session & Session Type Management"
    },
    "/sessions/types": {
        "name": "Session Types",
        "description": "Manage session types"
    },
    "/schedule": {
        "name": "Schedule",
        "description": "Appointment Scheduling Made Easy"
    },
    "/reports": {
        "name": "Report",
        "description": "Generate Reports in a Click"
    },
    "/profile": {
        "name": "Profile",
        "description": "Manage your profile"
    }
};
    return mapping[location.pathname] || { name: 'Unknown', description: 'Page' };
  };
  
  const activeItem = getActiveItem();
  const { data: user } = useUserProfile();

  return (
    <>
      <DashboardHeader
        userName={user?.data.name}
        activeItemDescription={activeItem.description}
      />

      <div className="container mx-auto mt-6">
        <TimingManager />
      </div>
    </>
  );
};

export default TimingPage;
