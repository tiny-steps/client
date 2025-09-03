import React, { useState } from "react";
import { Bell, Mail, MessageSquare, Send, Clock, Users } from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";
import { useWindowSize } from "../../hooks/useWindowSize.js";

const NotificationCard = ({ selectedDate = new Date() }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile, isTablet } = useWindowSize();

  const handleSendReminders = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement send reminders API call
      console.log("Sending appointment reminders for:", selectedDate);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Reminders sent successfully!");
    } catch (error) {
      console.error("Failed to send reminders:", error);
      alert("Failed to send reminders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkNotification = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement bulk notification API call
      console.log("Sending bulk notifications");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Bulk notifications sent successfully!");
    } catch (error) {
      console.error("Failed to send bulk notifications:", error);
      alert("Failed to send bulk notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpMessages = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement follow-up messages API call
      console.log("Sending follow-up messages");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Follow-up messages sent successfully!");
    } catch (error) {
      console.error("Failed to send follow-up messages:", error);
      alert("Failed to send follow-up messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyNotification = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement emergency notification API call
      console.log("Sending emergency notification");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Emergency notification sent successfully!");
    } catch (error) {
      console.error("Failed to send emergency notification:", error);
      alert("Failed to send emergency notification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const frontContent = (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
      <Bell 
        size={isMobile ? 40 : isTablet ? 48 : 56} 
        className="text-orange-600 transition-all duration-200" 
      />
      <div className="text-center w-full">
        <div className={`font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight ${
          isMobile ? 'text-base' : 'text-lg sm:text-xl'
        }`}>
          Send Notifications
        </div>
        <div className={`text-2xl sm:text-3xl lg:text-4xl mb-2 ${
          isMobile ? 'text-xl' : ''
        }`}>
          📧
        </div>
        <div className="text-xs sm:text-sm text-gray-600">
          Communication Center
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className={`font-semibold text-gray-800 ${
          isMobile ? 'text-base' : 'text-lg'
        }`}>
          Communication Center
        </h3>
        <span className="text-xs sm:text-sm text-gray-600">
          {selectedDate.toLocaleDateString()}
        </span>
      </div>
      <div className="flex-1 space-y-2 sm:space-y-3">
        <button
          onClick={handleSendReminders}
          disabled={isLoading}
          className={`w-full flex items-center gap-2 sm:gap-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors disabled:opacity-50 ${
            isMobile ? 'p-2.5' : 'p-3'
          }`}
        >
          <Clock className={`text-blue-600 flex-shrink-0 ${
            isMobile ? 'w-4 h-4' : 'w-5 h-5'
          }`} />
          <div className="text-left flex-1 min-w-0">
            <div className={`font-medium text-blue-900 truncate ${
              isMobile ? 'text-sm' : 'text-base'
            }`}>
              Send Reminders
            </div>
            <div className={`text-blue-700 truncate ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>
              {isMobile ? 'Tomorrow\'s appointments' : 'Appointment reminders for tomorrow'}
            </div>
          </div>
        </button>

        <button
          onClick={handleBulkNotification}
          disabled={isLoading}
          className={`w-full flex items-center gap-2 sm:gap-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors disabled:opacity-50 ${
            isMobile ? 'p-2.5' : 'p-3'
          }`}
        >
          <Users className={`text-green-600 flex-shrink-0 ${
            isMobile ? 'w-4 h-4' : 'w-5 h-5'
          }`} />
          <div className="text-left flex-1 min-w-0">
            <div className={`font-medium text-green-900 truncate ${
              isMobile ? 'text-sm' : 'text-base'
            }`}>
              Bulk Notification
            </div>
            <div className={`text-green-700 truncate ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>
              {isMobile ? 'Update all patients' : 'Send updates to all patients'}
            </div>
          </div>
        </button>

        <button
          onClick={handleFollowUpMessages}
          disabled={isLoading}
          className={`w-full flex items-center gap-2 sm:gap-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors disabled:opacity-50 ${
            isMobile ? 'p-2.5' : 'p-3'
          }`}
        >
          <MessageSquare className={`text-purple-600 flex-shrink-0 ${
            isMobile ? 'w-4 h-4' : 'w-5 h-5'
          }`} />
          <div className="text-left flex-1 min-w-0">
            <div className={`font-medium text-purple-900 truncate ${
              isMobile ? 'text-sm' : 'text-base'
            }`}>
              Follow-up Messages
            </div>
            <div className={`text-purple-700 truncate ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>
              {isMobile ? 'Care instructions' : 'Post-appointment care instructions'}
            </div>
          </div>
        </button>

        <button
          onClick={handleEmergencyNotification}
          disabled={isLoading}
          className={`w-full flex items-center gap-2 sm:gap-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors disabled:opacity-50 ${
            isMobile ? 'p-2.5' : 'p-3'
          }`}
        >
          <Send className={`text-red-600 flex-shrink-0 ${
            isMobile ? 'w-4 h-4' : 'w-5 h-5'
          }`} />
          <div className="text-left flex-1 min-w-0">
            <div className={`font-medium text-red-900 truncate ${
              isMobile ? 'text-sm' : 'text-base'
            }`}>
              Emergency Notification
            </div>
            <div className={`text-red-700 truncate ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>
              {isMobile ? 'Urgent alerts' : 'Send urgent notifications'}
            </div>
          </div>
        </button>
      </div>

      {isLoading && (
        <div className="mt-3 sm:mt-4 text-center">
          <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto ${
            isMobile ? 'h-5 w-5' : 'h-6 w-6'
          }`}></div>
          <p className="text-xs text-gray-500 mt-2">Processing...</p>
        </div>
      )}
    </div>
  );

  return (
    <FlippableCard frontContent={frontContent} backContent={backContent} />
  );
};

export default NotificationCard;
