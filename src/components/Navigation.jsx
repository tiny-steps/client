import { useNavigate } from "@tanstack/react-router";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authStore, authActions } from "../store/authStore";
import gsap from "gsap";
import ThemeToggle from "./ThemeToggle";
import { useGSAP } from "@gsap/react";
import { logoutUser } from "../service/authService";
import { Home, Settings, User, LogOut } from "lucide-react"; // Example icons
import logo from "../assets/tiny-steps-logo.webp"; // Import the logo

// API call function for logging out

const Navigation = ({ isAnimated, setIsNavAnimated }) => {
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
  // ... inside your Navigation component

  useGSAP(
    () => {
      // Ensure the DOM elements are ready
      if (!navRef.current) return;

      if (authState.isAuthenticated) {
        if (authActions.shouldAnimate()) {
          gsap.set(navRef.current, { y: -100, opacity: 0 });
          gsap.set(".nav-item", { y: -20, opacity: 0 });

          timeline.to(navRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            onComplete: () => {
              gsap.to(".nav-item", {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: "elastic.out(1, 0.3)",
                stagger: 0.25,
                onComplete: () => {
                  // Animation complete callback
                  setIsNavAnimated(true);
                },
              });
            },
          });
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

  // Do not render the component if the user is not authenticated
  if (!authState.isAuthenticated) return null;

  return (
    <>
      <nav
        ref={navRef} // The ref is on the main container
        className="fixed top-0 left-0 right-0 h-18 z-40 bg-[rgba(255,255,255,0.6)] backdrop-blur-sm shadow-2xl border-b px-10"
      >
        {/* Add the common class "nav-item" to each element to be staggered */}
        <div className="flex items-center justify-between w-full">
          <div></div>
          <div className="flex items-center justify-end gap-3">
            <button
              className="nav-item text-gray-700 hover:text-blue-600 transition-colors disabled:opacity-50"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
            <div className="nav-item max-w-min cursor-pointer my-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
