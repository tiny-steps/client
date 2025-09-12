import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBranchStore = create(
  persist(
    (set, get) => ({
      // Initial state
      branches: [],
      selectedBranchId: null,
      primaryBranchId: null,

      // Actions
      setBranches: (branches) => {
        const primaryBranch =
          branches.find((branch) => branch.isPrimary) || branches[0];
        set({
          branches,
          primaryBranchId: primaryBranch ? primaryBranch.id : null,
          selectedBranchId: primaryBranch ? primaryBranch.id : null,
        });
      },

      setSelectedBranchId: (branchId) => set({ selectedBranchId: branchId }),

      getSelectedBranch: () => {
        const { branches, selectedBranchId } = get();
        return (
          branches.find((branch) => branch.id === selectedBranchId) || null
        );
      },

      getPrimaryBranch: () => {
        const { branches, primaryBranchId } = get();
        return branches.find((branch) => branch.id === primaryBranchId) || null;
      },

      clearBranches: () =>
        set({
          branches: [],
          selectedBranchId: null,
          primaryBranchId: null,
        }),
    }),
    {
      name: "branch-store", // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

export default useBranchStore;
