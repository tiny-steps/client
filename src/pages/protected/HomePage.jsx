import React, { useRef, useState } from "react";
import useUserStore from "../../store/useUserStore.js";
import { useAuth } from "@/hooks/useAuthQuery.js";
import Header from "@/components/Header.jsx";
import SideNav from "@/components/SideNav.jsx";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CalendarView from "@/components/CalendarView.jsx";
import DashboardCards from "@/components/dashboard/DashboardCards.jsx";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import { navItems, createBottomItems } from "@/config/navigation.js";
import { useDashboardData } from "@/hooks/useDashboardData.js";

function HomePage() {
 const pageRef = useRef(null);
 const { logoutMutation, isLogoutPending } = useAuth();
 const [isNavOpen, setIsNavOpen] = useState(false);
 const [activeItem, setActiveItem] = useState(navItems[0]);
 const { data: user, isLoading, isError, error } = useUserProfile();
 const email = useUserStore((state) => state.email);

 // Use the custom hook for dashboard data management
 const {
 appointments,
 doctors,
 bookingStats,
 handleAppointmentStatus,
 handleDoctorStatus,
 handleSlotSelection,
 } = useDashboardData();

 const handleLogout = () => {
 logoutMutation();
 };

 // Create bottom items with current email and logout handler
 const bottomItems = createBottomItems(email, handleLogout);

 // When nav item clicked: mark active
 const handleNavItemClick = (item) => {
 setActiveItem(item);
 setIsNavOpen(false);
 };

 useGSAP(() => {
 if (!pageRef.current) return;
 gsap.fromTo(
 pageRef.current,
 { scale: 0, opacity: 0, transformOrigin: "center center" },
 { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }
 );
 }, []);

 return (
 <div className="min-h-screen bg-gray-50">
 <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
 <SideNav
 isOpen={isNavOpen}
 setIsOpen={setIsNavOpen}
 items={navItems}
 activeItem={activeItem}
 onItemClick={handleNavItemClick}
 bottomContent={bottomItems}
 />

 {/* Main content area with dynamic left margin */}
 <main className="transition-all duration-400 ease-in-out pt-16 h-screen w-screen">
 <DashboardHeader
 userName={user?.data.name}
 activeItemDescription={activeItem.description}
 />

 <DashboardCards
 appointments={appointments}
 doctors={doctors}
 bookingStats={bookingStats}
 onAppointmentStatusChange={handleAppointmentStatus}
 onDoctorStatusChange={handleDoctorStatus}
 onSlotSelection={handleSlotSelection}
 />

 <div className="mx-20 pl-10">
 <CalendarView appointments={appointments} doctors={doctors} />
 </div>
 </main>
 </div>
 );
}

export default HomePage;
