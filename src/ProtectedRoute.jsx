import { Navigate } from "@tanstack/react-router";
import useAuthStore from "./store/useAuthStore.js";

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return children;
  }
  return <Navigate to="/login" />;
}

export default ProtectedRoute;
