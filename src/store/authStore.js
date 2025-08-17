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
        isSideNavOpen: false,
        // Restore animation state from storage
        hasAnimationPlayed: authData.hasAnimationPlayed || false,
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
    isSideNavOpen: false,
    hasAnimationPlayed: false,
  };
};

const loginAnimationTimeline = gsap.timeline({ paused: true });

// Create the auth store with the initial state and the shared timeline
export const authStore = new Store({
  ...initializeAuthState(),
  timeline: loginAnimationTimeline,
});

// Define actions to update the store's state
export const authActions = {
  login: (userData) => {
    const hasAnimationPlayed = false; // Always reset on a new login
    authStore.setState((state) => ({
      ...state,
      isAuthenticated: true,
      user: userData,
      hasAnimationPlayed,
    }));

    // Persist the initial login state to localStorage
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({
        isAuthenticated: true,
        user: userData,
        hasAnimationPlayed,
      })
    );
  },

  completeLoginAnimation: () => {
    const hasAnimationPlayed = true;
    authStore.setState((state) => ({
      ...state,
      hasAnimationPlayed,
    }));

    // Update localStorage to reflect that the animation is complete
    const currentAuth = JSON.parse(
      localStorage.getItem("auth-storage") || "{}"
    );
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({
        ...currentAuth,
        hasAnimationPlayed,
      })
    );
  },

  logout: () => {
    authStore.setState((state) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      hasAnimationPlayed: false,
      isSideNavOpen: false,
    }));

    localStorage.removeItem("auth-storage");
    loginAnimationTimeline.seek(0).pause();
  },

  shouldAnimate: () => {
    const state = authStore.state;
    return state.isAuthenticated && !state.hasAnimationPlayed;
  },
  toggleSideNav: () => {
    authStore.setState((state) => ({
      ...state,
      isSideNavOpen: !state.isSideNavOpen,
    }));
  },
};
