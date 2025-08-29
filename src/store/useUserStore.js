import { create } from "zustand";
import {persist} from "zustand/middleware";

const useUserStore = create(
 persist(
 (set) => ({
 // Initial state
 userId: null,
 role: null,
 email: null,
 // Actions
 setUser: (user) => set({ userId: user.id, role: user.role, email: user.email }),
 clearUser: () => set({ userId: null, role: null, email: null }),
 }),
 {
 name: "user-store", // name of the item in the storage (must be unique)
 getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
 }
 )
);

export default useUserStore;