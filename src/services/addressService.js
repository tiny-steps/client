class AddressService {
  constructor() {
    this.baseUrl = "/api/v1/addresses";
  }

  async getUserAddresses(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch user addresses");
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error fetching user addresses:", error);
      throw error;
    }
  }

  async createAddress(addressData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(addressData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create address");
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error creating address:", error);
      throw error;
    }
  }

  async updateAddress(addressId, addressData) {
    try {
      const response = await fetch(`${this.baseUrl}/${addressId}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(addressData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update address");
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  }

  async deleteAddress(addressId) {
    try {
      // Use soft delete for addresses to preserve historical data
      const response = await fetch(`${this.baseUrl}/${addressId}/soft-delete`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete address");
      }
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  }

  async reactivateAddress(addressId) {
    try {
      const response = await fetch(`${this.baseUrl}/${addressId}/reactivate`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reactivate address");
      }
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error reactivating address:", error);
      throw error;
    }
  }

  // Get JWT token from cookies (matching branchService pattern)
  getJwtToken() {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}

export const addressService = new AddressService();
