import React, { useLayoutEffect, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authStore, authActions } from "../../store/authStore";
import LoginForm from "../../components/LoginForm";
import logo from "../../assets/tiny-steps-logo.webp";
import gsap from "gsap";

const LoginPage = () => {
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
    if (authState.isAuthenticated && authState.isLoggingIn) {
      // Hide the login page logo since the persistent logo will take over
      gsap.set(".login-logo", { opacity: 0 });

      // Navigate to dashboard after a brief delay to let animation start
      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 100);
    }
  }, [authState.isAuthenticated, authState.isLoggingIn, navigate]);

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
};

export default LoginPage;
