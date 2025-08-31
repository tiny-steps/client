import React, { useState } from "react";
import {
  FileText,
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";

const ReportCard = ({ selectedDate = new Date() }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateDailyReport = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement daily report generation API call
      console.log("Generating daily report for:", selectedDate);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      alert("Daily report generated successfully!");
    } catch (error) {
      console.error("Failed to generate daily report:", error);
      alert("Failed to generate daily report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMonthlyReport = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement monthly report generation API call
      console.log("Generating monthly report");
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate API call
      alert("Monthly report generated successfully!");
    } catch (error) {
      console.error("Failed to generate monthly report:", error);
      alert("Failed to generate monthly report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePerformanceReport = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement performance report generation API call
      console.log("Generating doctor performance report");
      await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate API call
      alert("Performance report generated successfully!");
    } catch (error) {
      console.error("Failed to generate performance report:", error);
      alert("Failed to generate performance report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRevenueReport = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement revenue report generation API call
      console.log("Generating revenue report");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      alert("Revenue report generated successfully!");
    } catch (error) {
      console.error("Failed to generate revenue report:", error);
      alert("Failed to generate revenue report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const frontContent = (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <FileText size={48} className="text-purple-600" />
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-800 mb-2">Reports</div>
        <div className="text-sm text-gray-600">
          Generate analytics & insights
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
          onClick={handleGenerateDailyReport}
          disabled={isLoading}
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Calendar size={16} />
          Generate Daily Report
        </button>

        <button
          onClick={handleGenerateMonthlyReport}
          disabled={isLoading}
          className="w-full bg-green-100 hover:bg-green-200 text-green-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <BarChart3 size={16} />
          Generate Monthly Report
        </button>

        <button
          onClick={handleGeneratePerformanceReport}
          disabled={isLoading}
          className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Users size={16} />
          Doctor Performance Report
        </button>

        <button
          onClick={handleGenerateRevenueReport}
          disabled={isLoading}
          className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <DollarSign size={16} />
          Revenue Analytics Report
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Generating report...</p>
        </div>
      )}
    </div>
  );

  return (
    <FlippableCard frontContent={frontContent} backContent={backContent} />
  );
};

export default ReportCard;
