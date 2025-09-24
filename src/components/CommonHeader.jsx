import { Link, useLocation } from "@tanstack/react-router";
import logo from "../assets/logo.webp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState } from "react";
import useAuthStore from "../store/useAuthStore";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Helper function to determine if a path is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Glassmorphic button classes for active state
  const getNavLinkClasses = (path) => {
    const baseClasses =
      "header-element px-4 py-2 rounded-xl transition-all duration-300 ease-out";
    const activeClasses =
      "bg-white/20 backdrop-blur-sm shadow-lg border border-white/30 text-white transform scale-105";
    const inactiveClasses =
      "hover:bg-white/10 hover:backdrop-blur-sm hover:text-gray-200 hover:shadow-md";

    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };
  useGSAP(() => {
    const tl = gsap.timeline();

    // First: Logo appears
    tl.fromTo(
      ".logo",
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 1.5 }
    );
    // Then: Both headers animate together (simultaneously)
    tl.fromTo(".left-header", { width: 0 }, { width: "100%", duration: 1.5 });
    tl.fromTo(
      ".right-header",
      { width: 0 },
      { width: "100%", duration: 1.5 },
      "<" // This "<" makes it start at the same time as the previous animation
    ).fromTo(
      ".header-element",
      {
        yPercent: -200,
      },
      {
        yPercent: 0,
        stagger: 0.2,
        duration: 0.5,
        ease: "bounce(1, 0.3)",
      }
    );
  });

  useGSAP(() => {
    // Scale on hover for header elements
    const headerElements = document.querySelectorAll(".header-element");

    headerElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        gsap.to(element, {
          scale: 1.1,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      element.addEventListener("mouseleave", () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      });
    });
  });

  // Hide header for admin routes (after all hooks have been called)
  if (location.pathname.startsWith("/dashboard")) {
    return null;
  }
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl shadow-2xl">
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex space-x-6 items-center justify-evenly">
        <div
          className="left-header flex space-x-10 h-20 w-full items-center justify-center text-white"
          style={{
            background: "linear-gradient(90deg, #d30398 0%, #8b1f7d 100%)",
          }}
        >
          <Link to="/" className={getNavLinkClasses("/")}>
            Home
          </Link>
          <Link to="/about" className={getNavLinkClasses("/about")}>
            About
          </Link>
          <Link to="/services" className={getNavLinkClasses("/services")}>
            Services
          </Link>
        </div>
        <div className="mx-auto absolute pt-15 left-1/2 transform -translate-x-1/2 bg-white flex items-center rounded-full flex-col">
          <img
            className="mx-20 logo"
            src={logo}
            alt=""
            style={{ maxWidth: "100px", height: "auto" }}
          />
          <h3
            className="text-lg font-semibold logo"
            style={{
              color: "#d30398",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "1px",
              textAlign: "center",
            }}
          >
            Child Development <br />
            Center
          </h3>
        </div>

        <div
          className="right-header ml-auto flex items-center justify-center space-x-10 h-20 w-full text-white"
          style={{
            background: "linear-gradient(90deg, #8b1f7d 0%, #d30398 100%)",
          }}
        >
          <a
            href="https://wa.me/919886062430"
            target="_blank"
            rel="noopener noreferrer"
            className="header-element px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:bg-white/10 hover:backdrop-blur-sm hover:text-gray-200 hover:shadow-md"
          >
            Book Appointment
          </a>
          <Link to="/contact" className={getNavLinkClasses("/contact")}>
            Contact
          </Link>
          {isAuthenticated ? (
            <Link to="/dashboard" className={getNavLinkClasses("/dashboard")}>
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className={getNavLinkClasses("/login")}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav
        className="lg:hidden flex items-center justify-between h-16 px-4"
        style={{
          background: "linear-gradient(90deg, #d30398 0%, #8b1f7d 100%)",
        }}
      >
        {/* Hamburger Menu */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Logo */}
        <div className="mx-auto absolute pt-15 left-1/2 transform -translate-x-1/2 bg-white flex items-center rounded-full flex-col">
          <img
            className="mx-20 logo"
            src={logo}
            alt=""
            style={{ maxWidth: "100px", height: "auto" }}
          />
          <h3
            className="text-lg font-semibold logo"
            style={{
              color: "#d30398",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "1px",
              textAlign: "center",
            }}
          >
            Child Development <br />
            Center
          </h3>
        </div>
        {/* Login Button */}
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className={`text-sm ${
              isActive("/dashboard")
                ? "bg-white/20 backdrop-blur-sm shadow-lg border border-white/30 text-white px-3 py-2 rounded-lg transform scale-105"
                : "text-white hover:text-gray-200 hover:bg-white/10 hover:backdrop-blur-sm px-3 py-2 rounded-lg"
            } transition-all duration-300`}
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className={`text-sm ${
              isActive("/login")
                ? "bg-white/20 backdrop-blur-sm shadow-lg border border-white/30 text-white px-3 py-2 rounded-lg transform scale-105"
                : "text-white hover:text-gray-200 hover:bg-white/10 hover:backdrop-blur-sm px-3 py-2 rounded-lg"
            } transition-all duration-300`}
          >
            Login
          </Link>
        )}
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg border-t">
          <div className="px-4 py-2 space-y-2">
            <Link
              to="/"
              className="block py-2 text-gray-800 hover:text-pink-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 text-gray-800 hover:text-pink-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/services"
              className="block py-2 text-gray-800 hover:text-pink-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-gray-800 hover:text-pink-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <a
              href="https://wa.me/919886062430"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-gray-800 hover:text-pink-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Appointment
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
