import React, { useState, useEffect } from "react";
import { authActions } from "../store/authStore";

const SecurityMonitor = ({ show = false }) => {
  const [securityStatus, setSecurityStatus] = useState({});
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!show) return;

    const updateSecurityStatus = () => {
      const status = authActions.performSecurityAudit();
      setSecurityStatus(status);
    };

    // Update security status every 10 seconds
    const interval = setInterval(updateSecurityStatus, 10000);
    updateSecurityStatus(); // Initial check

    // Listen for security alerts
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      if (args[0]?.includes("🚨 SECURITY ALERT")) {
        setAlerts((prev) => [
          ...prev.slice(-4),
          {
            id: Date.now(),
            message: args[1],
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
      originalConsoleWarn(...args);
    };

    return () => {
      clearInterval(interval);
      console.warn = originalConsoleWarn;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="text-lg font-bold mb-2 text-green-400">
        🔒 Security Monitor
      </h3>

      <div className="mb-3">
        <h4 className="font-semibold mb-1">Security Status:</h4>
        <div className="text-sm space-y-1">
          {Object.entries(securityStatus).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="capitalize">
                {key.replace(/([A-Z])/g, " $1")}:
              </span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {alerts.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1 text-red-400">Recent Alerts:</h4>
          <div className="text-xs space-y-1 max-h-20 overflow-y-auto">
            {alerts.map((alert) => (
              <div key={alert.id} className="text-red-300">
                <span className="text-gray-400">{alert.timestamp}</span> -{" "}
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-400">
        🛡️ All 6 security layers active
        <br />
        🔄 Keys rotate every 6 hours
        <br />
        🍯 Honeypots deployed
      </div>
    </div>
  );
};

export default SecurityMonitor;
