import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

// Components
import Login from "./pages/public/Login.jsx";
import Home from "./pages/public/Home.jsx";
import About from "./pages/public/About.jsx";
import ContactUs from "./pages/public/ContactUs.jsx";
import Services from "./pages/public/Services.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "./components/layouts/DashboardLayout.jsx";
import PublicLayout from "./components/layouts/PublicLayout.jsx";
import CommonHeader from "./components/CommonHeader.jsx";
import DashboardPage from "./pages/protected/DashboardPage.jsx";
import DoctorsPage from "./pages/protected/DoctorsPage.jsx";
import PatientsPage from "./pages/protected/PatientsPage.jsx";
import TimingPage from "./pages/protected/TimingPage.jsx";
import SessionPage from "./pages/protected/SessionPage.jsx";
import SessionTypesPage from "./pages/protected/SessionTypesPage.jsx";
import SchedulePage from "./pages/protected/SchedulePage.jsx";
import ReportPage from "./pages/protected/ReportPage.jsx";
import ProfilePage from "./pages/protected/ProfilePage.jsx";
import AwardsPage from "./pages/protected/AwardsPage.jsx";
import QualificationsPage from "./pages/protected/QualificationsPage.jsx";
import SpecializationsPage from "./pages/protected/SpecializationsPage.jsx";
import PatientAllergiesPage from "./pages/protected/PatientAllergiesPage.jsx";

// Therapy Pages
import Academic from "./pages/public/therapies/Academic.jsx";
import After from "./pages/public/therapies/After.jsx";
import Applied from "./pages/public/therapies/Applied.jsx";
import Aqua from "./pages/public/therapies/Aqua.jsx";
import Asdscreening from "./pages/public/therapies/Asdscreening.jsx";
import Behavioral from "./pages/public/therapies/Behavioral.jsx";
import Development from "./pages/public/therapies/Development.jsx";
import Diagnosis from "./pages/public/therapies/Diagnosis.jsx";
import Earlyinter from "./pages/public/therapies/Earlyinter.jsx";
import Group from "./pages/public/therapies/Group.jsx";
import Iq from "./pages/public/therapies/Iq.jsx";
import Language from "./pages/public/therapies/Language.jsx";
import Music from "./pages/public/therapies/Music.jsx";
import Occupational from "./pages/public/therapies/Occupational.jsx";
import Online from "./pages/public/therapies/Online.jsx";
import Physio from "./pages/public/therapies/Physio.jsx";
import Play from "./pages/public/therapies/Play.jsx";
import School from "./pages/public/therapies/School.jsx";
import Sensory from "./pages/public/therapies/Sensory.jsx";
import Special from "./pages/public/therapies/Special.jsx";
import Speech from "./pages/public/therapies/Speech.jsx";

import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <ErrorBoundary>
      <Outlet />
      <TanStackRouterDevtools />
    </ErrorBoundary>
  ),
});

// Public routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <PublicLayout>
      <Home />
    </PublicLayout>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => (
    <PublicLayout>
      <About />
    </PublicLayout>
  ),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: () => (
    <PublicLayout>
      <ContactUs />
    </PublicLayout>
  ),
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: () => (
    <PublicLayout>
      <Services />
    </PublicLayout>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <PublicLayout>
      <Login />
    </PublicLayout>
  ),
});

// Therapy Routes
const academicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/academic",
  component: () => (
    <PublicLayout>
      <Academic />
    </PublicLayout>
  ),
});

const afterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/after",
  component: () => (
    <PublicLayout>
      <After />
    </PublicLayout>
  ),
});

const appliedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/applied",
  component: () => (
    <PublicLayout>
      <Applied />
    </PublicLayout>
  ),
});

const aquaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/aqua",
  component: () => (
    <PublicLayout>
      <Aqua />
    </PublicLayout>
  ),
});

const asdscreeningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/asdscreening",
  component: () => (
    <PublicLayout>
      <Asdscreening />
    </PublicLayout>
  ),
});

const behavioralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/behavioral",
  component: () => (
    <PublicLayout>
      <Behavioral />
    </PublicLayout>
  ),
});

const developmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/development",
  component: () => (
    <PublicLayout>
      <Development />
    </PublicLayout>
  ),
});

const diagnosisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/diagnosis",
  component: () => (
    <PublicLayout>
      <Diagnosis />
    </PublicLayout>
  ),
});

const earlyinterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/earlyinter",
  component: () => (
    <PublicLayout>
      <Earlyinter />
    </PublicLayout>
  ),
});

const groupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/group",
  component: () => (
    <PublicLayout>
      <Group />
    </PublicLayout>
  ),
});

const iqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/iq",
  component: () => (
    <PublicLayout>
      <Iq />
    </PublicLayout>
  ),
});

const languageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/language",
  component: () => (
    <PublicLayout>
      <Language />
    </PublicLayout>
  ),
});

const musicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/music",
  component: () => (
    <PublicLayout>
      <Music />
    </PublicLayout>
  ),
});

const occupationalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/occupational",
  component: () => (
    <PublicLayout>
      <Occupational />
    </PublicLayout>
  ),
});

const onlineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/online",
  component: () => (
    <PublicLayout>
      <Online />
    </PublicLayout>
  ),
});

const physioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/physio",
  component: () => (
    <PublicLayout>
      <Physio />
    </PublicLayout>
  ),
});

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/play",
  component: () => (
    <PublicLayout>
      <Play />
    </PublicLayout>
  ),
});

const schoolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/school",
  component: () => (
    <PublicLayout>
      <School />
    </PublicLayout>
  ),
});

const sensoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/sensory",
  component: () => (
    <PublicLayout>
      <Sensory />
    </PublicLayout>
  ),
});

const specialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/special",
  component: () => (
    <PublicLayout>
      <Special />
    </PublicLayout>
  ),
});

const speechRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/therapies/speech",
  component: () => (
    <PublicLayout>
      <Speech />
    </PublicLayout>
  ),
});

// Protected routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const doctorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/doctors",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <DoctorsPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

// Doctor subroutes
const doctorsAwardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/doctors/awards",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <AwardsPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const doctorsQualificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/doctors/qualifications",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <QualificationsPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const doctorsSpecializationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/doctors/specializations",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <SpecializationsPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const patientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/patients",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <PatientsPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

// Patient subroutes
const patientsAllergiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/patients/allergies",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <PatientAllergiesPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const timingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/timing",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <TimingPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const sessionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sessions",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <SessionPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const sessionTypesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sessions/types",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <SessionTypesPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedule",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <SchedulePage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <ReportPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <ProfilePage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  contactRoute,
  servicesRoute,
  loginRoute,
  // Therapy routes
  academicRoute,
  afterRoute,
  appliedRoute,
  aquaRoute,
  asdscreeningRoute,
  behavioralRoute,
  developmentRoute,
  diagnosisRoute,
  earlyinterRoute,
  groupRoute,
  iqRoute,
  languageRoute,
  musicRoute,
  occupationalRoute,
  onlineRoute,
  physioRoute,
  playRoute,
  schoolRoute,
  sensoryRoute,
  specialRoute,
  speechRoute,
  // Protected routes
  dashboardRoute,
  doctorsRoute,
  doctorsAwardsRoute,
  doctorsQualificationsRoute,
  doctorsSpecializationsRoute,
  patientsRoute,
  patientsAllergiesRoute,
  timingRoute,
  sessionsRoute,
  sessionTypesRoute,
  scheduleRoute,
  reportsRoute,
  profileRoute,
]);

// Create the router
export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    return <div>Page Not Found</div>;
  },
});
