import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timingService } from "../services/timingService.js";
import { timeoffService } from "../services/timeoffService.js";
import {
  useGetAllDoctors,
  useGetDoctorBranches,
} from "../hooks/useDoctorQueries.js";
import { useGetDoctorsWithAvailability } from "../hooks/useFilteredDoctorQueries.js";
import { useBranchFilter } from "../hooks/useBranchFilter.js";
import useAddressStore from "../store/useAddressStore.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { ErrorModal } from "./ui/error-modal.jsx";
import TimeoffRequestForm from "./TimeoffRequestForm.jsx";
import TimeoffList from "./TimeoffList.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx";
import { Calendar, List, Plus } from "lucide-react";

function getMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

const TimingManager = () => {
  const { branchId, hasSelection } = useBranchFilter();

  // Mutation for updating a duration
  const updateDurationMutation = useMutation({
    mutationFn: ({ doctorId, availabilityId, durationId, data }) =>
      timingService.updateDuration(doctorId, availabilityId, durationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["availability"]);
      queryClient.refetchQueries(["availability"]);
      setEditModal({ open: false, slot: null, duration: null });
    },
    onError: (error) => {
      setErrorModal({
        open: true,
        title: "Failed to Update Duration",
        message:
          error.message ||
          "An error occurred while updating the duration. Please try again.",
      });
    },
  });

  // Mutation for deleting a duration
  const deleteDurationMutation = useMutation({
    mutationFn: ({ doctorId, availabilityId, durationId }) =>
      timingService.deleteDuration(doctorId, availabilityId, durationId),
    onSuccess: (_, { availabilityId, remainingDurations }) => {
      // Invalidate and refetch availability data immediately
      queryClient.invalidateQueries(["availability"]);
      queryClient.refetchQueries(["availability"]);

      // If no durations left, delete the availability
      if (remainingDurations === 0) {
        deleteAvailabilityMutation.mutate({ availabilityId });
      }
    },
    onError: (error) => {
      setErrorModal({
        open: true,
        title: "Failed to Delete Duration",
        message:
          error.message ||
          "An error occurred while deleting the duration. Please try again.",
      });
    },
  });

  // Mutation for deleting an availability
  const deleteAvailabilityMutation = useMutation({
    mutationFn: ({ availabilityId }) => {
      console.log("Deleting availability with:", {
        selectedDoctor,
        availabilityId,
      });
      return timingService.deleteAvailability(selectedDoctor, availabilityId);
    },
    onSuccess: () => {
      // Invalidate and refetch availability data immediately
      queryClient.invalidateQueries(["availability"]);
      queryClient.refetchQueries(["availability"]);
    },
  });

  // Add missing editModal state for editing durations
  const [editModal, setEditModal] = useState({
    open: false,
    slot: null,
    duration: null,
  });
  const [conflictModal, setConflictModal] = useState({
    open: false,
    conflicts: [],
    timeOff: null,
  });

  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  // Timeoff management state
  const [showTimeoffForm, setShowTimeoffForm] = useState(false);
  const [editingTimeoff, setEditingTimeoff] = useState(null);
  const [activeTab, setActiveTab] = useState("availability");

  // Helper to check overlap between timeoff and duration
  function isOverlap(timeOff, duration) {
    // timeOff: { startDate, endDate, startTime, endTime }
    // duration: { startTime, endTime }
    // Only check time if date matches selectedDate
    // For simplicity, compare time strings
    if (!timeOff.startTime || !timeOff.endTime) return false;
    return (
      duration.startTime < timeOff.endTime &&
      duration.endTime > timeOff.startTime
    );
  }

  // Add time off handler
  function handleAddTimeOff(timeOffData) {
    // Find all conflicting durations
    const conflicts = [];
    availability.forEach((slot) => {
      slot.durations.forEach((duration) => {
        if (isOverlap(timeOffData, duration)) {
          conflicts.push({ slot, duration });
        }
      });
    });
    if (conflicts.length > 0) {
      setConflictModal({ open: true, conflicts, timeOff: timeOffData });
    } else {
      createTimeOff.mutate(timeOffData);
    }
  }

  const queryClient = useQueryClient();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPracticeId, setSelectedPracticeId] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [sessions, setSessions] = useState([
    {
      startTime: "",
      endTime: "",
      description: "",
      isEmergency: false,
    },
  ]);
  const [selectedDays, setSelectedDays] = useState([]);

  // Debug logs

  // Pass branchId to get doctors for the selected address
  const { data: doctorsData } = useGetAllDoctors(
    {
      size: 100,
      status: "ACTIVE", // Only fetch active doctors for selection
      ...(branchId && { branchId }), // Only include branchId if it's not null
    },
    {
      enabled: hasSelection, // Fetch when we have a selection (including "all")
    }
  );

  const doctors = doctorsData?.data?.content || [];

  // Set the first doctor as default when doctors data is loaded or branch changes
  useEffect(() => {
    if (doctors.length > 0) {
      const firstDoctor = doctors[0];
      setSelectedDoctor(firstDoctor.id);
    } else {
      // Clear selected doctor if no doctors available for the branch
      setSelectedDoctor("");
    }
  }, [doctors, branchId]); // Reset when branchId changes

  // Get doctor's branches when a doctor is selected
  const { data: doctorBranchesData } = useGetDoctorBranches(selectedDoctor);
  const doctorBranches = doctorBranchesData?.branchIds || [];

  // Get addresses for branch names
  const addresses = useAddressStore((state) => state.addresses);

  // Set practice ID when doctor branches are loaded
  useEffect(() => {
    if (doctorBranches.length > 0 && addresses.length > 0) {
      // Filter addresses to only show those the doctor is associated with
      const doctorAddresses = addresses.filter((addr) =>
        doctorBranches.includes(addr.id)
      );

      if (doctorAddresses.length === 1) {
        // If doctor is in only one branch, prefill with that branch name
        setSelectedPracticeId(
          doctorAddresses[0].name ||
            `${doctorAddresses[0].type} - ${doctorAddresses[0].city}`
        );
      } else if (doctorAddresses.length > 1) {
        // If doctor is in multiple branches, set to first one as default
        setSelectedPracticeId(
          doctorAddresses[0].name ||
            `${doctorAddresses[0].type} - ${doctorAddresses[0].city}`
        );
      }
    }
  }, [doctorBranches, addresses]);

  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ["availability", selectedDoctor],
    queryFn: () => timingService.getDoctorAvailability(selectedDoctor),
    enabled: !!selectedDoctor,
  });

  const { data: timeOffsData, error: timeOffsError } = useQuery({
    queryKey: ["timeoffs", selectedDoctor],
    queryFn: () => timingService.getDoctorTimeOffs(selectedDoctor),
    enabled: !!selectedDoctor,
  });

  // Debug time offs error
  if (timeOffsError) {
    console.error("Time offs error:", timeOffsError);
  }

  const createAvailability = useMutation({
    mutationFn: (data) =>
      timingService.createAvailability(selectedDoctor, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["availability"]);
      queryClient.refetchQueries(["availability"]);
      setShowAddModal(false);
      setSelectedDays([]);
      setSessions([
        {
          startTime: "",
          endTime: "",
          description: "",
          isEmergency: false,
        },
      ]);
    },
  });

  const createTimeOff = useMutation({
    mutationFn: (data) => timingService.createTimeOff(selectedDoctor, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["timeoffs"]);
      queryClient.refetchQueries(["timeoffs"]);
    },
  });

  // Timeoff handlers
  const handleAddTimeoff = () => {
    setEditingTimeoff(null);
    setShowTimeoffForm(true);
  };

  const handleEditTimeoff = (timeoff) => {
    setEditingTimeoff(timeoff);
    setShowTimeoffForm(true);
  };

  const handleTimeoffFormSuccess = () => {
    setShowTimeoffForm(false);
    setEditingTimeoff(null);
  };

  const handleTimeoffFormCancel = () => {
    setShowTimeoffForm(false);
    setEditingTimeoff(null);
  };

  const availability = Array.isArray(availabilityData)
    ? availabilityData
    : availabilityData?.data || [];
  const timeOffs = timeOffsData?.data || [];

  // Generate week days with current date context
  const getWeekDays = () => {
    const today = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return dayNames.map((name, index) => {
      const dayValue = index === 0 ? 7 : index; // Sunday = 7, Monday = 1, etc.
      const isToday = today.getDay() === index;

      return {
        name: name,
        value: dayValue,
        isToday: isToday,
        date: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay() + index
        ),
      };
    });
  };

  const weekDays = getWeekDays();

  // Reset doctor selection when address changes
  useEffect(() => {
    setSelectedDoctor("");
  }, [branchId]);

  return (
    <div className="min-h-screen bg-gray-50/20 p-6 space-y-6">
      {/* Edit Duration Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-gray-50/20 bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <CardTitle>Edit Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    startTime: formData.get("startTime"),
                    endTime: formData.get("endTime"),
                    description: formData.get("description"),
                    isEmergencySlot: formData.get("emergency") === "on",
                  };
                  updateDurationMutation.mutate({
                    doctorId: selectedDoctor,
                    availabilityId: editModal.slot.id,
                    durationId: editModal.duration.id,
                    data,
                  });
                  setEditModal({ open: false, slot: null, duration: null });
                }}
                className="space-y-4"
              >
                <Input
                  name="startTime"
                  type="time"
                  defaultValue={editModal.duration.startTime}
                  required
                />
                <Input
                  name="endTime"
                  type="time"
                  defaultValue={editModal.duration.endTime}
                  required
                />
                <Input
                  name="description"
                  defaultValue={editModal.duration.description}
                  placeholder="Description"
                />
                <label className="flex items-center">
                  <input
                    name="emergency"
                    type="checkbox"
                    defaultChecked={editModal.duration.emergency}
                  />
                  <span className="ml-2">Emergency</span>
                </label>
                <div className="flex gap-2 mt-4">
                  <Button type="submit">Update</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setEditModal({ open: false, slot: null, duration: null })
                    }
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      <h1 className="text-2xl font-bold">Timing Management</h1>

      {/* Branch Selection */}

      <Card>
        <CardHeader>
          <CardTitle>Select Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          {doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg mb-4">Please add doctors</p>
              <p className="text-gray-500 text-sm">
                No doctors are available. Please add doctors first to manage
                their timing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <select
                className="px-3 py-2 border rounded-md"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                disabled={!hasSelection} // Disable until address is selected
              >
                <option value="">Select a doctor...</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                    {doc.speciality ? ` - ${doc.speciality}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!hasSelection && (
            <p className="text-sm text-blue-600 mt-2">
              Please select an address first to see available doctors.
            </p>
          )}
        </CardContent>
      </Card>

      {selectedDoctor && (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="availability"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Availability
              </TabsTrigger>
              <TabsTrigger value="timeoffs" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Time Offs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="availability" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>Weekly Availability</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingTimeoff(null);
                        setShowTimeoffForm(true);
                      }}
                      variant="outline"
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Time Off
                    </Button>
                    <Button
                      onClick={() => setShowAddModal(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add Availability
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {weekDays.map((day) => {
                        const dayAvailability = availability.filter(
                          (a) => a.dayOfWeek === day.value && a.active
                        );
                        return (
                          <Card
                            key={day.value}
                            className={`p-4 ${
                              day.isToday
                                ? "ring-2 ring-blue-500 bg-blue-50"
                                : ""
                            }`}
                          >
                            <h3
                              className={`font-semibold mb-2 ${
                                day.isToday ? "text-blue-700" : ""
                              }`}
                            >
                              {day.name}
                              {day.isToday && (
                                <span className="ml-2 text-sm text-blue-600">
                                  (Today)
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">
                              {day.date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>

                            {/* Show time offs for this day */}
                            {(() => {
                              const dayTimeOffs = timeOffs.filter((timeoff) => {
                                const startDate = new Date(
                                  timeoff.startDatetime
                                );
                                const endDate = new Date(timeoff.endDatetime);
                                const dayStart = new Date(day.date);
                                dayStart.setHours(0, 0, 0, 0);
                                const dayEnd = new Date(day.date);
                                dayEnd.setHours(23, 59, 59, 999);

                                return (
                                  startDate <= dayEnd && endDate >= dayStart
                                );
                              });

                              return (
                                dayTimeOffs.length > 0 && (
                                  <div className="mb-2 space-y-1">
                                    {dayTimeOffs.map((timeoff, idx) => (
                                      <div
                                        key={idx}
                                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                                      >
                                        🚫 {timeoff.description}
                                        <div className="text-xs text-red-600">
                                          {new Date(
                                            timeoff.startDatetime
                                          ).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}{" "}
                                          -{" "}
                                          {new Date(
                                            timeoff.endDatetime
                                          ).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )
                              );
                            })()}

                            {dayAvailability.length > 0 ? (
                              <div className="space-y-2">
                                {dayAvailability.map((slot, idx) => (
                                  <div key={idx} className="mb-2">
                                    {slot.durations &&
                                    slot.durations.length > 0 ? (
                                      slot.durations.map((duration, dIdx) => (
                                        <div
                                          key={duration.id || dIdx}
                                          className="text-sm bg-green-50 p-2 rounded mb-1 flex justify-between items-center"
                                        >
                                          <div>
                                            <p>
                                              {duration.startTime} -{" "}
                                              {duration.endTime}
                                              {duration.emergency ? (
                                                <span className="ml-2 text-red-500">
                                                  (Emergency)
                                                </span>
                                              ) : null}
                                            </p>
                                            {duration.description && (
                                              <p className="text-xs text-gray-600">
                                                {duration.description}
                                              </p>
                                            )}
                                          </div>
                                          <div className="flex gap-2">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              title="Edit Duration"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditModal({
                                                  open: true,
                                                  slot,
                                                  duration,
                                                });
                                              }}
                                            >
                                              <span
                                                role="img"
                                                aria-label="edit"
                                              >
                                                ✏️
                                              </span>
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              title="Delete Duration"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (
                                                  window.confirm(
                                                    `Are you sure you want to delete this time slot (${duration.startTime} - ${duration.endTime})?`
                                                  )
                                                ) {
                                                  console.log(
                                                    "Deleting duration with data:",
                                                    {
                                                      doctorId: selectedDoctor,
                                                      availabilityId: slot.id,
                                                      durationId: duration.id,
                                                      remainingDurations:
                                                        slot.durations.length -
                                                        1,
                                                      slot: slot,
                                                    }
                                                  );
                                                  deleteDurationMutation.mutate(
                                                    {
                                                      doctorId: selectedDoctor,
                                                      availabilityId: slot.id,
                                                      durationId: duration.id,
                                                      remainingDurations:
                                                        slot.durations.length -
                                                        1,
                                                    }
                                                  );
                                                }
                                              }}
                                            >
                                              <span
                                                role="img"
                                                aria-label="delete"
                                              >
                                                🗑️
                                              </span>
                                            </Button>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-500">
                                        No sessions
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No availability
                              </p>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeoffs" className="mt-6">
              <TimeoffList
                doctorId={selectedDoctor}
                timeoffs={timeOffs}
                isLoading={false}
                onEdit={handleEditTimeoff}
                onAdd={handleAddTimeoff}
                showActions={true}
                showFilters={true}
              />
            </TabsContent>
          </Tabs>

          {/* Timeoff Form Modal */}
          {showTimeoffForm && (
            <div className="fixed inset-0 bg-gray-50/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
                <TimeoffRequestForm
                  doctorId={selectedDoctor}
                  initialData={editingTimeoff}
                  onSuccess={handleTimeoffFormSuccess}
                  onCancel={handleTimeoffFormCancel}
                />
              </div>
            </div>
          )}
        </>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-50/20 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl mx-auto">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Add Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (selectedDays.length === 0) {
                      alert("Please select at least one day");
                      return;
                    }

                    const formData = new FormData(e.target);
                    const practiceId =
                      selectedPracticeId || formData.get("practiceId") || "";

                    if (!practiceId) {
                      alert("Please select a branch/practice");
                      return;
                    }
                    const isActive = true;

                    // Calculate slot duration as the max duration among sessions
                    const durations = sessions.map((s, idx) => ({
                      sessionIndex: idx + 1,
                      startTime: s.startTime,
                      endTime: s.endTime,
                      isEmergency: s.isEmergency,
                      description: s.description,
                    }));
                    const slotDurationMinutes = Math.max(
                      ...sessions.map(
                        (s) => getMinutes(s.endTime) - getMinutes(s.startTime)
                      )
                    );

                    // Create availability for each selected day
                    selectedDays.forEach((dayOfWeek) => {
                      createAvailability.mutate({
                        practiceId,
                        dayOfWeek,
                        slotDurationMinutes,
                        isActive,
                        durations: durations.map((d) => ({ ...d })), // Clone durations for each day
                      });
                    });
                  }}
                  className="space-y-4"
                >
                  {/* Practice ID / Branch Selection */}
                  <div>
                    <Label htmlFor="practiceId">Select Branch/Practice *</Label>
                    {(() => {
                      const doctorAddresses = addresses.filter((addr) =>
                        doctorBranches.includes(addr.id)
                      );

                      if (doctorAddresses.length === 0) {
                        return (
                          <Input
                            id="practiceId"
                            name="practiceId"
                            placeholder="Practice ID (optional)"
                            value={selectedPracticeId}
                            onChange={(e) =>
                              setSelectedPracticeId(e.target.value)
                            }
                          />
                        );
                      } else if (doctorAddresses.length === 1) {
                        return (
                          <Input
                            id="practiceId"
                            name="practiceId"
                            placeholder="Practice ID"
                            value={selectedPracticeId}
                            onChange={(e) =>
                              setSelectedPracticeId(e.target.value)
                            }
                            readOnly
                            className="bg-gray-50"
                          />
                        );
                      } else {
                        return (
                          <select
                            id="practiceId"
                            name="practiceId"
                            value={selectedPracticeId}
                            onChange={(e) =>
                              setSelectedPracticeId(e.target.value)
                            }
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select a branch...</option>
                            {doctorAddresses.map((address) => (
                              <option
                                key={address.id}
                                value={
                                  address.name ||
                                  `${address.type} - ${address.city}`
                                }
                              >
                                {address.name ||
                                  `${address.type} - ${address.city}`}
                              </option>
                            ))}
                          </select>
                        );
                      }
                    })()}
                  </div>
                  {/* Multi-day selection */}
                  <div>
                    <Label>Select Days *</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Check multiple to apply to all selected days
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {weekDays.map((day) => (
                        <label
                          key={day.value}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDays.includes(day.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDays([...selectedDays, day.value]);
                              } else {
                                setSelectedDays(
                                  selectedDays.filter((d) => d !== day.value)
                                );
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{day.name}</span>
                        </label>
                      ))}
                    </div>
                    {selectedDays.length === 0 && (
                      <p className="text-sm text-red-600 mt-1">
                        Please select at least one day
                      </p>
                    )}
                  </div>
                  {/* Sessions UI */}
                  {sessions.map((session, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 p-4 rounded-lg mb-4"
                    >
                      <h4 className="text-sm font-medium mb-3">
                        Session {idx + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`startTime-${idx}`}>
                            Start Time *
                          </Label>
                          <Input
                            id={`startTime-${idx}`}
                            type="time"
                            value={session.startTime}
                            onChange={(e) => {
                              const newSessions = [...sessions];
                              newSessions[idx].startTime = e.target.value;
                              setSessions(newSessions);
                            }}
                            required
                            placeholder="Start time"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`endTime-${idx}`}>End Time *</Label>
                          <Input
                            id={`endTime-${idx}`}
                            type="time"
                            value={session.endTime}
                            onChange={(e) => {
                              const newSessions = [...sessions];
                              newSessions[idx].endTime = e.target.value;
                              setSessions(newSessions);
                            }}
                            required
                            placeholder="End time"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor={`description-${idx}`}>
                          Description
                        </Label>
                        <Input
                          id={`description-${idx}`}
                          value={session.description}
                          onChange={(e) => {
                            const newSessions = [...sessions];
                            newSessions[idx].description = e.target.value;
                            setSessions(newSessions);
                          }}
                          placeholder="Session description"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={session.isEmergency}
                            onChange={(e) => {
                              const newSessions = [...sessions];
                              newSessions[idx].isEmergency = e.target.checked;
                              setSessions(newSessions);
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="ml-2 text-sm">Emergency Slot</span>
                        </label>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-500">
                          Duration:{" "}
                          {session.startTime && session.endTime
                            ? getMinutes(session.endTime) -
                              getMinutes(session.startTime)
                            : 0}{" "}
                          minutes
                        </div>
                        {sessions.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSessions(sessions.filter((_, i) => i !== idx));
                            }}
                          >
                            Remove Session
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setSessions([
                          ...sessions,
                          {
                            startTime: "",
                            endTime: "",
                            description: "",
                            isEmergency: false,
                          },
                        ])
                      }
                    >
                      + Add Session
                    </Button>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={createAvailability.isPending}
                      className="flex-1"
                    >
                      {createAvailability.isPending
                        ? "Creating..."
                        : "Add Availability"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddModal(false);
                        setSessions([
                          {
                            startTime: "",
                            endTime: "",
                            description: "",
                            isEmergency: false,
                          },
                        ]);
                        setSelectedDays([]);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Error Modal */}
      <ErrorModal
        open={errorModal.open}
        onOpenChange={(open) => setErrorModal({ open, title: "", message: "" })}
        title={errorModal.title}
        description={errorModal.message}
      />
    </div>
  );
};

export default TimingManager;
