import {Navigate, Outlet} from 'react-router';
import useAuthStore from "./store/useAuthStore.js";

function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Outlet />;
    }
    return <Navigate to="/login" />;
}

export default ProtectedRoute;