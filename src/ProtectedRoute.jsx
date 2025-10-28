import { Navigate } from "@tanstack/react-router";
import useAuthStore from "./store/useAuthStore.js";
import { useTokenValidation } from "./hooks/useTokenValidation.js";
import { performCompleteLogout } from "./utils/storageUtils.js";

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isTokenValidating = useAuthStore((state) => state.isTokenValidating);
  const { isTokenValid, validationError } = useTokenValidation();

  // Show loading state while validating token
  if (isAuthenticated && isTokenValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or token validation failed, redirect to login
  if (
    !isAuthenticated ||
    (isAuthenticated && !isTokenValid && !isTokenValidating)
  ) {
    // Clear all storage and cookies when redirecting to login due to auth failure
    if (isAuthenticated && !isTokenValid && !isTokenValidating) {
      performCompleteLogout();
    }
    return <Navigate to="/login" />;
  }

  // If authenticated and token is valid, render children
  if (isAuthenticated && isTokenValid) {
    return children;
  }

  // Fallback - should not reach here
  return <Navigate to="/login" />;
}

export default ProtectedRoute;
