import { create } from "zustand";
import { persist } from "zustand/middleware";
import { performCompleteLogout } from "../utils/storageUtils.js";

const useAuthStore = create(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => {
        // Perform complete logout cleanup
        performCompleteLogout();

        // Reset auth state
        set({ isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
