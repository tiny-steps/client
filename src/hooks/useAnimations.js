import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * Custom hook for page entrance animations
 * Provides consistent entrance animations for protected pages
 */
export const usePageEntranceAnimation = (options = {}) => {
  const pageRef = useRef(null);
  const {
    duration = 0.8,
    delay = 0,
    ease = "power2.out",
    enableStagger = true,
    staggerDelay = 0.1
  } = options;

  useGSAP(() => {
    if (!pageRef.current) return;

    const tl = gsap.timeline();

    // Main page container animation
    tl.fromTo(
      pageRef.current,
      { 
        opacity: 0, 
        y: 30, 
        scale: 0.98 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration,
        delay,
        ease 
      }
    );

    // Stagger child elements if enabled
    if (enableStagger) {
      const children = pageRef.current.querySelectorAll('.animate-child');
      if (children.length > 0) {
        tl.fromTo(
          children,
          { 
            opacity: 0, 
            y: 20 
          },
          { 
            opacity: 1, 
            y: 0,
            duration: 0.6,
            stagger: staggerDelay,
            ease: "power2.out"
          },
          "-=0.4"
        );
      }
    }
  }, [duration, delay, ease, enableStagger, staggerDelay]);

  return pageRef;
};

/**
 * Custom hook for card reveal animations
 * Used for dashboard cards and content cards
 */
export const useCardRevealAnimation = (options = {}) => {
  const containerRef = useRef(null);
  const {
    trigger = "load",
    stagger = 0.15,
    duration = 0.6,
    distance = 40
  } = options;

  useGSAP(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.card-animate');
    
    if (cards.length === 0) return;

    const tl = gsap.timeline();

    tl.fromTo(
      cards,
      { 
        opacity: 0, 
        y: distance,
        scale: 0.95,
        rotationX: 10
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        rotationX: 0,
        duration,
        stagger,
        ease: "back.out(1.2)"
      }
    );
  }, [trigger, stagger, duration, distance]);

  return containerRef;
};

/**
 * Custom hook for hover interactions
 * Provides smooth hover effects for interactive elements
 */
export const useHoverAnimation = (ref, options = {}) => {
  const {
    scale = 1.05,
    duration = 0.3,
    ease = "power2.out",
    shadow = true
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale,
        duration,
        ease,
        boxShadow: shadow ? "0 10px 30px rgba(0,0,0,0.15)" : undefined
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration,
        ease,
        boxShadow: shadow ? "0 4px 15px rgba(0,0,0,0.1)" : undefined
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, scale, duration, ease, shadow]);
};

/**
 * Custom hook for form field animations
 * Provides focus animations for form inputs
 */
export const useFormAnimation = () => {
  const formRef = useRef(null);

  useGSAP(() => {
    if (!formRef.current) return;

    const inputs = formRef.current.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const handleFocus = () => {
        gsap.to(input, {
          scale: 1.02,
          duration: 0.2,
          ease: "power2.out"
        });
      };

      const handleBlur = () => {
        gsap.to(input, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      };

      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    // Cleanup function
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);

  return formRef;
};

/**
 * Custom hook for table/list animations
 * Provides staggered animations for table rows
 */
export const useTableAnimation = (options = {}) => {
  const tableRef = useRef(null);
  const {
    stagger = 0.05,
    duration = 0.4,
    delay = 0.2
  } = options;

  useGSAP(() => {
    if (!tableRef.current) return;

    const rows = tableRef.current.querySelectorAll('tr, .list-item');
    
    if (rows.length === 0) return;

    gsap.fromTo(
      rows,
      { 
        opacity: 0, 
        x: -20 
      },
      { 
        opacity: 1, 
        x: 0,
        duration,
        stagger,
        delay,
        ease: "power2.out"
      }
    );
  }, [stagger, duration, delay]);

  return tableRef;
};

/**
 * Custom hook for loading animations
 * Provides loading state animations
 */
export const useLoadingAnimation = (isLoading) => {
  const loadingRef = useRef(null);

  useGSAP(() => {
    if (!loadingRef.current) return;

    if (isLoading) {
      gsap.to(loadingRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "none"
      });
    } else {
      gsap.killTweensOf(loadingRef.current);
      gsap.set(loadingRef.current, { rotation: 0 });
    }
  }, [isLoading]);

  return loadingRef;
};

/**
 * Utility function to create page transition animations
 */
export const createPageTransition = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

export default {
  usePageEntranceAnimation,
  useCardRevealAnimation,
  useHoverAnimation,
  useFormAnimation,
  useTableAnimation,
  useLoadingAnimation,
  createPageTransition
};