import { Link, useNavigate } from "@tanstack/react-router";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authStore, authActions } from "../store/authStore";
import gsap from "gsap";
import logo from "../assets/tiny-steps-logo.webp";
const logoutUser = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Logout failed");
  }

  return response.json();
};

const Navigation = () => {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [authState, setAuthState] = useState(authStore.state);

  // Subscribe to auth store changes
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setAuthState(authStore.state);
    });

    return unsubscribe;
  }, []);

  // Use mutation at component level (NOT inside handleLogout)
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      authActions.logout();
      navigate("/");
    },
    onError: (error) => {
      // Still logout locally even if server request fails
      authActions.logout();
    },
  });

  useLayoutEffect(() => {
    if (!navRef.current) return;

    // Set initial navbar state (hidden above screen)
    gsap.set(navRef.current, {
      y: -100,
      opacity: 0,
    });

    if (authState.isAuthenticated) {
      if (authState.isLoggingIn) {
        // Coming from login - wait for logo animation to complete
        gsap.to(navRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          delay: 1.2, // Wait for logo animation to complete
        });
      } else {
        // Direct navigation or refresh - show navbar immediately
        gsap.to(navRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  }, [authState.isAuthenticated, authState.isLoggingIn]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!authState.isAuthenticated) return null;

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 h-18 z-40 bg-[rgb(255,255,255,0.4)]  shadow-2xl border-b px-10"
    >
      <div className="flex items-center justify-end px-6 py-5.5">
        <button
          className="text-gray-700 hover:text-blue-600 transition-colors disabled:opacity-50"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
