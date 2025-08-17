import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authStore, authActions } from "../store/authStore";
import gsap from "gsap";
import ThemeToggle from "./ThemeToggle";
import { useGSAP } from "@gsap/react";
import { logoutUser } from "../service/authService";
import { BellDot, UserCircle } from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [authState, setAuthState] = useState(authStore.state);
  const timeline = authStore.state.timeline;

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
      navigate({ to: "/" });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      authActions.logout();
    },
  });

  useGSAP(
    () => {
      if (!navRef.current) return;

      if (authState.isAuthenticated) {
        if (authActions.shouldAnimate()) {
          gsap.set(navRef.current, { y: -100, opacity: 0 });
          gsap.set(".nav-item", { y: -20, opacity: 0 });

          timeline
            .to(
              navRef.current,
              {
                y: 0,
                opacity: 1,
                duration: 0.6, // Reduced duration for snappier animation
                ease: "power3.out",
              },
              "dashboardAnimationEnd" // Start after dashboard appears
            )
            .to(".nav-item", {
              y: 0,
              opacity: 1,
              duration: 0.3, // Faster nav item animations
              ease: "elastic.out(1, 0.3)",
              stagger: 0.15, // Reduced stagger for faster sequence
            })
            .addLabel("navAnimationEnd"); // Add this label for sidenav
        } else {
          gsap.set(navRef.current, { y: 0, opacity: 1 });
          gsap.set(".nav-item", { y: 0, opacity: 1 });
        }
      } else {
        gsap.set(navRef.current, { y: -100, opacity: 0 });
        gsap.set(".nav-item", { y: -20, opacity: 0 });
      }
    },
    { scope: navRef, dependencies: [authState.isAuthenticated] }
  );

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!authState.isAuthenticated) return null;

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 h-18 z-40 bg-white/60 dark:bg-gray-900/80 backdrop-blur-sm shadow-2xl border-b border-gray-200 dark:border-gray-700 px-10 transition-colors duration-200"
    >
      <div className="flex items-center justify-between w-full h-full">
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-gray-900 dark:text-white font-semibold">
          <div className="hidden lg:block text-lg whitespace-nowrap">
            Tiny Steps Child Development Center
          </div>
          <div className="hidden md:block lg:hidden text-base whitespace-nowrap">
            Tiny Steps CDC
          </div>
          <div className="block md:hidden text-sm">
            <div>Tiny Steps</div>
            <div className="text-xs leading-tight">CDC</div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 ml-auto">
          <div className="nav-item max-w-min cursor-pointer my-4 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            <BellDot size={32} />
          </div>
          <div className="nav-item max-w-min cursor-pointer my-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
