import React, { useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

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

    const handleItemClick = (item) => {
        // Navigate to the route
        navigate(item.route);
        // Call the existing onItemClick handler
        onItemClick?.(item);
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
            className={`fixed top-[4rem] left-0 min-h-screen bg-white border-r border-gray-200 z-40 ${containerClassName}`}
            style={{
                width: isOpen ? 256 : 60,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            {/* Remove the close button since we're always visible */}
            <div
                className={`sidenav-title text-gray-700 font-semibold pt-4 pb-6 px-4 overflow-hidden whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            >
                Tiny Steps
                <span className="text-sm text-gray-500 block">CDC</span>
            </div>
            <div className="h-full flex flex-col pt-2">
                <div className="flex-grow px-2">
                    {items.map((item, idx) => {
                        const isActive = location.pathname === item.route;
                        return (
                            <div
                                key={idx}
                                className={`flex items-center p-2 mb-2 rounded-lg cursor-pointer transition-all duration-300 ${itemClassName} ${isActive ? "bg-blue-100 text-blue-600 font-bold" : "hover:bg-gray-100"}`}
                                onClick={() => handleItemClick(item)}
                                title={!isOpen ? item.name : undefined} // Tooltip on collapsed
                            >
                                <item.icon className={`${iconClassName} flex-shrink-0 transition-all duration-300 ${isOpen ? 'mr-3' : 'mx-auto'}`} size={24} />
                                {isOpen && (
                                    <span className="flex-grow nav-item-name whitespace-nowrap transition-opacity duration-300 opacity-100">
                                        {item.name}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className={`bottom-20 left-2 flex flex-col items-center justify-center absolute`}>
                    {bottomContent && (
                        <div className={`p-2 transition-all duration-300`}>
                            {Array.isArray(bottomContent) ? (
                                // If bottomContent is an array of items with icons
                                bottomContent.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center p-2 mb-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100`}
                                        onClick={() => item.onClick?.()}
                                        title={!isOpen ? item.name : undefined}
                                    >
                                        <item.icon className={`flex-shrink-0 transition-all duration-300 ${isOpen ? 'mr-3' : 'mx-auto'}`} size={24} />
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
                                <div className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-100'}`}>
                                    {bottomContent.icon && !isOpen ? (
                                        <div className="flex justify-center p-2">
                                            <bottomContent.icon size={32} className="text-gray-600" />
                                        </div>
                                    ) : isOpen ? bottomContent : null}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
