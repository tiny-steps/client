import { create } from "zustand";
import { persist } from "zustand/middleware";
import { performCompleteLogout } from "../utils/storageUtils.js";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isTokenValidating: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => {
        // Perform complete logout cleanup
        performCompleteLogout();

        // Reset auth state
        set({ isAuthenticated: false });
      },
      setTokenValidating: (isValidating) => set({ isTokenValidating: isValidating }),
      clearAuthState: () => {
        // Clear authentication state without performing full logout cleanup
        set({ isAuthenticated: false, isTokenValidating: false });
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
