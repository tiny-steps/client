import "./App.css";
import LoginPage from "./pages/public/LoginPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "./components/layouts/DashboardLayout.jsx";
import DashboardPage from "./pages/protected/DashboardPage.jsx";
import DoctorsPage from "./pages/protected/DoctorsPage.jsx";
import PatientsPage from "./pages/protected/PatientsPage.jsx";
import TimingPage from "./pages/protected/TimingPage.jsx";
import SessionPage from "./pages/protected/SessionPage.jsx";
import SchedulePage from "./pages/protected/SchedulePage.jsx";
import ReportPage from "./pages/protected/ReportPage.jsx";
import ProfilePage from "./pages/protected/ProfilePage.jsx";
import DoctorDetail from "./components/DoctorDetail.jsx";
import DoctorForm from "./components/DoctorForm.jsx";
import PatientDetail from "./components/PatientDetail.jsx";
import PatientForm from "./components/forms/PatientForm.jsx";
import SessionForm from "./components/forms/SessionForm.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { Routes, Route, Navigate } from "react-router";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with dashboard layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard route */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
          </Route>

          {/* Top-level protected routes with dashboard layout */}
          <Route path="/doctors" element={<DashboardLayout />}>
            <Route index element={<DoctorsPage />} />
            <Route path="add" element={<DoctorForm />} />
            <Route path=":doctorId" element={<DoctorDetail />} />
            <Route path=":doctorId/edit" element={<DoctorForm />} />
          </Route>

          <Route path="/patients" element={<DashboardLayout />}>
            <Route index element={<PatientsPage />} />
            <Route path="add" element={<PatientForm />} />
            <Route path=":id" element={<PatientDetail />} />
            <Route path=":id/edit" element={<PatientForm mode="edit" />} />
          </Route>

          <Route path="/timing" element={<DashboardLayout />}>
            <Route index element={<TimingPage />} />
          </Route>

                     <Route path="/sessions" element={<DashboardLayout />}>
             <Route index element={<SessionPage />} />
             <Route path="add" element={<SessionForm />} />
             <Route path=":id" element={<SessionForm />} />
             <Route path=":id/edit" element={<SessionForm />} />
           </Route>

          <Route path="/schedule" element={<DashboardLayout />}>
            <Route index element={<SchedulePage />} />
          </Route>

          <Route path="/reports" element={<DashboardLayout />}>
            <Route index element={<ReportPage />} />
          </Route>

          <Route path="/profile" element={<DashboardLayout />}>
            <Route index element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
