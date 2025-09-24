import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function SideNav({
  items = [],
  bottomContent,
  topContent,
  activeItem,
  onItemClick,
  containerClassName = "",
  itemClassName = "",
  iconClassName = "",
  isOpen,
}) {
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Auto-expand parent items when their subroutes are active
  useEffect(() => {
    const currentExpandedItems = new Set();
    items.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        const hasActiveSubItem = item.subItems.some(
          (subItem) => location.pathname === subItem.route
        );
        if (hasActiveSubItem) {
          currentExpandedItems.add(item.name);
        }
      }
    });
    setExpandedItems(currentExpandedItems);
  }, [location.pathname, items]);

  const handleItemClick = (item) => {
    // If item has subItems, toggle expansion
    if (item.subItems && item.subItems.length > 0) {
      // If sidebar is collapsed, navigate to the first subItem instead of expanding
      if (!isOpen) {
        navigate({ to: item.subItems[0].route });
        onItemClick?.(item.subItems[0]);
        return;
      }

      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(item.name)) {
          newSet.delete(item.name);
        } else {
          newSet.add(item.name);
        }
        return newSet;
      });
    } else {
      // Navigate to the route
      navigate({ to: item.route });
      // Call the existing onItemClick handler
      onItemClick?.(item);
    }
  };

  const handleSubItemClick = (subItem) => {
    navigate({ to: subItem.route });
    onItemClick?.(subItem);
  };

  const isItemActive = (item) => {
    if (item.subItems && item.subItems.length > 0) {
      return item.subItems.some(
        (subItem) => location.pathname === subItem.route
      );
    }
    return location.pathname === item.route;
  };

  const isSubItemActive = (subItem) => {
    return location.pathname === subItem.route;
  };

  useGSAP(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        width: isOpen ? 256 : 60,
        duration: 0.5,
        ease: "linear",
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={navRef}
      className={`fixed top-[4rem] left-0 h-[calc(100vh-4rem)] bg-white/20 backdrop-blur-md border-r border-white/30 flex flex-col z-50 transition-all duration-500 ${containerClassName}`}
      style={{
        width: isOpen ? 256 : 60,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header - Fixed at top with enhanced styling */}
      <div
        className={`sidenav-title text-gray-800 font-bold pt-4 pb-6 px-4 overflow-hidden whitespace-nowrap transition-all duration-300 flex-shrink-0 border-b border-white/20 bg-white/10 backdrop-blur-sm ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Tiny Steps
        </div>
        <span className="text-sm text-gray-600 block font-medium">CDC</span>
      </div>

      {/* Top Content - After header with enhanced styling */}
      {topContent && (
        <div className="px-2 pb-4 border-b border-white/20">
          {Array.isArray(topContent) ? (
            topContent.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center p-2 mb-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-md hover:shadow-lg transform hover:scale-105`}
                onClick={() => item.onClick?.()}
                title={!isOpen ? item.name : undefined}
              >
                <item.icon
                  className={`flex-shrink-0 transition-all duration-300 text-gray-700 ${
                    isOpen ? "mr-3" : "mx-auto"
                  }`}
                  size={24}
                />
                {isOpen && (
                  <span className="block whitespace-nowrap transition-opacity duration-300 opacity-100 font-medium text-gray-800">
                    {item.name}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500 text-sm">
              Invalid top content format
            </div>
          )}
        </div>
      )}

      {/* Main Navigation Items - Scrollable area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="px-2 pb-4">
          {items.map((item, idx) => {
            const isActive = isItemActive(item);
            const isExpanded = expandedItems.has(item.name);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={idx}>
                <div
                  className={`flex items-center p-2 mb-1 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${itemClassName} ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-blue-300/30 text-blue-700 font-bold shadow-lg"
                      : "hover:bg-white/20 hover:backdrop-blur-md hover:shadow-md text-gray-700"
                  }`}
                  onClick={() => handleItemClick(item)}
                  title={!isOpen ? item.name : undefined} // Tooltip on collapsed
                >
                  <item.icon
                    className={`${iconClassName} flex-shrink-0 transition-all duration-300 ${
                      isOpen ? "mr-3" : "mx-auto"
                    }`}
                    size={24}
                  />
                  {isOpen && (
                    <>
                      <span className="flex-grow nav-item-name whitespace-nowrap transition-opacity duration-300 opacity-100">
                        {item.name}
                      </span>
                      {hasSubItems && (
                        <ChevronDown
                          className={`transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          size={16}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* SubItems */}
                {hasSubItems && isOpen && isExpanded && (
                  <div className="ml-6 mb-2">
                    {item.subItems.map((subItem, subIdx) => {
                      const isSubActive = isSubItemActive(subItem);
                      return (
                        <div
                          key={subIdx}
                          className={`flex items-center p-2 mb-1 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${itemClassName} ${
                            isSubActive
                              ? "bg-gradient-to-r from-blue-400/15 to-purple-400/15 backdrop-blur-sm border border-blue-200/30 text-blue-600 font-semibold shadow-md"
                              : "hover:bg-white/15 hover:backdrop-blur-sm text-gray-600"
                          }`}
                          onClick={() => handleSubItemClick(subItem)}
                          title={subItem.name}
                        >
                          <subItem.icon
                            className={`${iconClassName} flex-shrink-0 transition-all duration-300 mr-3`}
                            size={20}
                          />
                          <span className="flex-grow nav-item-name whitespace-nowrap transition-opacity duration-300 opacity-100 text-sm">
                            {subItem.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Content - Fixed at bottom with enhanced styling */}
      {bottomContent && (
        <div className="flex-shrink-0 border-t border-white/30 bg-white/10 backdrop-blur-sm px-2 py-4">
          {Array.isArray(bottomContent) ? (
            // If bottomContent is an array of items with icons
            bottomContent.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center p-2 mb-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-md hover:shadow-lg transform hover:scale-105`}
                onClick={() => item.onClick?.()}
                title={!isOpen ? item.name : undefined}
              >
                <item.icon
                  className={`flex-shrink-0 transition-all duration-300 text-gray-700 ${
                    isOpen ? "mr-3" : "mx-auto"
                  }`}
                  size={24}
                />
                {isOpen && (
                  <div className="flex-grow">
                    <span className="block whitespace-nowrap transition-opacity duration-300 opacity-100 font-medium text-gray-800">
                      {item.name}
                    </span>
                    {item.subtitle && (
                      <span className="block text-xs text-gray-600 whitespace-nowrap font-medium">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            // If bottomContent has an icon property, show it when collapsed
            <div
              className={`transition-all duration-300 ${
                isOpen ? "opacity-100" : "opacity-100"
              }`}
            >
              {bottomContent.icon && !isOpen ? (
                <div className="flex justify-center p-2">
                  <bottomContent.icon size={32} className="text-gray-600" />
                </div>
              ) : isOpen ? (
                bottomContent
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
