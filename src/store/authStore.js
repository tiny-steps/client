import { Store } from "@tanstack/store";

// Create the auth store
export const authStore = new Store({
  isAuthenticated: false,
  user: null,
  isLoggingIn: false,
  hasAnimated: false, // Track if logo animation has already played
});

// Auth actions
export const authActions = {
  login: (userData) => {
    authStore.setState((state) => ({
      ...state,
      isAuthenticated: true,
      user: userData,
      isLoggingIn: true,
      hasAnimated: false, // Reset animation flag on new login
    }));

    // Store in localStorage for persistence
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({
        isAuthenticated: true,
        user: userData,
        hasAnimated: false,
      })
    );
  },

  completeLogin: () => {
    authStore.setState((state) => ({
      ...state,
      isLoggingIn: false,
      hasAnimated: true, // Mark animation as completed
    }));

    // Update localStorage
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
    authStore.setState((state) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      isLoggingIn: false,
      hasAnimated: false, // Reset animation flag on logout
    }));

    // Clear localStorage
    localStorage.removeItem("auth-storage");
  },

  initializeAuth: () => {
    // Check localStorage for existing auth
    const storedAuth = localStorage.getItem("auth-storage");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      authStore.setState((state) => ({
        ...state,
        isAuthenticated: authData.isAuthenticated || false,
        user: authData.user || null,
        hasAnimated: authData.hasAnimated || false, // Preserve animation state
        isLoggingIn: false,
      }));
    }
  },

  // Check if should animate (first time login in this session)
  shouldAnimate: () => {
    const state = authStore.state;
    return state.isAuthenticated && state.isLoggingIn && !state.hasAnimated;
  },
};
