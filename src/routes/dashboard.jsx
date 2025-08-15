import { createFileRoute, redirect } from "@tanstack/react-router";
import { authActions, authStore } from "../store/authStore";
import Navigation from "../components/Navigation";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SideNav from "../components/SideNav";
import {
  Settings,
  User,
  LogOut,
  Stethoscope,
  Baby,
  Clock,
  BookOpen,
  Calendar,
  ClipboardPlus,
} from "lucide-react"; // Example icons
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../service/authService";

function DashboardPage() {
  const dashboardRef = useRef(null);
  const timeline = authStore.state.timeline;
  const [authState, setAuthState] = useState(authStore.state);
  const [isNavAnimated, setIsNavAnimated] = useState(false);
  const [isDashboardAnimated, setIsDashboardAnimated] = useState(false);

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setAuthState(authStore.state);
    });
    return unsubscribe;
  }, []);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      authActions.logout();
      navigate("/");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Log out on the client-side even if the server call fails
      authActions.logout();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  useGSAP(
    () => {
      if (!dashboardRef.current) return;

      if (authActions.shouldAnimate()) {
        if (isNavAnimated) {
          gsap.set(dashboardRef.current, { scale: 0, opacity: 0 });
          timeline.to(dashboardRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            transformOrigin: "center center",
            onComplete: () => {
              setIsDashboardAnimated(true);
            },
          });
        }
      } else {
        gsap.set(dashboardRef.current, { scale: 1, opacity: 1 });
        setIsDashboardAnimated(true);
      }
    },
    { scope: dashboardRef, dependencies: [isNavAnimated] }
  );

  const navItems = [
    { name: "Doctor", icon: Stethoscope, subItems: null },
    { name: "Patient", icon: Baby, subItems: null },
    { name: "Timing", icon: Clock, subItems: null },
    { name: "Session", icon: BookOpen, subItems: null },
    { name: "Schedule", icon: Calendar, subItems: null },
    { name: "Report", icon: ClipboardPlus, subItems: null },

    {
      name: "Settings",
      icon: Settings,
      subItems: [
        { name: "Profile", icon: User },
        { name: "Account", icon: User },
      ],
    },
  ];

  const bottomContent = (
    <button
      className="flex items-center p-2 rounded-lg w-full text-left mb-10"
      onClick={handleLogout}
    >
      <LogOut className="mr-4" />
      <span>Logout</span>
    </button>
  );

  return (
    <div className="h-[200vh] bg-gray-50">
      <Navigation
        isAnimated={isNavAnimated}
        setIsNavAnimated={setIsNavAnimated}
      />
      <SideNav
        items={navItems}
        bottomContent={bottomContent}
        containerClassName="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg"
        itemClassName="hover:bg-gray-200 dark:hover:bg-gray-700"
        iconClassName="text-gray-500 dark:text-gray-400"
        subItemClassName="hover:bg-gray-200 dark:hover:bg-gray-700"
        isDashboardAnimated={isDashboardAnimated}
      />
      <div className="pt-24 px-6" ref={dashboardRef}>
        {" "}
        {/* Add top padding to account for fixed navbar */}
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your account and explore features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">View your performance metrics</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-gray-600">Configure your preferences</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Reports</h3>
              <p className="text-gray-600">Generate detailed reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  // Add authentication guard
  beforeLoad: ({ location }) => {
    try {
      const authState = authStore.state;
      console.log("Dashboard beforeLoad - Auth state:", authState);

      if (!authState.isAuthenticated) {
        throw redirect({
          to: "/",
          search: {
            // Optionally save where they were trying to go
            redirect: location.href,
          },
        });
      }
    } catch (error) {
      if (error.redirect) {
        // Re-throw redirect errors
        throw error;
      }
      console.error("Error in dashboard beforeLoad:", error);
      // If there's any other error, redirect to login as a fallback
      throw redirect({ to: "/" });
    }
  },
  component: DashboardPage,
});
