import {
  LayoutDashboardIcon,
  Stethoscope,
  Baby,
  Clock,
  BookOpen,
  Calendar,
  ClipboardPlus,
  UserCircle,
  LogOut,
  Award,
  GraduationCap,
  Heart,
  Users,
  Building,
  FileText,
  Camera,
  MapPin,
  Star,
  Settings,
  Pill,
  Phone,
  Shield,
  Home,
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
    subItems: [
      { name: "All Doctors", route: "/doctors", icon: Stethoscope },
      { name: "Awards", route: "/doctors/awards", icon: Award },
      {
        name: "Qualifications",
        route: "/doctors/qualifications",
        icon: GraduationCap,
      },
      {
        name: "Specializations",
        route: "/doctors/specializations",
        icon: Heart,
      },
      { name: "Memberships", route: "/doctors/memberships", icon: Users },
      {
        name: "Organizations",
        route: "/doctors/organizations",
        icon: Building,
      },
      {
        name: "Registrations",
        route: "/doctors/registrations",
        icon: FileText,
      },
      { name: "Photos", route: "/doctors/photos", icon: Camera },
      { name: "Practices", route: "/doctors/practices", icon: MapPin },
      {
        name: "Recommendations",
        route: "/doctors/recommendations",
        icon: Star,
      },
    ],
    description: "Manage Doctors with ease",
  },
  {
    name: "Patient",
    route: "/patients",
    icon: Baby,
    subItems: [
      { name: "All Patients", route: "/patients", icon: Baby },
      { name: "Allergies", route: "/patients/allergies", icon: Heart },
      // { name: "Medications", route: "/patients/medications", icon: Pill },
      // {
      //   name: "Emergency Contacts",
      //   route: "/patients/emergency-contacts",
      //   icon: Phone,
      // },
      //{
      // name: "Medical History",
      // route: "/patients/medical-history",
      // icon: FileText,
      //},
      //{ name: "Appointments", route: "/patients/appointments", icon: Calendar },
      //{ name: "Insurance", route: "/patients/insurance", icon: Shield },
      //{ name: "Addresses", route: "/patients/addresses", icon: MapPin },
    ],
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
    route: "/sessions",
    icon: BookOpen,
    subItems: [
      { name: "All Sessions", route: "/sessions", icon: BookOpen },
      { name: "Session Types", route: "/sessions/types", icon: Settings },
    ],
    description: "Unified Session & Session Type Management",
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
    route: "/reports",
    icon: ClipboardPlus,
    subItems: null,
    description: "Generate Reports in a Click",
  },
];

export const createBottomItems = (email, onLogout, onProfileClick) => [
  {
    name: "Profile",
    icon: UserCircle,
    onClick: onProfileClick,
    subtitle: email,
  },
  {
    name: "Logout",
    icon: LogOut,
    onClick: onLogout,
  },
];

export const createTopItems = (onHomeClick) => [
  {
    name: "Home",
    icon: Home,
    onClick: onHomeClick,
  },
];
