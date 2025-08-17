import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FlippableCard from "../../components/FlipableCard";
import CalendarView from "../../components/CalendarView";
import BookingPieChart from "../../components/BookingPieChart"; // Import the new chart
import {
  CheckCircle,
  XCircle,
  Baby,
  Stethoscope,
  BookMarked, // Added icon for bookings
} from "lucide-react";
import { authActions } from "../../store/authStore";

// GSAP Plugin for the pie chart animation
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
gsap.registerPlugin(DrawSVGPlugin);

function DashboardIndexPage() {
  const pageRef = useRef(null);

  // State for appointments
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
        patientName: "Bob Smith",
        time: "2:15 PM",
        status: "checked-in",
      },
      {
        id: 3,
        patientName: "Charlie Brown",
        time: "4:00 PM",
        status: "cancelled",
      },
    ],
  });

  // State for doctors
  const [doctors, setDoctors] = useState({
    totalCount: 3,
    availableCount: 1,
    list: [
      {
        id: 1,
        name: "Dr. Smith",
        status: "pending",
        slots: ["9:00 AM", "11:00 AM", "2:00 PM"],
      },
      { id: 2, name: "Dr. Jones", status: "checked-in", slots: ["10:00 AM"] },
      {
        id: 3,
        name: "Dr. Wilson",
        status: "cancelled",
        slots: ["1:00 PM", "3:00 PM"],
      },
    ],
  });

  // ✨ New state for booking statistics
  const [bookingStats, setBookingStats] = useState({
    total: 25,
    completed: 15,
    cancelled: 4,
    rescheduled: 6,
    byDoctor: 1,
    byPatient: 3,
    missedNoShow: 2,
    missedRescheduled: 4,
  });

  useGSAP(() => {
    if (!pageRef.current) return;
    if (!authActions.shouldAnimate()) {
      gsap.fromTo(
        pageRef.current,
        { scale: 0, opacity: 0, transformOrigin: "center center" },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    } else {
      gsap.set(pageRef.current, { scale: 1, opacity: 1 });
    }
  }, []);

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

  // ... (appointmentsFront, appointmentsBack, doctorsFront, doctorsBack definitions are unchanged)

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

  // ✨ Card front with Pie Chart
  const bookingsFront = (
    <div className="flex items-center justify-center md:justify-between gap-4 md:gap-8 w-full">
      <BookMarked size={64} className="md:size-20" />
      <BookingPieChart
        data={[
          {
            label: "Completed",
            value: bookingStats.completed,
            color: "#10B981",
          },
          {
            label: "Cancelled",
            value: bookingStats.cancelled,
            color: "#EF4444",
          },
          {
            label: "Rescheduled",
            value: bookingStats.rescheduled,
            color: "#F59E0B",
          },
        ]}
      />
    </div>
  );

  // ✨ Card back with tabular data
  const bookingsBack = (
    <div
      className="w-full h-full overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-2">
              Category
            </th>
            <th scope="col" className="px-4 py-2 text-right">
              Count
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-4 py-2 font-medium">Total Bookings</td>
            <td className="px-4 py-2 text-right">{bookingStats.total}</td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-4 py-2 font-medium">Cancelled by Doctor</td>
            <td className="px-4 py-2 text-right">{bookingStats.byDoctor}</td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-4 py-2 font-medium">Cancelled by Patient</td>
            <td className="px-4 py-2 text-right">{bookingStats.byPatient}</td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-4 py-2 font-medium">Missed (No Show)</td>
            <td className="px-4 py-2 text-right">
              {bookingStats.missedNoShow}
            </td>
          </tr>
          <tr className="bg-white dark:bg-gray-800 dark:border-gray-700">
            <td className="px-4 py-2 font-medium">Missed (Rescheduled)</td>
            <td className="px-4 py-2 text-right">
              {bookingStats.missedRescheduled}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div ref={pageRef} className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome to Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your account and explore features.
          </p>
        </div>
        {/* ✨ Updated grid to include the third card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FlippableCard
            frontContent={appointmentsFront}
            backContent={appointmentsBack}
          />
          <FlippableCard
            frontContent={doctorsFront}
            backContent={doctorsBack}
          />
          <FlippableCard
            frontContent={bookingsFront}
            backContent={bookingsBack}
          />
        </div>
        <CalendarView appointments={appointments} doctors={doctors} />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexPage,
});
