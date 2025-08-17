import { createFileRoute, redirect } from "@tanstack/react-router";
import { authActions, authStore } from "../store/authStore";
import Navigation from "../components/Navigation";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SideNav from "../components/SideNav";
import {
  Settings,
  User,
  LogOut,
  Stethoscope,
  Baby,
  Clock,
  BookOpen,
  Calendar,
  ClipboardPlus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../service/authService";
import { useNavigate } from "@tanstack/react-router";
import FlippableCard from "../components/FlipableCard";
import CalendarView from "../components/CalendarView";

function DashboardPage() {
  const dashboardRef = useRef(null);
  const timeline = authStore.state.timeline;
  const navigate = useNavigate();
  const [isSideNavOpen, setIsSideNavOpen] = useState(
    authStore.state.isSideNavOpen
  );

  const [appointments, setAppointments] = useState({
    total: 4,
    completed: 1,
    upcoming: [
      {
        id: 1,
        patientName: "Alice Johnson",
        time: "10:30 AM",
        status: "pending",
      },
      {
        id: 2,
        patientName: "Bob Williams",
        time: "11:15 AM",
        status: "pending",
      },
      {
        id: 3,
        patientName: "Charlie Brown",
        time: "02:00 PM",
        status: "pending",
      },
    ],
  });

  const [doctors, setDoctors] = useState({
    availableCount: 3,
    list: [
      {
        id: 1,
        name: "Dr. Smith",
        slots: ["9:00 AM", "1:00 PM", "3:30 PM"],
        status: "pending",
      },
      {
        id: 2,
        name: "Dr. Jones",
        slots: ["10:00 AM", "11:00 AM", "4:00 PM"],
        status: "pending",
      },
      { id: 3, name: "Dr. Who", slots: ["10:00 AM"], status: "pending" },
      {
        id: 4,
        name: "Dr. Strange",
        slots: ["12:00 PM", "1:00 PM"],
        status: "pending",
      },
    ],
  });

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setIsSideNavOpen(authStore.state.isSideNavOpen);
    });
    return unsubscribe;
  }, []);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      authActions.logout();
      navigate({ to: "/" });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      authActions.logout();
      navigate({ to: "/" });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  useGSAP(
    () => {
      if (!dashboardRef.current) return;
      if (authActions.shouldAnimate()) {
        gsap.set(dashboardRef.current, { scale: 0, opacity: 0 });
        timeline.to(
          dashboardRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            transformOrigin: "center center",
          },
          "-=0.4"
        );
      } else {
        gsap.set(dashboardRef.current, { scale: 1, opacity: 1 });
      }
    },
    { scope: dashboardRef }
  );

  const navItems = [
    { name: "Doctor", icon: Stethoscope, subItems: null },
    { name: "Patient", icon: Baby, subItems: null },
    { name: "Timing", icon: Clock, subItems: null },
    { name: "Session", icon: BookOpen, subItems: null },
    { name: "Schedule", icon: Calendar, subItems: null },
    { name: "Report", icon: ClipboardPlus, subItems: null },
    {
      name: "Settings",
      icon: Settings,
      subItems: [
        { name: "Profile", icon: User },
        { name: "Account", icon: User },
      ],
    },
  ];

  const bottomContent = (
    <button
      className={`flex item-center justify-center gap-4 mb-10 ml-3`}
      onClick={handleLogout}
    >
      <LogOut />
      <span className="nav-item-name">Logout</span>
    </button>
  );

  const getStatusColor = (status) => {
    if (status === "checked-in") return "text-green-500";
    if (status === "cancelled") return "text-red-500";
    return "text-gray-400";
  };

  const handleAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) => {
      const upcoming = prev.upcoming.map((appt) =>
        appt.id === id
          ? {
              ...appt,
              status: appt.status === newStatus ? "pending" : newStatus,
            }
          : appt
      );
      const checkedInCount = upcoming.filter(
        (a) => a.status === "checked-in"
      ).length;
      return { ...prev, completed: 1 + checkedInCount, upcoming: upcoming };
    });
  };

  const handleDoctorStatus = (id, newStatus) => {
    setDoctors((prev) => {
      const list = prev.list.map((doc) =>
        doc.id === id
          ? { ...doc, status: doc.status === newStatus ? "pending" : newStatus }
          : doc
      );
      const availableCount = list.filter(
        (d) => d.status === "checked-in"
      ).length;
      return { ...prev, availableCount: availableCount, list: list };
    });
  };

  const handleSlotSelection = (doctorName, time) => {
    if (time) console.log(`Time slot selected for ${doctorName}: ${time}`);
  };

  const appointmentsFront = (
    <div className="flex items-center justify-center md:justify-between gap-4 md:gap-8 w-full">
      <Baby size={64} className="md:size-20" />
      <div className="hidden md:flex flex-col gap-6 text-right">
        <div className="text-2xl">
          Today's <br /> Appointments
        </div>
        <p className="text-4xl font-bold">{`${appointments.completed}/${appointments.total}`}</p>
      </div>
      <p className="md:hidden text-4xl font-bold">{`${appointments.completed}/${appointments.total}`}</p>
    </div>
  );

  const appointmentsBack = (
    <div
      className="w-full h-full overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-2">
              Patient
            </th>
            <th scope="col" className="px-4 py-2">
              Time
            </th>
            <th scope="col" className="px-4 py-2 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.upcoming.map((appt) => (
            <tr
              key={appt.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-4 py-2 font-medium">{appt.patientName}</td>
              <td className="px-4 py-2">{appt.time}</td>
              <td className="px-4 py-2 flex justify-center items-center gap-2">
                <CheckCircle
                  onClick={() => handleAppointmentStatus(appt.id, "checked-in")}
                  className={`cursor-pointer hover:text-green-500 ${getStatusColor(appt.status) === "text-green-500" ? "text-green-500" : "text-gray-400"}`}
                />
                <XCircle
                  onClick={() => handleAppointmentStatus(appt.id, "cancelled")}
                  className={`cursor-pointer hover:text-red-500 ${getStatusColor(appt.status) === "text-red-500" ? "text-red-500" : "text-gray-400"}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const doctorsFront = (
    <div className="flex items-center justify-center md:justify-between gap-4 md:gap-8 w-full">
      <Stethoscope size={64} className="md:size-20" />
      <div className="hidden md:flex flex-col gap-6 text-right">
        <div className="text-2xl">
          Doctors <br /> Available
        </div>
        <p className="text-4xl font-bold">{`${doctors.availableCount}/${doctors.list.length}`}</p>
      </div>
      <p className="md:hidden text-4xl font-bold">{`${doctors.availableCount}/${doctors.list.length}`}</p>
    </div>
  );

  const doctorsBack = (
    <div
      className="w-full h-full overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-2">
              Doctor
            </th>
            <th scope="col" className="px-4 py-2">
              Slots
            </th>
            <th scope="col" className="px-4 py-2 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {doctors.list.map((doc) => (
            <tr
              key={doc.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-4 py-2 font-medium">{doc.name}</td>
              <td className="px-4 py-2">
                {doc.slots.length > 1 ? (
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleSlotSelection(doc.name, e.target.value)
                    }
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select time
                    </option>
                    {doc.slots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{doc.slots[0] || "N/A"}</span>
                )}
              </td>
              <td className="px-4 py-2 flex justify-center items-center gap-2">
                <CheckCircle
                  onClick={() => handleDoctorStatus(doc.id, "checked-in")}
                  className={`cursor-pointer hover:text-green-500 ${getStatusColor(doc.status) === "text-green-500" ? "text-green-500" : "text-gray-400"}`}
                />
                <XCircle
                  onClick={() => handleDoctorStatus(doc.id, "cancelled")}
                  className={`cursor-pointer hover:text-red-500 ${getStatusColor(doc.status) === "text-red-500" ? "text-red-500" : "text-gray-400"}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="h-full w-full bg-gray-50 md:mx-10 md:p-10 px-20 ">
      <Navigation />
      <SideNav
        items={navItems}
        bottomContent={bottomContent}
        containerClassName="bg-white dark:bg-gray-900/80 text-gray-700 dark:text-gray-200"
        itemClassName="hover:bg-gray-200 dark:hover:bg-gray-700"
        iconClassName="text-gray-500 dark:text-gray-400"
        subItemClassName="hover:bg-gray-200 dark:hover:bg-gray-700"
      />
      <div className="pt-24 px-4 md:px-6 md:mx-20" ref={dashboardRef}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome to Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your account and explore features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FlippableCard
              frontContent={appointmentsFront}
              backContent={appointmentsBack}
            />
            <FlippableCard
              frontContent={doctorsFront}
              backContent={doctorsBack}
            />
          </div>
          <CalendarView appointments={appointments} doctors={doctors} />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => {
    if (!authStore.state.isAuthenticated) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
  },
  component: DashboardPage,
});
