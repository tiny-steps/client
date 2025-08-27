import React, { useState } from "react";
import { useOutletContext } from "react-router";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import CalendarView from "@/components/CalendarView.jsx";
import { useGetAllDoctors } from "@/hooks/useDoctorQueries.js";
import { useGetAllPatients } from "@/hooks/usePatientQueries.js";
import { useGetAllAppointments } from "@/hooks/useScheduleQueries.js";
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

  const { data: doctorsData } = useGetAllDoctors({ size: 100 });
  const { data: patientsData } = useGetAllPatients({ size: 100 });
  const { data: appointmentsData } = useGetAllAppointments({ size: 100 });
  const { data: availabilityData } = useGetDoctorAvailability(
    selectedDoctor,
    { date: selectedDate },
    { enabled: !!selectedDoctor }
  );
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
  const sessions = selectedDoctor
    ? allSessions.filter((session) => session.doctorId === selectedDoctor)
    : [];

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
      // TODO: Implement appointment creation
      console.log("Creating appointment:", data);
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
    }
  };

  return (
    <>
      <DashboardHeader
        userName={user?.data.name}
        activeItemDescription={activeItem.description}
      />

      <div className="mx-20 pl-10">
        <CalendarView
          appointments={{ upcoming: appointments }}
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
        />
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
                                {patient.name} - {patient.email}
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
                                {doctor.name} - {doctor.speciality}
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
                    <Button type="submit" className="flex-1">
                      Create Appointment
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
