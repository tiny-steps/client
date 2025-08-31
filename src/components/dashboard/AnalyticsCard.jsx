import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Target,
  Eye,
  Download,
  Share2,
} from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";

const AnalyticsCard = ({ selectedDate = new Date() }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleViewTodayStats = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement view today's statistics API call
      console.log("Viewing today's statistics for:", selectedDate);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Opening today's statistics dashboard...");
    } catch (error) {
      console.error("Failed to load today's statistics:", error);
      alert("Failed to load statistics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePerformanceDashboard = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement performance dashboard API call
      console.log("Opening performance dashboard");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      alert("Performance dashboard opened successfully!");
    } catch (error) {
      console.error("Failed to open performance dashboard:", error);
      alert("Failed to open performance dashboard. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevenueAnalytics = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement revenue analytics API call
      console.log("Generating revenue analytics");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      alert("Revenue analytics generated successfully!");
    } catch (error) {
      console.error("Failed to generate revenue analytics:", error);
      alert("Failed to generate revenue analytics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientAnalytics = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement patient analytics API call
      console.log("Generating patient analytics");
      await new Promise((resolve) => setTimeout(resolve, 1800)); // Simulate API call
      alert("Patient analytics generated successfully!");
    } catch (error) {
      console.error("Failed to generate patient analytics:", error);
      alert("Failed to generate patient analytics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const frontContent = (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <BarChart3 size={48} className="text-indigo-600" />
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-800 mb-2">
          Analytics
        </div>
        <div className="text-sm text-gray-600">
          Real-time insights & metrics
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
          onClick={handleViewTodayStats}
          disabled={isLoading}
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Activity size={16} />
          Today's Statistics
        </button>

        <button
          onClick={handlePerformanceDashboard}
          disabled={isLoading}
          className="w-full bg-green-100 hover:bg-green-200 text-green-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Target size={16} />
          Performance Dashboard
        </button>

        <button
          onClick={handleRevenueAnalytics}
          disabled={isLoading}
          className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <TrendingUp size={16} />
          Revenue Analytics
        </button>

        <button
          onClick={handlePatientAnalytics}
          disabled={isLoading}
          className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Eye size={16} />
          Patient Analytics
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Loading analytics...</p>
        </div>
      )}
    </div>
  );

  return (
    <FlippableCard frontContent={frontContent} backContent={backContent} />
  );
};

export default AnalyticsCard;
