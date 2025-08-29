import React from 'react';
import { useOutletContext } from 'react-router';
import { useUserProfile } from "@/hooks/useUserQuery.js";
import useUserStore from "../../store/useUserStore.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import { UserCircle, Mail, Calendar, Shield } from 'lucide-react';

const ProfilePage = () => {
 const { activeItem } = useOutletContext();
 const { data: user } = useUserProfile();
 const email = useUserStore((state) => state.email);

 return (
 <>
 <DashboardHeader
 userName={user?.data.name}
 activeItemDescription="Manage your profile and account settings"
 />

 <div className="container ml-20 mt-6">
 <div className="max-w-4xl mx-auto">
 {/* Profile Header */}
 <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-lg p-6 mb-6">
 <div className="flex items-center space-x-6">
 <div className="bg-blue-100 rounded-full p-4">
 <UserCircle size={64} className="text-blue-600" />
 </div>
 <div>
 <h2 className="text-2xl font-bold text-gray-900">
 {user?.data.name || 'User Name'}
 </h2>
 <p className="text-gray-600">{email}</p>
 <p className="text-sm text-gray-500 mt-1">
 Administrator • Active since {new Date().getFullYear()}
 </p>
 </div>
 </div>
 </div>

 {/* Profile Details */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Personal Information */}
 <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-lg p-6">
 <h3 className="text-lg font-semibold mb-4 flex items-center">
 <UserCircle className="mr-2" size={20} />
 Personal Information
 </h3>
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700">Full Name</label>
 <p className="mt-1 text-sm text-gray-900">{user?.data.name || 'Not provided'}</p>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700">Email Address</label>
 <p className="mt-1 text-sm text-gray-900 flex items-center">
 <Mail size={16} className="mr-2" />
 {email}
 </p>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700">Role</label>
 <p className="mt-1 text-sm text-gray-900 flex items-center">
 <Shield size={16} className="mr-2" />
 Administrator
 </p>
 </div>
 </div>
 </div>

 {/* Account Settings */}
 <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-lg p-6">
 <h3 className="text-lg font-semibold mb-4 flex items-center">
 <Calendar className="mr-2" size={20} />
 Account Settings
 </h3>
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700">Account Status</label>
 <p className="mt-1 text-sm text-green-600 font-medium">Active</p>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700">Last Login</label>
 <p className="mt-1 text-sm text-gray-900">
 {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
 </p>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700">Member Since</label>
 <p className="mt-1 text-sm text-gray-900">
 {new Date().toLocaleDateString()}
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Actions */}
 <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-lg p-6 mt-6">
 <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
 <div className="flex flex-wrap gap-4">
 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
 Edit Profile
 </button>
 <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
 Change Password
 </button>
 <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
 Download Data
 </button>
 </div>
 </div>
 </div>
 </div>
 </>
 );
};

export default ProfilePage;
