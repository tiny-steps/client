import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function SideNav({
 items = [],
 bottomContent,
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

 const handleItemClick = (item) => {
 // If item has subItems, toggle expansion
 if (item.subItems && item.subItems.length > 0) {
 // If sidebar is collapsed, navigate to the first subItem instead of expanding
 if (!isOpen) {
 navigate(item.subItems[0].route);
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
 navigate(item.route);
 // Call the existing onItemClick handler
 onItemClick?.(item);
 }
 };

 const handleSubItemClick = (subItem) => {
 navigate(subItem.route);
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
 className={`fixed top-[4rem] left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 flex flex-col z-50 md:z-40 ${containerClassName}`}
 style={{
 width: isOpen ? 256 : 60,
 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
 }}
 >
 {/* Header - Fixed at top */}
 <div
 className={`sidenav-title text-gray-700 font-semibold pt-4 pb-6 px-4 overflow-hidden whitespace-nowrap transition-opacity duration-300 flex-shrink-0 ${
 isOpen ? "opacity-100" : "opacity-0"
 }`}
 >
 Tiny Steps
 <span className="text-sm text-gray-500 block">CDC</span>
 </div>

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
 className={`flex items-center p-2 mb-1 rounded-lg cursor-pointer transition-all duration-300 ${itemClassName} ${
 isActive
 ? "bg-blue-100 text-blue-600 font-bold"
 : "hover:bg-gray-100"
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
 className={`flex items-center p-2 mb-1 rounded-lg cursor-pointer transition-all duration-300 ${itemClassName} ${
 isSubActive
 ? "bg-blue-50 text-blue-600 font-semibold"
 : "hover:bg-gray-50"
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

 {/* Bottom Content - Fixed at bottom */}
 {bottomContent && (
 <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-2 py-4">
 {Array.isArray(bottomContent) ? (
 // If bottomContent is an array of items with icons
 bottomContent.map((item, idx) => (
 <div
 key={idx}
 className={`flex items-center p-2 mb-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100`}
 onClick={() => item.onClick?.()}
 title={!isOpen ? item.name : undefined}
 >
 <item.icon
 className={`flex-shrink-0 transition-all duration-300 ${
 isOpen ? "mr-3" : "mx-auto"
 }`}
 size={24}
 />
 {isOpen && (
 <div className="flex-grow">
 <span className="block whitespace-nowrap transition-opacity duration-300 opacity-100">
 {item.name}
 </span>
 {item.subtitle && (
 <span className="block text-xs text-gray-500 whitespace-nowrap">
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
