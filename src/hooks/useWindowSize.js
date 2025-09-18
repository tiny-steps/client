import { useState, useEffect } from "react";

// Tailwind CSS breakpoints
const BREAKPOINTS = {
 sm: 640,
 md: 768,
 lg: 1024,
 xl: 1280,
 '2xl': 1536,
};

export function useWindowSize() {
 const [windowSize, setWindowSize] = useState({
 width: typeof window !== 'undefined' ? window.innerWidth : 1024,
 height: typeof window !== 'undefined' ? window.innerHeight : 768,
 });

 useEffect(() => {
 function handleResize() {
 setWindowSize({ 
 width: window.innerWidth,
 height: window.innerHeight 
 });
 }

 window.addEventListener("resize", handleResize);
 handleResize(); // Set initial size

 return () => window.removeEventListener("resize", handleResize);
 }, []);

 // Enhanced responsive utilities
 const responsive = {
 isMobile: windowSize.width < BREAKPOINTS.md,
 isTablet: windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg,
 isDesktop: windowSize.width >= BREAKPOINTS.lg,
 isLargeDesktop: windowSize.width >= BREAKPOINTS.xl,
 isExtraLarge: windowSize.width >= BREAKPOINTS['2xl'],
 breakpoint: (() => {
 if (windowSize.width >= BREAKPOINTS['2xl']) return '2xl';
 if (windowSize.width >= BREAKPOINTS.xl) return 'xl';
 if (windowSize.width >= BREAKPOINTS.lg) return 'lg';
 if (windowSize.width >= BREAKPOINTS.md) return 'md';
 if (windowSize.width >= BREAKPOINTS.sm) return 'sm';
 return 'xs';
 })(),
 };

 return { ...windowSize, ...responsive };
}
