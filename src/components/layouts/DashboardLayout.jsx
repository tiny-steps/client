import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import useUserStore from "../../store/useUserStore.js";
import { useAuth } from "@/hooks/useAuthQuery.js";
import SideNav from "@/components/SideNav.jsx";
import Watermark from "@/components/Watermark.jsx";
import AdminBackgroundDecoration from "@/components/ui/background-decoration.jsx";
import { navItems, createBottomItems } from "@/config/navigation.js";
import DashboardHeader from "../DashboardHeader.jsx";
import { createTopItems } from "../../config/navigation.js";

const DashboardLayout = ({ children }) => {
  const { logoutMutation } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(navItems[0]);
  const email = useUserStore((state) => state.email);

  // Helper function to determine background variant based on route
  const getBackgroundVariant = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/patients')) return 'patients';
    if (path.includes('/doctors')) return 'doctors';
    if (path.includes('/schedule')) return 'schedule';
    if (path.includes('/reports')) return 'reports';
    return 'default';
  };

  // Helper function to get appropriate icon set based on route
  const getIconSet = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return ['BarChart3', 'TrendingUp', 'Activity', 'Target', 'Users'];
    if (path.includes('/patients')) return ['Users', 'Heart', 'Shield', 'BookOpen', 'Activity'];
    if (path.includes('/doctors')) return ['Users', 'Star', 'BookOpen', 'Shield', 'Target'];
    if (path.includes('/schedule')) return ['Calendar', 'Activity', 'Users', 'Target', 'BarChart3'];
    if (path.includes('/reports')) return ['FileText', 'BarChart3', 'TrendingUp', 'Activity', 'Target'];
    return ['Users', 'Calendar', 'BarChart3', 'Shield', 'Activity'];
  };

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background System */}
      <AdminBackgroundDecoration 
        variant={getBackgroundVariant()}
        iconSet={getIconSet()}
        opacity={0.25}
        enableAnimations={true}
      />
      
      {/* Preserve existing watermark for branding */}
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

      {/* Main content area with enhanced glass-morphism overlay */}
      <main className="transition-all duration-400 ease-in-out pt-16 h-screen overflow-y-auto relative z-10 ml-16">
        <div className="pb-6 px-4 sm:px-6 lg:px-8 relative">
          {/* Content backdrop for better readability */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px] rounded-lg" />
          <div className="relative z-10">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
