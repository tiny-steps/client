import React, { useState } from "react";
import {
  CreditCard,
  DollarSign,
  RefreshCw,
  Receipt,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";

const PaymentCard = ({ selectedDate = new Date() }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleViewPendingPayments = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement view pending payments API call
      console.log("Viewing pending payments for:", selectedDate);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Opening pending payments view...");
    } catch (error) {
      console.error("Failed to view pending payments:", error);
      alert("Failed to load pending payments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessRefunds = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement process refunds API call
      console.log("Processing refunds");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      alert("Refunds processed successfully!");
    } catch (error) {
      console.error("Failed to process refunds:", error);
      alert("Failed to process refunds. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPromoCodes = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement apply promo codes API call
      console.log("Applying promo codes");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Promo codes applied successfully!");
    } catch (error) {
      console.error("Failed to apply promo codes:", error);
      alert("Failed to apply promo codes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentAnalytics = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement payment analytics API call
      console.log("Generating payment analytics");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      alert("Payment analytics generated successfully!");
    } catch (error) {
      console.error("Failed to generate payment analytics:", error);
      alert("Failed to generate payment analytics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const frontContent = (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <CreditCard size={48} className="text-green-600" />
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-800 mb-2">Payments</div>
        <div className="text-sm text-gray-600">
          Manage billing & transactions
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div className="w-full h-full flex flex-col">
      {/* Header positioned inline with back icon */}
      <div className="absolute top-3 left-12 sm:top-4 sm:left-14 z-10 flex-shrink-0">
        <h3 className="font-bold text-gray-800 text-base whitespace-nowrap">
          Quick Actions
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto pt-8">
        <div className="space-y-3">
          <button
            onClick={handleViewPendingPayments}
            disabled={isLoading}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Receipt size={16} />
            View Pending Payments
          </button>

          <button
            onClick={handleProcessRefunds}
            disabled={isLoading}
            className="w-full bg-red-100 hover:bg-red-200 text-red-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Process Refunds
          </button>

          <button
            onClick={handleApplyPromoCodes}
            disabled={isLoading}
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <DollarSign size={16} />
            Apply Promo Codes
          </button>

          <button
            onClick={handlePaymentAnalytics}
            disabled={isLoading}
            className="w-full bg-green-100 hover:bg-green-200 text-green-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <TrendingUp size={16} />
            Payment Analytics
          </button>

          {/* Additional payment options for testing scrolling */}
          <button
            onClick={handleViewPendingPayments}
            disabled={isLoading}
            className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <AlertCircle size={16} />
            Overdue Payments
          </button>

          <button
            onClick={handleViewPendingPayments}
            disabled={isLoading}
            className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CreditCard size={16} />
            Payment Methods
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 text-center flex-shrink-0">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Processing...</p>
        </div>
      )}
    </div>
  );

  return (
    <FlippableCard frontContent={frontContent} backContent={backContent} />
  );
};

export default PaymentCard;
