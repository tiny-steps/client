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
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../service/authService";
import { useNavigate } from "@tanstack/react-router";

function DashboardPage() {
  const dashboardRef = useRef(null);
  const timeline = authStore.state.timeline;
  const navigate = useNavigate();
  const [isSideNavOpen, setIsSideNavOpen] = useState(
    authStore.state.isSideNavOpen
  );

  // Subscribe to side nav state changes to update button style
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setIsSideNavOpen(authStore.state.isSideNavOpen);
    });
    return unsubscribe;
  }, []);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      authActions.logout();
      navigate({ to: "/" });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      authActions.logout();
      navigate({ to: "/" });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  useGSAP(
    () => {
      if (!dashboardRef.current) return;

      if (authActions.shouldAnimate()) {
        gsap.set(dashboardRef.current, { scale: 0, opacity: 0 });
        timeline.to(
          dashboardRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            transformOrigin: "center center",
          },
          "-=0.4" // Overlap with previous animation
        );
      } else {
        gsap.set(dashboardRef.current, { scale: 1, opacity: 1 });
      }
    },
    { scope: dashboardRef }
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
      className={`flex item-center justify-center gap-4 mb-10 ml-3`}
      onClick={handleLogout}
    >
      <LogOut />
      <span className="nav-item-name">Logout</span>
    </button>
  );

  return (
    <div className="h-[200vh] bg-gray-50">
      <Navigation />
      <SideNav
        items={navItems}
        bottomContent={bottomContent}
        containerClassName="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg"
        itemClassName="hover:bg-gray-200 dark:hover:bg-gray-700"
        iconClassName="text-gray-500 dark:text-gray-400"
        subItemClassName="hover:bg-gray-200 dark:hover:bg-gray-700"
      />
      <div className="pt-24 px-6 mx-20" ref={dashboardRef}>
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
  beforeLoad: ({ location }) => {
    if (!authStore.state.isAuthenticated) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: DashboardPage,
});
