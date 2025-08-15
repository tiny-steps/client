import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { authStore, authActions } from "../store/authStore";
import gsap from "gsap";
import logo from "../assets/tiny-steps-logo.webp";

export const Route = createRootRoute({
  component: RootComponent,
});

function PersistentLogo() {
  const [authState, setAuthState] = useState(authStore.state);
  const logoRef = useRef(null);
  const timeline = authStore.state.timeline;

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setAuthState(authStore.state);
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    if (!logoRef.current) return;

    const logoElement = logoRef.current;

    // Set to invisible initially to prevent any flash
    gsap.set(logoElement, { opacity: 0 });

    if (authState.isAuthenticated) {
      if (authActions.shouldAnimate()) {
        // Let GSAP set the initial state completely to prevent any CSS/JS conflict
        gsap.set(logoElement, {
          position: "absolute",
          top: "30%",
          left: "50%",
          xPercent: -50, // GSAP's equivalent of -translate-x-1/2
          yPercent: -50, // GSAP's equivalent of -translate-y-1/2
          scale: 1,
          opacity: 1, // Make it visible now that it's positioned
        });

        // Add animations to the shared timeline
        timeline
          // 1. Pause for 0.5s after login
          .to({}, { duration: 0.5 })
          // 2. Animate logo to its final corner position
          .to(logoElement, {
            scale: 0.4,
            duration: 0.8,
            top: 0,
            left: 0,
            xPercent: 42,
            yPercent: -20,
            position: "fixed",
            ease: "power4.in",
          });
      } else {
        // If already logged in (e.g., on refresh), set the logo to its final position immediately
        gsap.set(logoElement, {
          position: "fixed",
          top: 0,
          left: 0,
          xPercent: 42,
          yPercent: -20,
          scale: 0.4,
          zIndex: 1000,
          opacity: 1,
        });
      }
    }
  }, [authState.isAuthenticated, timeline]);

  if (!authState.isAuthenticated) return null;

  return (
    // All positioning and styling is now handled by GSAP in the effect above
    <div ref={logoRef} className="z-[1000] bg-white rounded-full">
      <img src={logo} alt="Logo" className="h-30 w-30" />
    </div>
  );
}

function RootComponent() {
  const timeline = authStore.state.timeline;
  const [authState, setAuthState] = useState(authStore.state);

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setAuthState(authStore.state);
    });
    return unsubscribe;
  }, []);

  // Play the animation timeline when logging in
  useEffect(() => {
    if (authActions.shouldAnimate()) {
      timeline.play();
    }
  }, [authState.isAuthenticated, timeline]);

  return (
    <>
      <PersistentLogo />
      {/* This div creates the blurred background overlay when the sidenav is open */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[49] transition-opacity duration-300 ${
          authState.isSideNavOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        // Clicking the overlay will close the sidenav
        onClick={() => authActions.toggleSideNav()}
      />
      {/* The main content area no longer shifts */}
      <div className="relative">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  );
}
