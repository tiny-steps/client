import { Store } from "@tanstack/store";
import gsap from "gsap";

// Initialize auth state from localStorage
const initializeAuthState = () => {
  try {
    const storedAuth = localStorage.getItem("auth-storage");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      return {
        isAuthenticated: authData.isAuthenticated || false,
        user: authData.user || null,
        isLoggingIn: false, // This should always be false on initialization
        hasAnimated: authData.hasAnimated || false,
      };
    }
  } catch (error) {
    console.error("Error parsing stored auth data:", error);
    localStorage.removeItem("auth-storage"); // Clear corrupted data
  }
  // Default state if nothing is stored or if there's an error
  return {
    isAuthenticated: false,
    user: null,
    isLoggingIn: false,
    hasAnimated: false,
  };
};

// Create a single, shared GSAP timeline that is initially paused.
// This timeline will manage the entire login animation sequence.
const loginAnimationTimeline = gsap.timeline({ paused: true });

// Create the auth store with the initial state and the shared timeline
export const authStore = new Store({
  ...initializeAuthState(),
  timeline: loginAnimationTimeline,
});

// Define actions to update the store's state
export const authActions = {
  login: (userData) => {
    // When a user logs in, set isAuthenticated and isLoggingIn to true.
    // This begins the login sequence.
    authStore.setState((state) => ({
      ...state,
      isAuthenticated: true,
      user: userData,
      isLoggingIn: true,
      hasAnimated: false,
    }));

    // Persist the core authentication state to localStorage.
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({
        isAuthenticated: true,
        user: userData,
        hasAnimated: false, // Ensure hasAnimated is reset
      })
    );
  },

  completeLoginAnimation: () => {
    // This action is called when the login animation sequence is finished.
    authStore.setState((state) => ({
      ...state,
      isLoggingIn: false, // The "in-flight" login state is now over
      hasAnimated: true, // Mark that the animation has been shown
    }));

    // Update localStorage to reflect that the animation is complete for this session.
    const currentAuth = JSON.parse(
      localStorage.getItem("auth-storage") || "{}"
    );
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({
        ...currentAuth,
        hasAnimated: true,
      })
    );
  },

  logout: () => {
    // Reset the entire authentication state on logout.
    authStore.setState((state) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      isLoggingIn: false,
      hasAnimated: false,
    }));

    // Clear the authentication data from localStorage.
    localStorage.removeItem("auth-storage");
    // Rewind the timeline to be ready for the next login
    loginAnimationTimeline.seek(0).pause();
  },

  // This action determines if the one-time login animation should run.
  shouldAnimate: () => {
    const state = authStore.state;
    return state.isAuthenticated && state.isLoggingIn && !state.hasAnimated;
  },
};
