import { useState } from 'react';

export const useDashboardData = () => {
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

    return {
        appointments,
        doctors,
        bookingStats,
        handleAppointmentStatus,
        handleDoctorStatus,
        handleSlotSelection,
    };
};
