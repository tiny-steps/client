import { useQuery } from "@tanstack/react-query";
import { addressService } from "../services/addressService.js";

// Hook to fetch address details by ID
export const useAddressDetails = (addressId, options = {}) => {
  return useQuery({
    queryKey: ["address", addressId],
    queryFn: () => addressService.getAddressById(addressId),
    enabled: !!addressId && options.enabled !== false,
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    ...options,
  });
};

// Hook to fetch multiple addresses at once
export const useMultipleAddressDetails = (addressIds, options = {}) => {
  return useQuery({
    queryKey: ["addresses", "multiple", addressIds],
    queryFn: async () => {
      if (!addressIds || addressIds.length === 0) return {};

      // Fetch all addresses in parallel
      const addressPromises = addressIds.map((id) =>
        addressService.getAddressById(id).catch((error) => {
          console.warn(`Failed to fetch address ${id}:`, error);
          return null;
        })
      );

      const addresses = await Promise.all(addressPromises);

      // Convert to object for easy lookup
      const addressMap = {};
      addressIds.forEach((id, index) => {
        if (addresses[index]) {
          addressMap[id] = addresses[index];
        }
      });

      return addressMap;
    },
    enabled: !!addressIds && addressIds.length > 0 && options.enabled !== false,
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    ...options,
  });
};

// Helper function to get address name from address object
export const getAddressDisplayName = (address) => {
  if (!address) return "Unknown Address";

  // Try to get branch name from metadata first
  if (address.metadata?.branchName) {
    return address.metadata.branchName;
  }

  // Fallback to address name
  if (address.name) {
    return address.name;
  }

  // Fallback to city + state
  if (address.city && address.state) {
    return `${address.city}, ${address.state}`;
  }

  // Last fallback
  return "Unknown Address";
};
