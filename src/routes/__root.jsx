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
          // Animate logo to its final corner position immediately
          .to(logoElement, {
            scale: 0.4,
            duration: 0.6, // Reduced from 0.8 for faster animation
            top: 0,
            left: 0,
            xPercent: 42,
            yPercent: -20,
            position: "fixed",
            ease: "power3.out", // Changed to power3.out for smoother finish
          })
          .addLabel("logoAnimationEnd"); // Add this label
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
    // This container gets the background styling for dark mode
    <div ref={logoRef} className="z-[1000] rounded-full bg-white duration-500">
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
        className={`fixed top-0 bottom-0 right-0 bg-black/20 backdrop-blur-sm z-[49] transition-all duration-300 ${
          authState.isSideNavOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          left: authState.isSideNavOpen ? "256px" : "80px", // Start after the sidenav
        }}
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
