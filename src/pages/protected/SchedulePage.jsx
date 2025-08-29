import React, { useState } from "react";
import { useOutletContext } from "react-router";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import CalendarView from "@/components/CalendarView.jsx";
import DayDetailView from "./DayDetailView.jsx";
import { useGetAllEnrichedDoctors } from "@/hooks/useEnrichedDoctorQueries.js";
import { useGetAllEnrichedPatients } from "@/hooks/useEnrichedPatientQueries.js";
import {
 useGetAllAppointments,
 useCreateAppointment,
} from "@/hooks/useScheduleQueries.js";
import { useGetDoctorAvailability } from "@/hooks/useTimingQueries.js";
import { useGetAllSessions } from "@/hooks/useSessionQueries.js";
import {
 Card,
 CardHeader,
 CardTitle,
 CardContent,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const appointmentSchema = z.object({
 patientId: z.string().min(1, "Patient is required"),
 doctorId: z.string().min(1, "Doctor is required"),
 appointmentDate: z.string().min(1, "Date is required"),
 startTime: z.string().min(1, "Time is required"),
 sessionId: z.string().min(1, "Session is required"),
 consultationType: z.string().default("IN_PERSON"),
 notes: z.string().optional(),
});

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

 const form = useForm({
 resolver: zodResolver(appointmentSchema),
 defaultValues: {
 patientId: "",
 doctorId: selectedDoctor,
 appointmentDate: selectedDate,
 startTime: "",
 sessionId: "",
 consultationType: "IN_PERSON",
 notes: "",
 },
 });

 const { data: doctorsData } = useGetAllEnrichedDoctors({ size: 100 });
 const { data: patientsData } = useGetAllEnrichedPatients({ size: 100 });
 const { data: appointmentsData } = useGetAllAppointments({ size: 100 });
 const { data: availabilityData } = useGetDoctorAvailability(
 selectedDoctor,
 { date: selectedDate },
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
 const availabilities = availabilityData || [];

 // Filter sessions by selected doctor on the frontend
 const allSessions = sessionsData?.content || [];

 // Enrich appointments with patient, doctor, and session information
 const enrichedAppointments = appointments.map((appointment) => {
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

 // Filter availabilities by the selected date's day of week
 const selectedDateObj = new Date(selectedDate);
 const dayOfWeek = selectedDateObj.getDay();
 const backendDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
 const filteredAvailabilities = availabilities.filter((availability) => {
 return availability.dayOfWeek === backendDayOfWeek && availability.active;
 });

 // Helper function to generate available time slots for the selected date
 const generateAvailableTimeSlots = () => {
 if (!selectedDoctor || !availabilities.length) return [];

 // Recalculate filtered availabilities based on current selectedDate
 const selectedDateObj = new Date(selectedDate);
 const dayOfWeek = selectedDateObj.getDay();
 const backendDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
 const dayAvailabilities = availabilities.filter((availability) => {
 return availability.dayOfWeek === backendDayOfWeek && availability.active;
 });

 const availableSlots = new Set();
 dayAvailabilities.forEach((availability) => {
 if (availability.durations) {
 availability.durations.forEach((duration) => {
 if (duration.startTime && duration.endTime) {
 const start = new Date(`2000-01-01T${duration.startTime}`);
 let end = new Date(`2000-01-01T${duration.endTime}`);

 // Handle case where end time is earlier than start time (crosses midnight)
 if (end < start) {
 const endHour = parseInt(duration.endTime.split(":")[0]);
 if (
 endHour < 12 &&
 endHour < parseInt(duration.startTime.split(":")[0])
 ) {
 // This looks like it should be PM, not AM
 const correctedEndTime = duration.endTime.replace(
 /^(\d{1,2}):/,
 (match, hour) => {
 const correctedHour = parseInt(hour) + 12;
 return `${correctedHour.toString().padStart(2, "0")}:`;
 }
 );
 end = new Date(`2000-01-01T${correctedEndTime}`);
 } else {
 end.setDate(end.getDate() + 1);
 }
 }

 while (start < end) {
 availableSlots.add(start.toTimeString().slice(0, 5));
 start.setMinutes(start.getMinutes() + 30);
 }
 }
 });
 }
 });
 const timeSlots = Array.from(availableSlots).sort();
 return timeSlots;
 };

 const handleTimeSlotClick = (time) => {
 setSelectedTimeSlot(time);
 form.setValue("startTime", time);
 form.setValue("doctorId", selectedDoctor);
 form.setValue("appointmentDate", selectedDate);
 setShowAppointmentModal(true);
 };

 const handleDateClick = (date) => {
 setSelectedDate(date);
 form.setValue("appointmentDate", date);
 form.setValue("doctorId", selectedDoctor);
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
 form.reset({
 patientId: "",
 doctorId: selectedDoctor,
 appointmentDate: selectedDate,
 startTime: "",
 sessionId: "",
 consultationType: "IN_PERSON",
 notes: "",
 });
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

 <div className="mx-20 pl-10">
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
 availabilities={availabilities}
 filteredAvailabilities={filteredAvailabilities}
 selectedDoctor={selectedDoctor}
 selectedDate={selectedDate}
 onDateChange={setSelectedDate}
 onDoctorChange={setSelectedDoctor}
 doctors={doctors}
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
 onCancelAppointment={(appointment) => {
 if (
 window.confirm(
 `Cancel appointment for ${appointment.patientName}?`
 )
 ) {
 console.log("Cancelling appointment:", appointment);
 // TODO: Call cancel appointment API
 }
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

 {/* Appointment Creation Modal */}
 {showAppointmentModal && (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
 <Card className="w-full max-w-md mx-4">
 <CardHeader>
 <CardTitle>Create New Appointment</CardTitle>
 </CardHeader>
 <CardContent>
 <Form {...form}>
 <form
 onSubmit={form.handleSubmit(handleAppointmentSubmit)}
 className="space-y-4"
 >
 <FormField
 control={form.control}
 name="patientId"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Patient *</FormLabel>
 <FormControl>
 <select
 {...field}
 className="w-full px-3 py-2 border rounded-md"
 >
 <option value="">Select a patient...</option>
 {patients.map((patient) => (
 <option key={patient.id} value={patient.id}>
 {patient.firstName} {patient.lastName} -{" "}
 {patient.email}
 </option>
 ))}
 </select>
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="doctorId"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Doctor *</FormLabel>
 <FormControl>
 <select
 {...field}
 className="w-full px-3 py-2 border rounded-md"
 >
 <option value="">Select a doctor...</option>
 {doctors.map((doctor) => (
 <option key={doctor.id} value={doctor.id}>
 {doctor.firstName} {doctor.lastName} -{" "}
 {doctor.speciality || "General"}
 </option>
 ))}
 </select>
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="appointmentDate"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Date *</FormLabel>
 <FormControl>
 <Input type="date" {...field} className="w-full" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="startTime"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Time *</FormLabel>
 <FormControl>
 <select
 {...field}
 className="w-full px-3 py-2 border rounded-md"
 >
 <option value="">Select a time...</option>
 {generateAvailableTimeSlots().map((time) => (
 <option key={time} value={time}>
 {time}
 </option>
 ))}
 </select>
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="sessionId"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Session *</FormLabel>
 <FormControl>
 <select
 {...field}
 className="w-full px-3 py-2 border rounded-md"
 disabled={sessions.length === 0}
 >
 <option value="">Select a session...</option>
 {sessions.length === 0 ? (
 <option value="" disabled>
 No sessions available for this doctor
 </option>
 ) : (
 sessions.map((session) => (
 <option key={session.id} value={session.id}>
 {session.sessionType?.name ||
 "Unknown Session"}{" "}
 - ${session.price}
 </option>
 ))
 )}
 </select>
 </FormControl>
 {sessions.length === 0 && (
 <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
 <div className="flex items-start">
 <svg
 className="h-4 w-4 text-amber-400 mt-0.5 mr-2 flex-shrink-0"
 fill="currentColor"
 viewBox="0 0 20 20"
 >
 <path
 fillRule="evenodd"
 d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
 clipRule="evenodd"
 />
 </svg>
 <div>
 <p className="font-medium">
 No sessions available for this doctor
 </p>
 <p className="text-xs mt-1">
 Please create sessions for this doctor in the
 Sessions page, or select a different doctor
 who has sessions.
 </p>
 </div>
 </div>
 </div>
 )}
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="notes"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Notes</FormLabel>
 <FormControl>
 <textarea
 {...field}
 className="w-full px-3 py-2 border rounded-md"
 rows={3}
 placeholder="Optional notes..."
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <div className="flex gap-4 pt-4">
 <Button
 type="submit"
 className="flex-1"
 disabled={createAppointmentMutation.isPending}
 >
 {createAppointmentMutation.isPending
 ? "Creating..."
 : "Create Appointment"}
 </Button>
 <Button
 type="button"
 variant="outline"
 onClick={() => {
 setShowAppointmentModal(false);
 setSelectedTimeSlot(null);
 form.reset();
 }}
 className="flex-1"
 >
 Cancel
 </Button>
 </div>
 </form>
 </Form>
 </CardContent>
 </Card>
 </div>
 )}
 </>
 );
};

export default SchedulePage;
