import { createRootRoute, Outlet } from "@tanstack/react-router";
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

  // Subscribe to auth store changes
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
        // First time login - animate using the same approach as your original
        gsap.to(logoRef.current, {
          scale: 0.4,
          duration: 0.8,
          top: 0,
          left: 0,
          xPercent: 50,
          yPercent: -20,
          position: "fixed",
          ease: "linear",
          onComplete: () => {
            authActions.completeLogin();
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
      // Hide logo when not authenticated
      gsap.set(logoRef.current, { opacity: 0 });
    }
  }, [authState.isAuthenticated, authState.isLoggingIn, authState.hasAnimated]);

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
  // Initialize auth on app start
  useEffect(() => {
    authActions.initializeAuth();
  }, []);

  return (
    <>
      <PersistentLogo />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
