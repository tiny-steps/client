import React from "react";
import { useLocation } from "@tanstack/react-router";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import useUserStore from "../../store/useUserStore.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import { UserCircle, Mail, Calendar, Shield } from "lucide-react";
import {
  usePageEntranceAnimation,
  useFormAnimation,
} from "@/hooks/useAnimations.js";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";

const ProfilePage = () => {
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
  const email = useUserStore((state) => state.email);

  // Animation hooks
  const pageRef = usePageEntranceAnimation({
    duration: 0.6,
    enableStagger: true,
  });
  const formRef = useFormAnimation();

  return (
    <motion.div
      ref={pageRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="animate-child">
        <DashboardHeader
          userName={user?.data.name}
          activeItemDescription="Manage your profile and account settings"
          variant="glass"
        />
      </div>

      <div className="container mx-auto mt-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            className="animate-child"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card variant="glass" className="p-6 mb-6">
              <div className="flex items-center space-x-6">
                <motion.div
                  className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserCircle size={64} className="text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {user?.data.name || "User Name"}
                  </h2>
                  <p className="text-gray-600 font-medium">{email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Administrator • Active since {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <motion.div
              className="animate-child"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <UserCircle className="mr-2 text-blue-600" size={20} />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-medium">
                      {user?.data.name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center font-medium">
                      <Mail size={16} className="mr-2 text-blue-600" />
                      {email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center font-medium">
                      <Shield size={16} className="mr-2 text-green-600" />
                      Administrator
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Account Settings */}
            <motion.div
              className="animate-child"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <Calendar className="mr-2 text-purple-600" size={20} />
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Status
                    </label>
                    <p className="mt-1 text-sm text-green-600 font-semibold">
                      Active
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Login
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-medium">
                      {new Date().toLocaleDateString()} at{" "}
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Member Since
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-medium">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            className="animate-child"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card variant="glass" className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-4" ref={formRef}>
                <Button variant="default" size="lg">
                  Edit Profile
                </Button>
                <Button variant="secondary" size="lg">
                  Change Password
                </Button>
                <Button variant="outline" size="lg">
                  Download Data
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
