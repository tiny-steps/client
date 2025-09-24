import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  variant = "glass",
  className = "",
}) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
  };

  const variantClasses = {
    glass: "bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl",
    solid: "bg-white border border-gray-200 shadow-xl",
    elevated: "bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl",
    dark: "bg-gray-900/90 backdrop-blur-md border border-gray-700/50 shadow-2xl text-white",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "relative w-full mx-4",
              sizeClasses[size],
              className
            )}
          >
            <div
              className={cn(
                "relative flex flex-col w-full border-0 rounded-xl outline-none focus:outline-none overflow-hidden",
                variantClasses[variant]
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-white/20">
                <h3 className="text-xl font-semibold">{title}</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-white/10"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="relative p-6 flex-auto">{children}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
