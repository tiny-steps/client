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
  const navigate = useNavigate();
  const timeline = authStore.state.timeline;

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setAuthState(authStore.state);
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    if (!logoRef.current) return;

    if (authState.isAuthenticated) {
      if (authActions.shouldAnimate()) {
        // Add logo animation to the shared timeline
        timeline.to(logoRef.current, {
          scale: 0.4,
          duration: 0.8,
          top: 0,
          left: 0,
          xPercent: 50,
          yPercent: -20,
          position: "fixed",
          ease: "power4.in",
          onComplete: () => {
            // Use the correct action name
            authActions.completeLoginAnimation();
          },
        });
      } else {
        // Already logged in (refresh) - show in final position immediately
        gsap.set(logoRef.current, {
          position: "fixed",
          top: 0,
          left: 0,
          xPercent: 50,
          yPercent: -20,
          scale: 0.4,
          zIndex: 1000,
          opacity: 1,
        });
      }
    } else {
      navigate({ to: "/" });
    }
  }, [
    authState.isAuthenticated,
    authState.isLoggingIn,
    authState.hasAnimated,
    timeline,
  ]);

  if (!authState.isAuthenticated) return null;

  return (
    <div
      ref={logoRef}
      className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000]"
    >
      <img src={logo} alt="Logo" className="h-30 w-30" />
    </div>
  );
}

function RootComponent() {
  const timeline = authStore.state.timeline;

  // This useEffect hook is no longer needed and has been removed.
  // The auth store initializes automatically when the app loads.

  // Play the animation timeline when logging in
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      const state = authStore.state;
      // Play the timeline only during the "in-flight" login state
      if (state.isLoggingIn && !state.hasAnimated) {
        timeline.play();
      }
    });
    return unsubscribe;
  }, [timeline]);

  return (
    <>
      <PersistentLogo />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
