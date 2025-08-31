import React, { useState } from "react";
import { Bell, Mail, MessageSquare, Send, Clock, Users } from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";

const NotificationCard = ({ selectedDate = new Date() }) => {
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <Bell size={48} className="text-orange-600" />
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-800 mb-2">
          Notifications
        </div>
        <div className="text-sm text-gray-600">
          Manage communications & reminders
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div
      className="w-full h-full overflow-y-auto p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-sm font-semibold text-gray-700 mb-4 text-center">
        Quick Actions
      </div>

      <div className="space-y-3">
        <button
          onClick={handleSendReminders}
          disabled={isLoading}
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Clock size={16} />
          Send Appointment Reminders
        </button>

        <button
          onClick={handleBulkNotification}
          disabled={isLoading}
          className="w-full bg-green-100 hover:bg-green-200 text-green-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Users size={16} />
          Send Bulk Notifications
        </button>

        <button
          onClick={handleFollowUpMessages}
          disabled={isLoading}
          className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <MessageSquare size={16} />
          Send Follow-up Messages
        </button>

        <button
          onClick={handleEmergencyNotification}
          disabled={isLoading}
          className="w-full bg-red-100 hover:bg-red-200 text-red-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send size={16} />
          Emergency Notification
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
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
