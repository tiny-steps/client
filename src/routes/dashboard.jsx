import { createFileRoute, redirect } from "@tanstack/react-router";
import { authActions, authStore } from "../store/authStore";
import Navigation from "../components/Navigation";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { da } from "zod/v4/locales";

function DashboardPage() {
  const dashboardRef = useRef(null);
  const timeline = authStore.state.timeline;
  const [authState, setAuthState] = useState(authStore.state);
  const [isNavAnimated, setIsNavAnimated] = useState(false);

  useGSAP(
    () => {
      if (!dashboardRef.current) return;

      if (authState.isAuthenticated) {
        if (authActions.shouldAnimate()) {
          if (!isNavAnimated) {
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
              "+=1"
            );
          }
        } else {
          gsap.set(dashboardRef.current, { scale: 1, opacity: 1 });
        }
      } else {
        gsap.set(dashboardRef.current, { scale: 0, opacity: 0 });
      }
    },
    { scope: dashboardRef, dependencies: [authState.isAuthenticated] }
  );

  return (
    <div className="h-[200vh] bg-gray-50">
      <Navigation
        isAnimated={isNavAnimated}
        setIsNavAnimated={setIsNavAnimated}
      />
      <div className="pt-20 px-6" ref={dashboardRef}>
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
