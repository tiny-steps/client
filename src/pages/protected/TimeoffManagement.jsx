import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { timeoffService } from "../../services/timeoffService.js";
import { useBranchFilter } from "../../hooks/useBranchFilter.js";
import { useGetAllDoctors } from "../../hooks/useDoctorQueries.js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs.jsx";
import {
  Calendar,
  List,
  Plus,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import TimeoffRequestForm from "../../components/TimeoffRequestForm.jsx";
import TimeoffList from "../../components/TimeoffList.jsx";
import TimeoffCalendar from "../../components/TimeoffCalendar.jsx";
import { cn } from "../../lib/utils.js";

const TimeoffManagement = () => {
  const { branchId, hasSelection } = useBranchFilter();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTimeoff, setEditingTimeoff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState("calendar");

  // Get doctors for the selected branch
  const { data: doctorsData } = useGetAllDoctors(
    {
      size: 100,
      status: "ACTIVE",
      ...(branchId && { branchId }),
    },
    {
      enabled: hasSelection,
    }
  );

  const doctors = doctorsData?.data?.content || [];

  // Get timeoffs for selected doctor
  const { data: timeoffsData, isLoading: timeoffsLoading } = useQuery({
    queryKey: ["timeoffs", selectedDoctor],
    queryFn: () => timeoffService.getDoctorTimeOffs(selectedDoctor),
    enabled: !!selectedDoctor,
  });

  // Get timeoff statistics
  const { data: statsData } = useQuery({
    queryKey: ["timeoff-stats", selectedDoctor],
    queryFn: () => timeoffService.getTimeOffStats(selectedDoctor),
    enabled: !!selectedDoctor,
  });

  const timeoffs = timeoffsData || [];
  const stats = statsData || {};

  // Set first doctor as default when doctors load
  React.useEffect(() => {
    if (doctors.length > 0 && !selectedDoctor) {
      setSelectedDoctor(doctors[0].id);
    }
  }, [doctors, selectedDoctor]);

  const handleAddTimeoff = () => {
    setEditingTimeoff(null);
    setShowForm(true);
  };

  const handleEditTimeoff = (timeoff) => {
    setEditingTimeoff(timeoff);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTimeoff(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTimeoff(null);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setActiveTab("list");
  };

  const handleTimeoffClick = (timeoff) => {
    setEditingTimeoff(timeoff);
    setShowForm(true);
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month);
  };

  if (!hasSelection) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Select a Branch</h2>
            <p className="text-gray-600">
              Please select a branch to manage time offs for doctors.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Doctors Available</h2>
            <p className="text-gray-600">
              No doctors are available for the selected branch. Please add
              doctors first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/20 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Time Off Management</h1>
          <p className="text-gray-600">
            Manage doctor time off requests and schedules
          </p>
        </div>
        <Button onClick={handleAddTimeoff} disabled={!selectedDoctor}>
          <Plus className="h-4 w-4 mr-2" />
          Request Time Off
        </Button>
      </div>

      {/* Doctor Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Select a doctor...</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}{" "}
                {doctor.speciality ? `- ${doctor.speciality}` : ""}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {selectedDoctor && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Total Requests</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {stats.totalRequests || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Approved</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {stats.approvedRequests || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Rejected</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {stats.rejectedRequests || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Days Off</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {stats.totalDaysOff || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="mt-6">
              <TimeoffCalendar
                timeoffs={timeoffs}
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                onDateClick={handleDateClick}
                onTimeoffClick={handleTimeoffClick}
              />
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <TimeoffList
                doctorId={selectedDoctor}
                timeoffs={timeoffs}
                isLoading={timeoffsLoading}
                onEdit={handleEditTimeoff}
                onAdd={handleAddTimeoff}
                showActions={true}
                showFilters={true}
              />
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Time Off by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          status: "PENDING",
                          count: stats.pendingRequests || 0,
                          color: "bg-yellow-500",
                        },
                        {
                          status: "APPROVED",
                          count: stats.approvedRequests || 0,
                          color: "bg-green-500",
                        },
                        {
                          status: "REJECTED",
                          count: stats.rejectedRequests || 0,
                          color: "bg-red-500",
                        },
                        {
                          status: "CANCELLED",
                          count: stats.cancelledRequests || 0,
                          color: "bg-gray-500",
                        },
                      ].map(({ status, count, color }) => (
                        <div
                          key={status}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">{status}</span>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn("w-3 h-3 rounded-full", color)}
                            ></div>
                            <span className="text-sm">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">This Month</span>
                        <span className="text-sm">
                          {stats.thisMonthRequests || 0} requests
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Days Off This Month
                        </span>
                        <span className="text-sm">
                          {stats.thisMonthDaysOff || 0} days
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Upcoming</span>
                        <span className="text-sm">
                          {stats.upcomingRequests || 0} requests
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Timeoff Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <TimeoffRequestForm
              doctorId={selectedDoctor}
              initialData={editingTimeoff}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeoffManagement;
