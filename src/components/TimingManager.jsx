import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timingService } from "../services/timingService.js";
import { useGetAllDoctors } from "../hooks/useDoctorQueries.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
function getMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}
const TimingManager = () => {
  const queryClient = useQueryClient();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [sessions, setSessions] = useState([
    {
      startTime: "",
      endTime: "",
      description: "",
      isEmergency: false,
    },
  ]);

  const { data: doctorsData } = useGetAllDoctors({ size: 100 });
  const doctors = doctorsData?.data?.content || [];

  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ["availability", selectedDoctor, selectedDate],
    queryFn: () =>
      timingService.getDoctorAvailability(selectedDoctor, {
        date: selectedDate,
      }),
    enabled: !!selectedDoctor,
  });

  const { data: timeOffsData } = useQuery({
    queryKey: ["timeoffs", selectedDoctor],
    queryFn: () => timingService.getDoctorTimeOffs(selectedDoctor),
    enabled: !!selectedDoctor,
  });

  const createAvailability = useMutation({
    mutationFn: (data) =>
      timingService.createAvailability(selectedDoctor, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["availability"]);
      setShowAddModal(false);
    },
  });

  const createTimeOff = useMutation({
    mutationFn: (data) => timingService.createTimeOff(selectedDoctor, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["timeoffs"]);
    },
  });

  const availability = availabilityData?.data || [];
  const timeOffs = timeOffsData?.data || [];

  const weekDays = [
    {
      name: "Monday",
      value: 1,
    },
    {
      name: "Tuesday",
      value: 2,
    },
    {
      name: "Wednesday",
      value: 3,
    },
    {
      name: "Thursday",
      value: 4,
    },
    {
      name: "Friday",
      value: 5,
    },
    {
      name: "Saturday",
      value: 6,
    },
    {
      name: "Sunday",
      value: 7,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Timing Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="px-3 py-2 border rounded-md"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">Select a doctor...</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} - {doc.speciality}
                </option>
              ))}
            </select>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {selectedDoctor && (
        <>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Weekly Availability</CardTitle>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Availability
              </Button>
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
                      (a) => a.dayOfWeek === day.value
                    );
                    return (
                      <Card key={day.value} className="p-4">
                        <h3 className="font-semibold mb-2">{day.name}</h3>
                        {dayAvailability.length > 0 ? (
                          <div className="space-y-2">
                            {dayAvailability.map((slot, idx) => (
                              <div
                                key={idx}
                                className="text-sm bg-green-50 p-2 rounded"
                              >
                                <p>
                                  {slot.startTime} - {slot.endTime}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {slot.location}
                                </p>
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

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Time Offs</CardTitle>
              <Button
                onClick={() => {
                  /* Add time off modal */
                }}
                variant="outline"
              >
                Add Time Off
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timeOffs.length > 0 ? (
                  timeOffs.map((timeOff) => (
                    <div
                      key={timeOff.id}
                      className="flex justify-between items-center p-3 bg-red-50 rounded"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(timeOff.startDate).toLocaleDateString()} -{" "}
                          {new Date(timeOff.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {timeOff.reason}
                        </p>
                      </div>
                      <Button size="sm" variant="destructive">
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No time offs scheduled</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const dayOfWeek = Number(formData.get("dayOfWeek"));
                  const practiceId =
                    formData.get("practiceId") ||
                    "b2a1c3d4-5678-4321-9876-abcdef123456"; // Replace with actual logic
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
                  createAvailability.mutate({
                    practiceId,
                    dayOfWeek,
                    slotDurationMinutes,
                    isActive,
                    durations,
                  });
                }}
                className="space-y-4"
              >
                <Input name="practiceId" placeholder="Practice ID (optional)" />
                <select
                  name="dayOfWeek"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select day...</option>
                  {weekDays.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.name}
                    </option>
                  ))}
                </select>
                {/* Sessions UI */}
                {sessions.map((session, idx) => (
                  <div key={idx} className="border p-3 rounded mb-2">
                    <div className="flex gap-2 mb-2">
                      <Input
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
                      <Input
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
                    <Input
                      value={session.description}
                      onChange={(e) => {
                        const newSessions = [...sessions];
                        newSessions[idx].description = e.target.value;
                        setSessions(newSessions);
                      }}
                      placeholder="Description"
                    />
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={session.isEmergency}
                        onChange={(e) => {
                          const newSessions = [...sessions];
                          newSessions[idx].isEmergency = e.target.checked;
                          setSessions(newSessions);
                        }}
                      />
                      <span className="ml-2">Emergency</span>
                    </label>
                    <div className="flex gap-2 mt-2">
                      {sessions.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            setSessions(sessions.filter((_, i) => i !== idx));
                          }}
                        >
                          Remove Session
                        </Button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Duration:{" "}
                      {session.startTime && session.endTime
                        ? getMinutes(session.endTime) -
                          getMinutes(session.startTime)
                        : 0}{" "}
                      minutes
                    </div>
                  </div>
                ))}
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
                <div className="flex gap-2 mt-4">
                  <Button type="submit">Add</Button>
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
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TimingManager;
