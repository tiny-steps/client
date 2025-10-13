/**
 * Utility functions for clearing browser storage and cookies
 */

/**
 * Clear all cookies for the current domain and subdomains
 */
export const clearAllCookies = () => {
  // Get all cookies
  const cookies = document.cookie.split(";");

  // Clear each cookie by setting it to expire in the past
  cookies.forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

    if (name) {
      // Clear for current path
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

      // Clear for current domain
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;

      // Clear for parent domain (if subdomain)
      if (window.location.hostname.includes(".")) {
        const parentDomain = window.location.hostname.substring(
          window.location.hostname.indexOf(".")
        );
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parentDomain}`;
      }

      // Clear for www subdomain
      if (window.location.hostname.startsWith("www.")) {
        const domainWithoutWww = window.location.hostname.substring(4);
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domainWithoutWww}`;
      }
    }
  });
};

/**
 * Clear all browser storage
 */
export const clearAllStorage = () => {
  // Clear localStorage
  localStorage.clear();

  // Clear sessionStorage
  sessionStorage.clear();

  // Clear IndexedDB (if used)
  if ("indexedDB" in window) {
    // Note: This is a simplified approach. In a real app, you might want to
    // clear specific databases rather than all of them
    try {
      indexedDB.databases?.().then((databases) => {
        databases.forEach((db) => {
          indexedDB.deleteDatabase(db.name);
        });
      });
    } catch (error) {
      console.warn("Could not clear IndexedDB:", error);
    }
  }
};

/**
 * Complete logout cleanup - clears all storage and cookies
 */
export const performCompleteLogout = () => {
  clearAllCookies();
  clearAllStorage();

  // Force reload to ensure all cached data is cleared
  // This is optional - you might want to navigate to login page instead
  // window.location.reload();
};

