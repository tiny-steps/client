import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message) => addToast(message, "success"),
    [addToast]
  );
  const error = useCallback(
    (message) => addToast(message, "error"),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ success, error, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const { id, message, type } = toast;

  const styles = {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: CheckCircle,
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: AlertCircle,
    },
  };

  const config = styles[type] || styles.success;
  const IconComponent = config.icon;

  return (
    <div
      className={`
      flex items-center gap-3 p-3 rounded-lg border shadow-lg max-w-sm
      ${config.container}
      animate-in slide-in-from-right duration-300
    `}
    >
      <IconComponent className="h-5 w-5 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-current hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
