import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import useUserStore from "../../store/useUserStore.js";
import { useAuth } from "@/hooks/useAuthQuery.js";
import SideNav from "@/components/SideNav.jsx";
import Watermark from "@/components/Watermark.jsx";
import { navItems, createBottomItems } from "@/config/navigation.js";
import DashboardHeader from "../DashboardHeader.jsx";
import { createTopItems } from "../../config/navigation.js";

const DashboardLayout = ({ children }) => {
  const { logoutMutation } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(navItems[0]);
  const email = useUserStore((state) => state.email);

  const location = useLocation();
  const navigate = useNavigate();

  // Update active item based on current route
  useEffect(() => {
    const findActiveItem = (items, path) => {
      for (const item of items) {
        if (item.route === path) {
          return item;
        }
        if (item.subItems) {
          for (const subItem of item.subItems) {
            if (subItem.route === path) {
              return subItem;
            }
          }
        }
      }
      return null;
    };

    const currentItem = findActiveItem(navItems, location.pathname);
    if (currentItem) {
      setActiveItem(currentItem);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logoutMutation();
  };

  const handleProfileClick = () => {
    navigate({ to: "/profile" });
  };

  const handleHomeClick = () => {
    navigate({ to: "/" });
  };

  // Create bottom items with current email and logout handler
  const bottomItems = createBottomItems(
    email,
    handleLogout,
    handleProfileClick
  );

  const topItems = createTopItems(handleHomeClick);

  // When nav item clicked: mark active
  const handleNavItemClick = (item) => {
    setActiveItem(item);
    setIsNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background watermark for all pages */}
      <Watermark />

      <DashboardHeader isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />

      <SideNav
        isOpen={isNavOpen}
        setIsOpen={setIsNavOpen}
        items={navItems}
        activeItem={activeItem}
        onItemClick={handleNavItemClick}
        bottomContent={bottomItems}
        topContent={topItems}
      />

      {/* Main content area - fixed position, no margin shifts */}
      <main className="transition-all duration-400 ease-in-out pt-16 h-screen overflow-y-auto relative z-10 ml-16">
        <div className="pb-6 px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
