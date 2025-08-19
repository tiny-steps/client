import {
    LayoutDashboardIcon,
    Stethoscope,
    Baby,
    Clock,
    BookOpen,
    Calendar,
    ClipboardPlus,
    UserCircle,
    LogOut
} from "lucide-react";

export const navItems = [
    {
        name: "Dashboard",
        route: "/dashboard",
        icon: LayoutDashboardIcon,
        subItems: null,
        description: "Welcome to Admin Dashboard",
    },
    {
        name: "Doctor",
        route: "/doctors",
        icon: Stethoscope,
        subItems: null,
        description: "Manage Doctors with ease",
    },
    {
        name: "Patient",
        route: "/patients",
        icon: Baby,
        subItems: null,
        description: "Patient Management is a breeze",
    },
    {
        name: "Timing",
        route: "/timing",
        icon: Clock,
        subItems: null,
        description: "Effortless Timing Management",
    },
    {
        name: "Session",
        route: "/session",
        icon: BookOpen,
        subItems: null,
        description: "Effortless Session Management",
    },
    {
        name: "Schedule",
        route: "/schedule",
        icon: Calendar,
        subItems: null,
        description: "Appointment Scheduling Made Easy",
    },
    {
        name: "Report",
        route: "/report",
        icon: ClipboardPlus,
        subItems: null,
        description: "Generate Reports in a Click",
    },
];

export const createBottomItems = (email, onLogout, onProfileClick) => [
    {
        name: 'Profile',
        icon: UserCircle,
        onClick: onProfileClick,
        subtitle: email
    },
    {
        name: 'Logout',
        icon: LogOut,
        onClick: onLogout
    }
];
