import { useNavigate } from "@tanstack/react-router";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authStore, authActions } from "../store/authStore";
import gsap from "gsap";
import BurgerMorphIcon from "./BurgerMorphIcon";
import ThemeToggle from "./ThemeToggle";

// API call function for logging out
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
  const logoutButtonRef = useRef(null);
  const [authState, setAuthState] = useState(authStore.state);
  const timeline = authStore.state.timeline; // Get the shared timeline from the store

  // Subscribe to the auth store to keep the component's state in sync
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setAuthState(authStore.state);
    });
    return unsubscribe;
  }, []);

  // Set up the mutation for the logout API call
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

  // Handle the animation logic
  useLayoutEffect(() => {
    if (!navRef.current || !logoutButtonRef.current) return;

    if (authState.isAuthenticated) {
      // Only add to the animation timeline on the initial login
      if (authActions.shouldAnimate()) {
        // Set the initial, hidden state of the navbar elements
        gsap.set(navRef.current, { y: -100, opacity: 0 });
        gsap.set(logoutButtonRef.current, { y: 20, opacity: 0 });

        // Add animations to the *shared timeline*. They will run automatically
        // after any preceding animations (like the logo).
        timeline
          .to(navRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          })
          .to(
            logoutButtonRef.current,
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=0.5" // Overlap animations for a smoother effect
          );
      } else {
        // If not animating (e.g., page refresh), show the navbar instantly
        gsap.set(navRef.current, { y: 0, opacity: 1 });
        gsap.set(logoutButtonRef.current, { y: 0, opacity: 1 });
      }
    } else {
      // If not authenticated, ensure the navbar is hidden
      gsap.set(navRef.current, { y: -100, opacity: 0 });
    }
  }, [authState.isAuthenticated, authState.isLoggingIn, timeline]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Do not render the component if the user is not authenticated
  if (!authState.isAuthenticated) return null;

  const handleMenuClick = () => {
    // Handle menu click logic here
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 h-18 z-40 bg-[rgba(255,255,255,0.4)] shadow-2xl border-b px-10"
    >
      <div
        className="max-w-min fixed cursor-pointer rounded-sm my-4"
        onClick={handleMenuClick}
      >
        <BurgerMorphIcon />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          ref={logoutButtonRef}
          className="text-gray-700 hover:text-blue-600 transition-colors disabled:opacity-50"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </button>
        <div className="max-w-min cursor-pointer my-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
