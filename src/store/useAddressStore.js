import { create } from "zustand";
import { addressService } from "../services/addressService.js";

const useAddressStore = create((set, get) => ({
  addresses: [],
  selectedAddressId: null,
  loading: false,
  error: null,

  setAddresses: (addresses) => set({ addresses }),

  setSelectedAddressId: (addressId) => set({ selectedAddressId: addressId }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  fetchAddresses: async (userId) => {
    if (!userId) {
      console.warn("No userId provided for address fetch");
      return;
    }

    set({ loading: true, error: null });
    try {
      const addresses = await addressService.getUserAddresses(userId);
      const addressArray = Array.isArray(addresses) ? addresses : [];

      set({ addresses: addressArray, loading: false });

      // Set default selected address to the default one or first address
      const currentState = get();
      if (addressArray.length > 0 && !currentState.selectedAddressId) {
        const defaultAddress =
          addressArray.find((addr) => addr.isDefault) || addressArray[0];
        set({ selectedAddressId: defaultAddress.id });
      }
    } catch (error) {
      console.warn("Failed to fetch addresses:", error.message);
      set({
        error: error.message,
        loading: false,
        addresses: [], // Ensure we have empty array on error
      });
    }
  },

  addAddress: async (addressData) => {
    if (!addressData) return;

    set({ loading: true, error: null });
    try {
      const newAddress = await addressService.createAddress(addressData);
      const currentAddresses = get().addresses;
      set({
        addresses: [...currentAddresses, newAddress],
        loading: false,
      });
      return newAddress;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateAddress: async (addressId, addressData) => {
    if (!addressId || !addressData) return;

    set({ loading: true, error: null });
    try {
      const updatedAddress = await addressService.updateAddress(
        addressId,
        addressData
      );
      const currentAddresses = get().addresses;
      const updatedAddresses = currentAddresses.map((addr) =>
        addr.id === addressId ? updatedAddress : addr
      );
      set({
        addresses: updatedAddresses,
        loading: false,
      });
      return updatedAddress;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    if (!addressId) return;

    set({ loading: true, error: null });
    try {
      await addressService.deleteAddress(addressId);
      const currentAddresses = get().addresses;
      const filteredAddresses = currentAddresses.filter(
        (addr) => addr.id !== addressId
      );
      const currentSelected = get().selectedAddressId;

      set({
        addresses: filteredAddresses,
        selectedAddressId:
          currentSelected === addressId
            ? filteredAddresses.length > 0
              ? filteredAddresses[0].id
              : null
            : currentSelected,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearAddresses: () =>
    set({
      addresses: [],
      selectedAddressId: null,
      error: null,
      loading: false,
    }),
}));

export default useAddressStore;
