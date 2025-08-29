import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
 persist(
 (set) => ({
 // Initial state
 isAuthenticated: false,
 login: () => set({ isAuthenticated: true }),
 logout: () => set({ isAuthenticated: false }),
 }),
 {
 name: "auth-storage",
 getStorage: () => localStorage,
 }
 )
);

export default useAuthStore;