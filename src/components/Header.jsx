import React, { useEffect, useCallback } from "react";
import MenuIcon from "./MenuIcon";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useBranchStore from "../store/useBranchStore.js";
import useAddressStore from "../store/useAddressStore.js";
import useUserStore from "../store/useUserStore.js";
import { branchService } from "../services/branchService.js";
import { jwtDecode } from "jwt-decode";

export default function Header({ isNavOpen, setIsNavOpen }) {
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const branches = useBranchStore((state) => state.branches);
  const selectedBranchId = useBranchStore((state) => state.selectedBranchId);
  const setBranches = useBranchStore((state) => state.setBranches);
  const setSelectedBranchId = useBranchStore(
    (state) => state.setSelectedBranchId
  );

  // User store hooks
  const userId = useUserStore((state) => state.userId);

  // Address store hooks
  const addresses = useAddressStore((state) => state.addresses);
  const selectedAddressId = useAddressStore((state) => state.selectedAddressId);
  const setSelectedAddressId = useAddressStore(
    (state) => state.setSelectedAddressId
  );
  const fetchAddresses = useAddressStore((state) => state.fetchAddresses);

  const getJwtToken = useCallback(() => {
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
  }, []);

  // Extract branches from JWT token and fetch addresses on component mount
  useEffect(() => {
    const token = getJwtToken();
    console.log("🔍 Debug - JWT Token found:", !!token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("🔍 Debug - Decoded token:", decodedToken);

        const contextIds =
          decodedToken.contextIds || decodedToken.branchIds || [];
        const primaryContextId =
          decodedToken.primaryContextId || decodedToken.primaryBranchId || null;
        const userId = decodedToken.sub || decodedToken.userId;

        console.log("🔍 Debug - UserId extracted:", userId);
        console.log("🔍 Debug - ContextIds:", contextIds);

        const branchList = contextIds.map((id) => ({
          id,
          name: `Branch ${id.substring(0, 8)}`,
          isPrimary: id === primaryContextId,
        }));

        setBranches(branchList);

        // Set default selected branch to primary branch
        if (primaryContextId && branchList.length > 0) {
          const primaryBranch = branchList.find((branch) => branch.isPrimary);
          if (primaryBranch) {
            setSelectedBranchId(primaryBranch.id);
          } else {
            setSelectedBranchId(branchList[0].id);
          }
        }

        // Note: Address fetching moved to separate useEffect below
      } catch (error) {
        console.error("Failed to decode JWT token:", error);
      }
    } else {
      console.warn("🔍 Debug - No JWT token found in cookies");
    }
  }, [setBranches, setSelectedBranchId, getJwtToken]);

  // Fetch addresses when userId is available (simple approach)
  useEffect(() => {
    if (userId) {
      console.log("🔍 Debug - Fetching addresses for userId:", userId);
      fetchAddresses(userId).catch((error) => {
        console.warn("Failed to fetch addresses:", error.message);
      });
    } else {
      console.log("🔍 Debug - No userId available, skipping address fetch");
    }
  }, [userId, fetchAddresses]);

  const handleBranchChange = (event) => {
    setSelectedBranchId(event.target.value);
  };

  const handleAddressChange = (event) => {
    setSelectedAddressId(event.target.value);
  };

  useGSAP(() => {
    const tl = gsap.timeline({ paused: true });
    tl.from(".navbar", {
      opacity: 0,
      y: -50,
      duration: 0.5,
    }).from(".nav-item", {
      opacity: 0,
      y: -50,
      duration: 0.5,
      stagger: 0.2,
    });
    tl.play();
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm px-5 fixed top-0 left-0 right-0 z-50">
      <div className="navbar-start flex items-center justify-start gap-4 ">
        <div
          role="button"
          className="nav-item btn btn-ghost btn-circle ml-[-10px]"
          onClick={toggleNav}
        >
          <MenuIcon isOpen={isNavOpen} />
        </div>
        <div className={`nav-item bg-transparent`}>
          <img
            src="/logo_outlined.webp"
            alt=""
            className={`w-12 h-12 object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.3)]`}
          />
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">
          Tiny Steps Child Development Center
        </a>
      </div>
      <div className="navbar-end flex items-center gap-2">
        {/* Address Selection Dropdown - Always show for testing */}
        <div className="form-control">
          <select
            className="select select-bordered select-sm w-full max-w-xs"
            value={selectedAddressId || ""}
            onChange={handleAddressChange}
            title="Select Address"
          >
            <option value="">
              {addresses.length === 0
                ? "No Addresses Available"
                : "Select Address"}
            </option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.name || `${address.type} - ${address.city}`}
                {address.isDefault ? " (Default)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Selection Dropdown */}
        {branches.length > 1 && (
          <div className="form-control">
            <select
              className="select select-bordered select-sm w-full max-w-xs"
              value={selectedBranchId || ""}
              onChange={handleBranchChange}
              title="Select Branch"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} {branch.isPrimary ? "(Primary)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <button className="btn btn-ghost btn-circle nav-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="btn btn-ghost btn-circle nav-item">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </div>
  );
}
