import { useState, useEffect } from "react";

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionError(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionError("No internet connection");
    };

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check for connection errors on API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          setConnectionError("Server connection failed");
        }
        throw error;
      }
    };

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.fetch = originalFetch;
    };
  }, []);

  return {
    isOnline,
    connectionError,
    clearConnectionError: () => setConnectionError(null),
  };
};


