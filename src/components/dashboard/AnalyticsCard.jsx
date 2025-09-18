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
import { useWindowSize } from "../../hooks/useWindowSize.js";

const AnalyticsCard = ({ selectedDate = new Date() }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile, isTablet } = useWindowSize();

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
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
      <BarChart3
        size={isMobile ? 36 : isTablet ? 42 : 48}
        className="text-indigo-600"
      />
      <div className="text-center">
        <div
          className={`font-semibold text-gray-800 mb-2 ${
            isMobile ? "text-lg" : "text-xl"
          }`}
        >
          Analytics
        </div>
        <div className={`text-gray-600 ${isMobile ? "text-xs" : "text-sm"}`}>
          Real-time insights & metrics
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div className="w-full h-full flex flex-col">
      {/* Header positioned inline with back icon */}
      <div className="absolute top-3 left-12 sm:top-4 sm:left-14 z-10 flex-shrink-0">
        <h3 className="font-bold text-gray-800 text-base whitespace-nowrap">
          Analytics Hub
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto pt-8">
        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={handleViewTodayStats}
            disabled={isLoading}
            className={`w-full flex items-center gap-2 sm:gap-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors disabled:opacity-50 ${
              isMobile ? "p-2.5" : "p-3"
            }`}
          >
            <Activity
              className={`text-blue-600 flex-shrink-0 ${
                isMobile ? "w-4 h-4" : "w-5 h-5"
              }`}
            />
            <div className="text-left flex-1 min-w-0">
              <div
                className={`font-medium text-blue-900 truncate ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Today's Statistics
              </div>
              <div
                className={`text-blue-700 truncate ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                {isMobile
                  ? "Daily metrics"
                  : "View today's performance metrics"}
              </div>
            </div>
          </button>

          <button
            onClick={handlePerformanceDashboard}
            disabled={isLoading}
            className={`w-full flex items-center gap-2 sm:gap-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors disabled:opacity-50 ${
              isMobile ? "p-2.5" : "p-3"
            }`}
          >
            <Target
              className={`text-green-600 flex-shrink-0 ${
                isMobile ? "w-4 h-4" : "w-5 h-5"
              }`}
            />
            <div className="text-left flex-1 min-w-0">
              <div
                className={`font-medium text-green-900 truncate ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Performance Dashboard
              </div>
              <div
                className={`text-green-700 truncate ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                {isMobile
                  ? "KPI overview"
                  : "Comprehensive performance overview"}
              </div>
            </div>
          </button>

          <button
            onClick={handleRevenueAnalytics}
            disabled={isLoading}
            className={`w-full flex items-center gap-2 sm:gap-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors disabled:opacity-50 ${
              isMobile ? "p-2.5" : "p-3"
            }`}
          >
            <TrendingUp
              className={`text-purple-600 flex-shrink-0 ${
                isMobile ? "w-4 h-4" : "w-5 h-5"
              }`}
            />
            <div className="text-left flex-1 min-w-0">
              <div
                className={`font-medium text-purple-900 truncate ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Revenue Analytics
              </div>
              <div
                className={`text-purple-700 truncate ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                {isMobile
                  ? "Financial insights"
                  : "Revenue trends and insights"}
              </div>
            </div>
          </button>

          <button
            onClick={handlePatientAnalytics}
            disabled={isLoading}
            className={`w-full flex items-center gap-2 sm:gap-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors disabled:opacity-50 ${
              isMobile ? "p-2.5" : "p-3"
            }`}
          >
            <Eye
              className={`text-orange-600 flex-shrink-0 ${
                isMobile ? "w-4 h-4" : "w-5 h-5"
              }`}
            />
            <div className="text-left flex-1 min-w-0">
              <div
                className={`font-medium text-orange-900 truncate ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Patient Analytics
              </div>
              <div
                className={`text-orange-700 truncate ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                {isMobile ? "Patient insights" : "Patient behavior and trends"}
              </div>
            </div>
          </button>

          {/* Additional analytics options for testing scrolling */}
          <button
            onClick={handleViewTodayStats}
            disabled={isLoading}
            className={`w-full flex items-center gap-2 sm:gap-3 bg-cyan-50 hover:bg-cyan-100 rounded-lg border border-cyan-200 transition-colors disabled:opacity-50 ${
              isMobile ? "p-2.5" : "p-3"
            }`}
          >
            <Download
              className={`text-cyan-600 flex-shrink-0 ${
                isMobile ? "w-4 h-4" : "w-5 h-5"
              }`}
            />
            <div className="text-left flex-1 min-w-0">
              <div
                className={`font-medium text-cyan-900 truncate ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Export Analytics
              </div>
              <div
                className={`text-cyan-700 truncate ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                {isMobile ? "Export data" : "Download analytics reports"}
              </div>
            </div>
          </button>

          <button
            onClick={handleViewTodayStats}
            disabled={isLoading}
            className={`w-full flex items-center gap-2 sm:gap-3 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors disabled:opacity-50 ${
              isMobile ? "p-2.5" : "p-3"
            }`}
          >
            <Share2
              className={`text-rose-600 flex-shrink-0 ${
                isMobile ? "w-4 h-4" : "w-5 h-5"
              }`}
            />
            <div className="text-left flex-1 min-w-0">
              <div
                className={`font-medium text-rose-900 truncate ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Share Reports
              </div>
              <div
                className={`text-rose-700 truncate ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                {isMobile ? "Share data" : "Share analytics with team"}
              </div>
            </div>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-3 sm:mt-4 text-center flex-shrink-0">
          <div
            className={`animate-spin rounded-full border-b-2 border-indigo-600 mx-auto ${
              isMobile ? "h-5 w-5" : "h-6 w-6"
            }`}
          ></div>
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
