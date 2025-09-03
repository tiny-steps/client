import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form.jsx";
import { Clock, Info, AlertTriangle } from "lucide-react";
import { useGetTimeSlots } from "../hooks/useTimingQueries.js";
import {
  isPastDate,
  isPastTimeSlot,
  validateAppointmentBooking,
  getMinSelectableDate,
  checkAppointmentConflicts
} from "../utils/appointmentValidation.js";

const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Time is required"),
  sessionId: z.string().min(1, "Session is required"),
  consultationType: z.string().default("IN_PERSON"),
  notes: z.string().optional(),
  sessionDurationMinutes: z
    .number()
    .min(5, "Duration must be at least 5 minutes")
    .max(480, "Duration must be less than 8 hours"),
});

const EnhancedAppointmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDoctor,
  selectedDate,
  selectedTimeSlot,
  patients = [],
  doctors = [],
  sessions = [],
  appointments = [],
  isLoading = false,
}) => {
  const [modifyDuration, setModifyDuration] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentDuration, setCurrentDuration] = useState(30);
  const [validationErrors, setValidationErrors] = useState([]);
  const [conflictWarning, setConflictWarning] = useState('');
  
  // Get minimum selectable date (today)
  const minDate = getMinSelectableDate();

  const form = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: selectedDoctor || "",
      appointmentDate: selectedDate || "",
      startTime: "", // Don't pre-populate time slot - let user select after choosing session
      sessionId: "",
      consultationType: "IN_PERSON",
      notes: "",
      sessionDurationMinutes: 30,
    },
  });

  // Watch session selection to update duration
  const watchedSessionId = form.watch("sessionId");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setModifyDuration(false);
      setSelectedSession(null);
      setCurrentDuration(30);
      setValidationErrors([]);
      setConflictWarning('');
      form.reset({
        patientId: "",
        doctorId: selectedDoctor || "",
        appointmentDate: selectedDate || "",
        startTime: "",
        sessionId: "",
        consultationType: "IN_PERSON",
        notes: "",
        sessionDurationMinutes: 30,
      });
    }
  }, [isOpen, selectedDoctor, selectedDate, form]);

  // Watch for form changes to validate in real-time
  const watchedDate = form.watch("appointmentDate");
  const watchedTime = form.watch("startTime");
  
  // Validate appointment when date, time, or duration changes
  useEffect(() => {
    if (watchedDate && watchedTime && currentDuration) {
      const conflictCheck = checkAppointmentConflicts(
        watchedTime,
        currentDuration,
        appointments,
        watchedDate
      );
      
      if (conflictCheck.hasConflict) {
        const conflictMessage = `This time slot conflicts with: ${conflictCheck.conflictingAppointments.map(apt => {
          const patientName = apt.patient?.firstName && apt.patient?.lastName 
            ? `${apt.patient.firstName} ${apt.patient.lastName}`
            : 'Unknown Patient';
          return `${apt.startTime} - ${patientName}`;
        }).join(', ')}`;
        setConflictWarning(conflictMessage);
      } else {
        setConflictWarning('');
      }
    }
  }, [watchedDate, watchedTime, currentDuration, appointments]);

  useEffect(() => {
    if (watchedSessionId && sessions.length > 0) {
      const session = sessions.find((s) => s.id === watchedSessionId);
      if (session?.sessionType?.defaultDurationMinutes) {
        const defaultDuration = session.sessionType.defaultDurationMinutes;
        setCurrentDuration(defaultDuration);
        setSelectedSession(session);
        form.setValue("sessionDurationMinutes", defaultDuration);

        // Reset modify duration when changing sessions
        setModifyDuration(false);

        // Clear the selected time slot when duration changes to force re-selection
        form.setValue("startTime", "");
      }
    }
  }, [watchedSessionId, sessions, form]);

  // Get available time slots
  const { data: availableSlotsData, isLoading: slotsLoading } =
    useGetTimeSlots(
      form.watch("doctorId"),
      form.watch("appointmentDate"),
      null, // practiceId - not used currently
      {
        enabled: !!(
          form.watch("doctorId") &&
          form.watch("appointmentDate")
        ),
      }
    );

  const availableSlots = useMemo(() => {
    // Ensure we have valid data structure: ResponseModel<TimeSlots> where TimeSlots has slots array
    if (!availableSlotsData?.data?.slots || !Array.isArray(availableSlotsData.data.slots)) {
      console.log('🔍 EnhancedAppointmentModal - No valid slots data:', availableSlotsData);
      return [];
    }

    console.log(
      `🔍 EnhancedAppointmentModal - Available slots for ${currentDuration}min duration:`,
      availableSlotsData.data.slots
    );

    // Filter out past time slots for today's date
    const selectedDate = form.watch("appointmentDate");
    const filteredSlots = availableSlotsData.data.slots.filter((slot) => {
      // Convert slot.startTime to HH:MM format for comparison
      const timeString = slot.startTime.substring(0, 5); // Extract HH:MM from HH:MM:SS
      
      // If it's today, filter out past time slots
      if (selectedDate === new Date().toISOString().split('T')[0]) {
        return !isPastTimeSlot(timeString);
      }
      return true;
    });

    return filteredSlots.map((slot) => ({
      value: slot.startTime.substring(0, 5), // Extract HH:MM from HH:MM:SS
      label: slot.startTime.substring(0, 5),
    }));
  }, [availableSlotsData, currentDuration, form]);

  const handleDurationChange = (newDuration) => {
    setCurrentDuration(newDuration);
    form.setValue("sessionDurationMinutes", newDuration);

    // Clear the selected time slot when duration is manually changed
    form.setValue("startTime", "");
  };

  const handleSubmit = async (data) => {
    try {
      // Clear previous validation errors
      setValidationErrors([]);
      setConflictWarning('');
      
      // Comprehensive validation
      const validation = validateAppointmentBooking(
        data.appointmentDate,
        data.startTime,
        currentDuration,
        appointments
      );
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return; // Don't submit if validation fails
      }
      
      const submitData = {
        ...data,
        sessionDurationMinutes: currentDuration,
        sessionTypeId: selectedSession?.sessionType?.id,
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error("Failed to create appointment:", error);
      setValidationErrors(["Failed to create appointment. Please try again."]);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Create New Appointment
            </CardTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Patient Selection */}
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient *</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
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

              {/* Doctor Selection */}
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor *</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
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

              <div className="grid grid-cols-2 gap-4">
                {/* Date Selection */}
                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={minDate}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                      {isPastDate(field.value) && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Cannot book appointments on past dates</span>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Session Selection */}
                <FormField
                  control={form.control}
                  name="sessionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
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
                                {session.sessionType?.name || "Unknown Session"} -
                                ${session.price}
                                {session.sessionType?.defaultDurationMinutes &&
                                  ` (${formatTime(
                                    session.sessionType.defaultDurationMinutes
                                  )})`}
                              </option>
                            ))
                          )}
                        </select>
                      </FormControl>
                      {sessions.length === 0 && (
                        <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
                          <div className="flex items-start">
                            <Info className="h-4 w-4 text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <p className="font-medium">
                                No sessions available for this doctor
                              </p>
                              <p className="text-xs mt-1">
                                Please create sessions for this doctor in the
                                Sessions page.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Time Selection with Intelligent Slots */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                          disabled={
                            slotsLoading || !currentDuration || !selectedSession
                          }
                        >
                          <option value="">
                            {!selectedSession
                              ? "Select a session first..."
                              : slotsLoading
                              ? "Loading available slots..."
                              : "Select a time..."}
                          </option>
                          {availableSlots.map((slot) => (
                            <option key={slot.value} value={slot.value}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                      {!selectedSession && (
                        <p className="text-sm text-blue-600 mt-1">
                          Please select a session to see available time slots.
                        </p>
                      )}
                      {selectedSession &&
                        availableSlots.length === 0 &&
                        !slotsLoading &&
                        currentDuration && (
                          <p className="text-sm text-amber-600 mt-1">
                            No available slots for {formatTime(currentDuration)}{" "}
                            duration on this date.
                          </p>
                        )}
                      {conflictWarning && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{conflictWarning}</span>
                        </div>
                      )}
                      {field.value && isPastTimeSlot(field.value) && watchedDate === new Date().toISOString().split('T')[0] && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Cannot book appointments in the past</span>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

              {/* Session Duration Management */}
              {selectedSession && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Session Duration
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-blue-800">
                        Default Duration:{" "}
                        <strong>
                          {formatTime(
                            selectedSession.sessionType
                              ?.defaultDurationMinutes || 30
                          )}
                        </strong>
                      </span>
                      <Input
                        type="number"
                        value={
                          selectedSession.sessionType?.defaultDurationMinutes ||
                          30
                        }
                        disabled
                        className="w-20 px-2 py-1 text-sm bg-gray-100"
                        min="5"
                        max="480"
                      />
                      <span className="text-sm text-gray-600">minutes</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="modifyDuration"
                        checked={modifyDuration}
                        onChange={(e) => setModifyDuration(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="modifyDuration"
                        className="text-sm text-blue-800"
                      >
                        Modify Duration
                      </label>
                    </div>

                    {modifyDuration && (
                      <FormField
                        control={form.control}
                        name="sessionDurationMinutes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Custom Duration (minutes)
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-3">
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    field.onChange(value);
                                    handleDurationChange(value);
                                  }}
                                  className="w-24 px-2 py-1 text-sm"
                                  min="5"
                                  max="480"
                                />
                                <span className="text-sm text-gray-600">
                                  minutes ({formatTime(currentDuration)})
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                      <Info className="h-3 w-3 inline mr-1" />
                      Available time slots are calculated based on the session
                      duration and existing appointments.
                    </div>
                  </div>
                </div>
              )}

              {/* Consultation Type */}
              <FormField
                control={form.control}
                name="consultationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                      >
                        <option value="IN_PERSON">In-Person</option>
                        <option value="TELEMEDICINE">Telemedicine</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none"
                        rows={3}
                        placeholder="Optional notes..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Validation Errors Display */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Validation Errors</span>
                  </div>
                  <ul className="text-red-700 text-sm space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isLoading || sessions.length === 0 || validationErrors.length > 0 || conflictWarning}
                >
                  {isLoading ? "Creating..." : "Create Appointment"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAppointmentModal;
