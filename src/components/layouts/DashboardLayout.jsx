import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import useUserStore from "../../store/useUserStore.js";
import { useAuth } from "@/hooks/useAuthQuery.js";
import Header from "@/components/Header.jsx";
import SideNav from "@/components/SideNav.jsx";
import Watermark from "@/components/Watermark.jsx";
import { navItems, createBottomItems } from "@/config/navigation.js";

const DashboardLayout = () => {
  const { logoutMutation } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(navItems[0]);
  const email = useUserStore((state) => state.email);
  const location = useLocation();
  const navigate = useNavigate();

  // Update active item based on current route
  useEffect(() => {
    const currentItem = navItems.find(
      (item) => item.route === location.pathname
    );
    if (currentItem) {
      setActiveItem(currentItem);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logoutMutation();
  };

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
  };

  // Create bottom items with current email and logout handler
  const bottomItems = createBottomItems(
    email,
    handleLogout,
    handleProfileClick
  );

  // When nav item clicked: mark active
  const handleNavItemClick = (item) => {
    setActiveItem(item);
    setIsNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background watermark for all pages */}
      <Watermark />

      <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />

      <SideNav
        isOpen={isNavOpen}
        setIsOpen={setIsNavOpen}
        items={navItems}
        activeItem={activeItem}
        onItemClick={handleNavItemClick}
        bottomContent={bottomItems}
      />

      {/* Main content area - fixed position, no margin shifts */}
      <main className="transition-all duration-400 ease-in-out pt-16 h-screen overflow-y-auto relative z-10 ml-16">
        <div className="pb-6 px-4 sm:px-6 lg:px-8">
          <Outlet context={{ activeItem }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
