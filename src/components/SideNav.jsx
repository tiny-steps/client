import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import BurgerMorphIcon from "./BurgerMorphIcon";
import { authActions, authStore } from "../store/authStore";

const SideNav = ({
  items,
  bottomContent,
  containerClassName = "",
  itemClassName = "",
  iconClassName = "",
  subItemClassName = "",
  isDashboardAnimated,
}) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(authStore.state.isSideNavOpen);
  const [isSideNavAnimated, setIsSideNavAnimated] = useState(false);
  const navRef = useRef(null);
  const subMenuRefs = useRef([]);
  const timeline = authStore.state.timeline;

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setIsOpen(authStore.state.isSideNavOpen);
    });
    return unsubscribe;
  }, []);

  useGSAP(
    () => {
      if (authActions.shouldAnimate()) {
        if (isDashboardAnimated) {
          gsap.set(navRef.current, { x: "-100%" });
          timeline.to(navRef.current, {
            x: "0%",
            duration: 0.8,
            ease: "power3.out",
            onComplete: () => {
              setIsSideNavAnimated(true);
            },
          });
        }
      } else {
        gsap.set(navRef.current, { x: "0%" });
        setIsSideNavAnimated(true);
      }
    },
    { scope: navRef, dependencies: [isDashboardAnimated] }
  );

  useGSAP(
    () => {
      if (!isSideNavAnimated) return;
      gsap.to(navRef.current, {
        width: isOpen ? 256 : 80,
        duration: 0.3,
        ease: "power2.inOut",
      });

      gsap.to(".nav-item-name", {
        opacity: isOpen ? 1 : 0,
        duration: 0.3,
        display: isOpen ? "block" : "none",
      });
    },
    { scope: navRef, dependencies: [isOpen, isSideNavAnimated] }
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
    setOpenSubMenu(openSubMenu === idx ? null : idx);
  };

  const handleMenuClick = () => {
    if (isSideNavAnimated) {
      authActions.toggleSideNav();
    }
  };

  return (
    <div
      ref={navRef}
      className={`fixed top-0 left-0 h-full z-50 ${containerClassName}`}
    >
      <div
        className="absolute top-4 left-4 cursor-pointer"
        onClick={handleMenuClick}
      >
        <BurgerMorphIcon isOpen={isOpen} />
      </div>
      <div className="h-full flex flex-col pt-20">
        <div className="flex-grow p-4">
          {items.map((item, idx) => (
            <div key={idx} className="mb-2">
              <div
                className={`flex items-center p-2 justify-center gap-4 rounded-lg cursor-pointer ${itemClassName}`}
                onClick={() => item.subItems && handleSubMenuToggle(idx)}
              >
                <item.icon className={`${iconClassName}`} />
                <span className="flex-grow nav-item-name">{item.name}</span>
                {item.subItems && (
                  <ChevronDown
                    className={`transition-transform duration-200 nav-item-name ${
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
          ))}
        </div>
        {bottomContent && (
          <div className="p-4 nav-item-name">{bottomContent}</div>
        )}
      </div>
    </div>
  );
};

export default SideNav;
