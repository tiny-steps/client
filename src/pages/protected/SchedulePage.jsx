import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import CalendarView from "@/components/CalendarView.jsx";
import DayDetailView from "./DayDetailView.jsx";
import EnhancedAppointmentModal from "@/components/EnhancedAppointmentModal.jsx";
import { useGetAllEnrichedDoctors } from "@/hooks/useEnrichedDoctorQueries.js";
import { useGetAllEnrichedPatients } from "@/hooks/useEnrichedPatientQueries.js";
import {
  useGetAllAppointments,
  useCreateAppointment,
} from "@/hooks/useScheduleQueries.js";
import {
  useGetDoctorAvailability,
  useGetTimeSlots,
} from "@/hooks/useTimingQueries.js";
import { useGetAllSessions } from "@/hooks/useSessionQueries.js";

const SchedulePage = () => {
  const { activeItem } = useOutletContext();
  const { data: user } = useUserProfile();

  // Helper function to format date as YYYY-MM-DD using local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showDayDetail, setShowDayDetail] = useState(false);

  const { data: doctorsData } = useGetAllEnrichedDoctors({ size: 100 });
  const { data: patientsData } = useGetAllEnrichedPatients({ size: 100 });
  const { data: appointmentsData } = useGetAllAppointments({ size: 100 });
  const { data: timeSlotsData } = useGetTimeSlots(
    selectedDoctor,
    selectedDate,
    null, // practiceId
    { enabled: !!selectedDoctor }
  );
  const createAppointmentMutation = useCreateAppointment();
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useGetAllSessions({
    isActive: true,
    size: 100,
  });

  const doctors = doctorsData?.data?.content || [];
  const patients = patientsData?.data?.content || [];
  const appointments = appointmentsData?.data?.content || [];
  const timeSlots = timeSlotsData?.data?.slots || [];

  // Set the first doctor as default when doctors data is loaded
  useEffect(() => {
    if (doctors.length > 0 && !selectedDoctor) {
      const firstDoctor = doctors[0];
      setSelectedDoctor(firstDoctor.id);
    }
  }, [doctors, selectedDoctor]);

  // Filter sessions by selected doctor on the frontend
  const allSessions = sessionsData?.content || [];

  // Filter out cancelled appointments and enrich with patient, doctor, and session information
  const activeAppointments = appointments.filter(
    (appointment) => appointment.status?.toUpperCase() !== "CANCELLED"
  );

  const enrichedAppointments = activeAppointments.map((appointment) => {
    const patient = patients.find((p) => p.id === appointment.patientId);
    const doctor = doctors.find((d) => d.id === appointment.doctorId);
    const session = allSessions.find(
      (s) => s.sessionType?.id === appointment.sessionTypeId
    );

    return {
      ...appointment,
      patientName: patient
        ? `${patient.firstName} ${patient.lastName}`
        : "Unknown Patient",
      doctorName: doctor
        ? `${doctor.firstName} ${doctor.lastName}`
        : "Unknown Doctor",
      sessionName: session?.sessionType?.name || "Unknown Session",
      displayText: `${
        patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"
      } - ${
        doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown Doctor"
      } - ${session?.sessionType?.name || "Unknown Session"}`,
    };
  });
  const sessions = selectedDoctor
    ? allSessions.filter((session) => session.doctorId === selectedDoctor)
    : [];

  // Debug logging
  console.log("Selected Doctor ID:", selectedDoctor);
  console.log("All Sessions:", allSessions);
  console.log(
    "Session doctorIds:",
    allSessions.map((s) => ({
      id: s.id,
      doctorId: s.doctorId,
      sessionType: s.sessionType?.name,
    }))
  );
  console.log(
    "Available Doctor IDs:",
    allSessions.map((s) => s.doctorId)
  );
  console.log("Filtered Sessions:", sessions);

  // Check if selected doctor has any sessions
  const doctorSessions = allSessions.filter(
    (s) => s.doctorId === selectedDoctor
  );
  console.log("Sessions for selected doctor:", doctorSessions);

  // Get available time slots from the API
  const availableTimeSlots = timeSlots
    .filter((slot) => slot.status === "available")
    .map((slot) => slot.startTime.substring(0, 5))
    .sort();

  const handleTimeSlotClick = (time) => {
    setSelectedTimeSlot(time);
    setShowAppointmentModal(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowAppointmentModal(true);
  };

  const handleAppointmentSubmit = async (data) => {
    try {
      console.log("Creating appointment:", data);

      // Find the selected session to get sessionTypeId and duration
      const selectedSession = sessions.find((s) => s.id === data.sessionId);
      if (!selectedSession) {
        throw new Error("Selected session not found");
      }

      console.log("Selected session:", selectedSession);

      // Prepare appointment data
      const appointmentData = {
        patientId: data.patientId,
        doctorId: data.doctorId,
        sessionTypeId: selectedSession.sessionType?.id, // Get the actual sessionTypeId
        appointmentDate: data.appointmentDate,
        startTime: data.startTime,
        consultationType: data.consultationType || "IN_PERSON",
        notes: data.notes || "",
        status: "SCHEDULED",
        sessionDurationMinutes:
          selectedSession.sessionType?.defaultDurationMinutes, // Send duration for backend calculation
      };

      // Make API call to create appointment
      await createAppointmentMutation.mutateAsync(appointmentData);

      console.log("Appointment created successfully!");
      setShowAppointmentModal(false);
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error("Failed to create appointment:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <DashboardHeader
        userName={user?.data.name}
        activeItemDescription={activeItem.description}
      />

      <div className="px-4 sm:px-6">
        {showDayDetail ? (
          <DayDetailView
            selectedDate={selectedDate}
            selectedDoctor={selectedDoctor}
            onBack={() => setShowDayDetail(false)}
            onDateChange={setSelectedDate}
          />
        ) : (
          <CalendarView
            appointments={enrichedAppointments}
            timeSlots={timeSlots}
            availableTimeSlots={availableTimeSlots}
            selectedDoctor={selectedDoctor}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onDoctorChange={setSelectedDoctor}
            doctors={doctors}
            patients={patients}
            onTimeSlotClick={handleTimeSlotClick}
            onDateClick={handleDateClick}
            showAppointmentModal={showAppointmentModal}
            setShowAppointmentModal={setShowAppointmentModal}
            selectedTimeSlot={selectedTimeSlot}
            setSelectedTimeSlot={setSelectedTimeSlot}
            onAppointmentClick={(appointment) => {
              console.log("Appointment clicked:", appointment);
              // TODO: Open appointment details modal
            }}
            onDayDetailClick={(date) => {
              console.log(
                "SchedulePage: DayDetailView requested for date:",
                date
              );
              setSelectedDate(date);
              setShowDayDetail(true);
            }}
          />
        )}

        {/* No Sessions Warning */}
        {selectedDoctor && sessions.length === 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  No Sessions Available for Selected Doctor
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    The selected doctor doesn't have any sessions created yet.
                    You cannot create appointments without sessions.
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={() => window.open("/sessions", "_blank")}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Create Sessions
                    </button>
                    <button
                      onClick={() => setSelectedDoctor("")}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Select Different Doctor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Appointment Creation Modal */}
      <EnhancedAppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setSelectedTimeSlot(null);
        }}
        onSubmit={handleAppointmentSubmit}
        selectedDoctor={selectedDoctor}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        patients={patients}
        doctors={doctors}
        sessions={sessions}
        appointments={appointments}
        isLoading={createAppointmentMutation.isPending}
      />
    </>
  );
};

export default SchedulePage;
