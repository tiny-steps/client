import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const DashboardHeader = ({ 
  userName, 
  activeItemDescription, 
  variant = "default",
  className 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "glass":
        return "bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-lg";
      case "elevated":
        return "bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl p-4 shadow-xl";
      case "minimal":
        return "bg-transparent";
      default:
        return "bg-white/10 backdrop-blur-sm rounded-lg p-3";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("mt-3", getVariantClasses(), className)}
    >
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
      >
        Hi {userName}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 font-medium"
      >
        {activeItemDescription}
      </motion.p>
    </motion.div>
  );
};

export default DashboardHeader;
