import React, { useLayoutEffect, useEffect, useState } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { authStore, authActions } from "../store/authStore";
import LoginForm from "../components/LoginForm";
import logo from "../assets/tiny-steps-logo.webp";
import gsap from "gsap";

function LoginPage() {
  const [authState, setAuthState] = useState(authStore.state);
  const navigate = useNavigate();

  // Subscribe to auth store changes
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setAuthState(authStore.state);
    });
    return unsubscribe;
  }, []);

  // Handle successful login
  useLayoutEffect(() => {
    // Using the new state from the store
    if (
      authStore.state.isAuthenticated &&
      !authStore.state.hasAnimationPlayed
    ) {
      // Hide the login page logo since the persistent logo will take over
      gsap.set(".login-logo", { opacity: 0 });

      // Navigate to dashboard after a brief delay to let animation start
      navigate({ to: "/dashboard" });
    }
  }, [authState.isAuthenticated, navigate]);

  const handleLoginSuccess = (userData) => {
    authActions.login(userData);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="login-logo absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <picture>
          <img src={logo} alt="Logo" className="h-30 w-30" />
        </picture>
      </div>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export const Route = createFileRoute("/")({
  // Redirect authenticated users to dashboard
  beforeLoad: ({ search }) => {
    const authState = authStore.state;
    // If user is already authenticated and not in the middle of the login animation
    if (authState.isAuthenticated && authState.hasAnimationPlayed) {
      // Redirect them to dashboard
      throw redirect({
        to: search.redirect || "/dashboard",
      });
    }
  },
  component: LoginPage,
});
