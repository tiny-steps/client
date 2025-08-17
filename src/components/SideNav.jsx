import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import BurgerMorphIcon from "./BurgerMorphIcon";
import { authActions, authStore } from "../store/authStore";

// Register GSAP plugins once at the module level
gsap.registerPlugin(SplitText);

// ✨ Define the props your component will accept, including the new ones
const SideNav = ({
  items,
  bottomContent,
  activeItem,
  onItemClick,
  containerClassName = "",
  itemClassName = "",
  iconClassName = "",
  subItemClassName = "",
}) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(authStore.state.isSideNavOpen);
  const navRef = useRef(null);
  const subMenuRefs = useRef([]);
  const timeline = authStore.state.timeline;
  const [isIntroAnimationComplete, setIntroAnimationComplete] = useState(
    !authActions.shouldAnimate()
  );

  // ✨ Define the CSS classes for the active item
  const activeItemStyles =
    "bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-white";

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setIsOpen(authStore.state.isSideNavOpen);
    });
    return unsubscribe;
  }, []);

  // Initial animation on login
  useGSAP(
    () => {
      if (authActions.shouldAnimate()) {
        gsap.set(navRef.current, { x: "-100%", width: 256 });
        gsap.set(".nav-item-name", { opacity: 1 });

        timeline
          .to(
            navRef.current,
            {
              x: "0%",
              duration: 0.6, // Reduced duration
              ease: "power3.out",
            },
            "navAnimationEnd" // Start after navbar and nav items complete
          )
          .to(navRef.current, {
            width: 80,
            duration: 0.3, // Faster width animation
            ease: "power2.inOut",
          })
          .to(
            ".nav-item-name",
            {
              opacity: 0,
              duration: 0.2,
            },
            "<"
          )
          .call(() => {
            setIntroAnimationComplete(true);
            authActions.completeLoginAnimation();
          });
      } else {
        gsap.set(navRef.current, { x: "0%", width: 80 });
        gsap.set(".nav-item-name", { opacity: 0 });
        setIntroAnimationComplete(true);
      }
    },
    { scope: navRef, dependencies: [] }
  );

  // Animation for opening/closing the sidenav (no changes here)
  useGSAP(
    () => {
      if (!isIntroAnimationComplete) return;

      gsap.to(navRef.current, {
        width: isOpen ? 256 : 80,
        duration: 0.3,
        ease: "power2.inOut",
      });

      gsap.to(".nav-item-name", {
        opacity: isOpen ? 1 : 0,
        duration: isOpen ? 0.3 : 0.1,
        delay: isOpen ? 0.1 : 0,
      });

      const title = navRef.current.querySelector(".sidenav-title");
      const split = new SplitText(title, { type: "chars" });

      if (isOpen) {
        gsap.set(title, { opacity: 1 });
        gsap.from(split.chars, {
          opacity: 0,
          x: -35,
          stagger: 0.1,
          duration: 0.4,
          delay: 0.2,
          ease: "power3.out",
        });
      } else {
        gsap.to(title, { opacity: 0, duration: 0.1 });
      }

      return () => {
        if (split.revert) {
          split.revert();
        }
      };
    },
    { scope: navRef, dependencies: [isOpen, isIntroAnimationComplete] }
  );

  useEffect(() => {
    subMenuRefs.current.forEach((subMenu, index) => {
      if (subMenu) {
        gsap.to(subMenu, {
          height: openSubMenu === index ? "auto" : 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    });
  }, [openSubMenu]);

  const handleSubMenuToggle = (idx) => {
    if (isOpen) {
      setOpenSubMenu(openSubMenu === idx ? null : idx);
    }
  };

  const handleMenuClick = () => {
    if (isIntroAnimationComplete) {
      authActions.toggleSideNav();
    }
  };

  return (
    <div
      ref={navRef}
      className={`fixed top-0 left-0 h-full z-50 overflow-hidden ${containerClassName}`}
    >
      <div
        className="absolute top-4 left-4 cursor-pointer"
        onClick={handleMenuClick}
      >
        <BurgerMorphIcon isOpen={isOpen} />
      </div>
      <div className="sidenav-title text-gray-700 dark:text-gray-200 font-semibold fixed top-4 left-35">
        Tiny Steps
        <span className="text-gray-700 dark:text-gray-200 flex items-center justify-center">
          CDC
        </span>
      </div>
      <div className="h-full flex flex-col pt-20">
        <div className="flex-grow p-4">
          {items.map((item, idx) => {
            // ✨ Determine if the current item is the active one
            const isActive = item.name === activeItem;

            return (
              <div key={idx} className="mb-2">
                <div
                  // ✨ Conditionally add the active styles
                  className={`flex items-center p-2 justify-start gap-4 rounded-lg cursor-pointer ${itemClassName} ${
                    isActive ? activeItemStyles : ""
                  }`}
                  // ✨ Update the click handler
                  onClick={() => {
                    onItemClick(item); // Pass the full item object (includes route)
                    if (item.subItems) {
                      handleSubMenuToggle(idx); // Also toggle submenu if it exists
                    }
                  }}
                >
                  <item.icon className={`${iconClassName} flex-shrink-0`} />
                  <span className="flex-grow nav-item-name whitespace-nowrap">
                    {item.name}
                  </span>
                  {item.subItems && (
                    <ChevronDown
                      className={`transition-transform duration-200 nav-item-name flex-shrink-0 ${
                        openSubMenu === idx ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
                <div
                  ref={(el) => (subMenuRefs.current[idx] = el)}
                  className="pl-8 mt-2 overflow-hidden"
                  style={{ height: 0 }}
                >
                  {item.subItems &&
                    item.subItems.map((subItem, subIdx) => (
                      <div
                        key={subIdx}
                        className={`p-2 rounded-lg cursor-pointer ${subItemClassName}`}
                      >
                        {subItem.name}
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
        {bottomContent && <div className="p-4">{bottomContent}</div>}
      </div>
    </div>
  );
};

export default SideNav;
