import useAddressStore from "../store/useAddressStore.js";

/**
 * Custom hook to get the effective branch ID for API calls.
 * When "all" is selected, returns null so services fetch data from all branches.
 * Otherwise returns the selected address ID as branch ID.
 */
export const useBranchFilter = () => {
  const selectedAddressId = useAddressStore((state) => state.selectedAddressId);

  // Return null for "all" selection, actual ID otherwise
  const branchId = selectedAddressId === "all" ? null : selectedAddressId;

  // For enabled conditions in queries - should be true when we have a selection (including "all")
  const hasSelection = !!selectedAddressId;

  return {
    branchId,
    hasSelection,
    selectedAddressId,
    isAllSelected: selectedAddressId === "all",
  };
};

