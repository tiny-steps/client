import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

export const Alert = ({
  children,
  variant = "default",
  className = "",
  icon: CustomIcon,
  ...props
}) => {
  const variants = {
    default: {
      container: "bg-gray-50 border-gray-200 text-gray-800",
      icon: Info,
    },
    destructive: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: AlertCircle,
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: AlertTriangle,
    },
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: CheckCircle,
    },
  };

  const config = variants[variant] || variants.default;
  const IconComponent = CustomIcon || config.icon;

  return (
    <div
      className={`
        relative w-full rounded-lg border p-4 
        ${config.container} 
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start gap-3">
        <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
