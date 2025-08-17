import {
  createFileRoute,
  redirect,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { authActions, authStore } from "../store/authStore";
import Navigation from "../components/Navigation";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SideNav from "../components/SideNav";
import {
  LogOut,
  Stethoscope,
  Baby,
  Clock,
  BookOpen,
  Calendar,
  ClipboardPlus,
  UserCircle,
  LayoutDashboardIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../service/authService";
import { useNavigate } from "@tanstack/react-router";

function DashboardLayout() {
  const user = authStore.state.user;
  const dashboardRef = useRef(null);
  const timeline = authStore.state.timeline;
  const navigate = useNavigate();
  const location = useLocation();
  const [isSideNavOpen, setIsSideNavOpen] = useState(
    authStore.state.isSideNavOpen
  );

  // Get active item from current route
  const getActiveItemFromPath = (pathname) => {
    if (pathname === "/dashboard" || pathname === "/dashboard/")
      return "Dashboard";
    if (pathname.includes("/doctors")) return "Doctor";
    if (pathname.includes("/patients")) return "Patient";
    if (pathname.includes("/timing")) return "Timing";
    if (pathname.includes("/session")) return "Session";
    if (pathname.includes("/schedule")) return "Schedule";
    if (pathname.includes("/report")) return "Report";
    return "Dashboard";
  };

  const [activeItem, setActiveItem] = useState(
    getActiveItemFromPath(location.pathname)
  );

  // Update active item when route changes
  useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);

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
        // Set initial state for main content animation
        gsap.set(dashboardRef.current, {
          scale: 0.8,
          opacity: 0,
          y: 50,
          transformOrigin: "center center",
        });

        // Dashboard appears AFTER logo animation completes
        timeline
          .to(
            dashboardRef.current,
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "logoAnimationEnd" // Start after logo completes
          )
          .addLabel("dashboardAnimationEnd"); // Add label for next animations
      } else {
        gsap.set(dashboardRef.current, { scale: 1, opacity: 1, y: 0 });
      }
    },
    { scope: dashboardRef }
  );

  const navItems = [
    {
      name: "Dashboard",
      route: "/dashboard",
      icon: LayoutDashboardIcon,
      subItems: null,
    },
    {
      name: "Doctor",
      route: "/dashboard/doctors",
      icon: Stethoscope,
      subItems: null,
    },
    {
      name: "Patient",
      route: "/dashboard/patients",
      icon: Baby,
      subItems: null,
    },
    {
      name: "Timing",
      route: "/dashboard/timing",
      icon: Clock,
      subItems: null,
    },
    {
      name: "Session",
      route: "/dashboard/session",
      icon: BookOpen,
      subItems: null,
    },
    {
      name: "Schedule",
      route: "/dashboard/schedule",
      icon: Calendar,
      subItems: null,
    },
    {
      name: "Report",
      route: "/dashboard/report",
      icon: ClipboardPlus,
      subItems: null,
    },
  ];

  const bottomContent = (
    <div className="mb-20  w-screen h-full">
      <button
        className="flex item-center justify-center gap-4  mb-6 ml-3 flex-row"
        onClick={() => navigate({ to: "/dashboard/profile" })}
      >
        <div className="flex items-center justify-center pt-1">
          <UserCircle size={32} />
        </div>
        <span className="nav-item-name flex flex-col gap-2 items-start justify-center ">
          Profile
          <span className="text-sm leading-2 font-light text-green-700 italic ">
            {user.email}
          </span>
        </span>
      </button>
      <button
        className={`flex item-center justify-center gap-4 ml-4`}
        onClick={handleLogout}
      >
        <LogOut size={32} />
        <span className="nav-item-name mt-1">Logout</span>
      </button>
    </div>
  );

  const handleItemClick = (item) => {
    // Navigate to the selected item's route
    navigate({ to: item.route });
  };

  return (
    <div
      ref={dashboardRef}
      className="h-screen w-full bg-[linear-gradient(135deg, #e3f0ff 0%, #f9f1ff 100%)] dark:bg-[linear-gradient(135deg,#1e1e2f 0%,#2e2e3f 100%)] overflow-hidden"
    >
      {/* Fixed Navigation Header */}
      <Navigation />

      {/* Fixed SideNav */}
      <SideNav
        items={navItems}
        bottomContent={bottomContent}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        containerClassName="bg-white dark:bg-gray-900/80 text-gray-700 dark:text-gray-200"
        itemClassName="hover:bg-gray-200 dark:hover:bg-gray-700"
        iconClassName="text-gray-500 dark:text-gray-400"
        subItemClassName="hover:bg-gray-200 dark:hover:bg-gray-700"
      />

      {/* Main Content Area - Fixed position, only scrolls */}
      <div className="h-screen pt-18 ml-20 overflow-y-auto">
        {/* This Outlet will render the nested route components */}
        <Outlet />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => {
    if (!authStore.state.isAuthenticated) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
  },
  component: DashboardLayout,
});
