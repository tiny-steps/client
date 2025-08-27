import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useGetAllAppointments, useCreateAppointment, useCancelAppointment } from '../hooks/useScheduleQueries.js';
import { useGetAllDoctors } from '../hooks/useDoctorQueries.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { ConfirmModal } from './ui/confirm-modal.jsx';

const ScheduleCalendar = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('day'); // day, week, month
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cancelModal, setCancelModal] = useState({ open: false, appointment: null });

  const { data: appointmentsData, isLoading, refetch } = useGetAllAppointments({
    date: selectedDate,
    doctorId: selectedDoctor || undefined,
  });

  const { data: doctorsData } = useGetAllDoctors({ size: 100 });
  const createAppointment = useCreateAppointment();
  const cancelAppointment = useCancelAppointment();

  const appointments = appointmentsData?.data?.content || [];
  const doctors = doctorsData?.data?.content || [];

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let min = 0; min < 60; min += 30) {
        slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  }, []);

  const getAppointmentForSlot = (time) => {
    return appointments.find(apt => {
      const aptTime = new Date(apt.appointmentDateTime).toTimeString().slice(0, 5);
      return aptTime === time;
    });
  };

  const handleCancelAppointment = async () => {
    if (cancelModal.appointment) {
      await cancelAppointment.mutateAsync({
        id: cancelModal.appointment.id,
        reason: 'Cancelled by staff',
      });
      refetch();
      setCancelModal({ open: false, appointment: null });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
      CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
      NO_SHOW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          New Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Doctor</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">All Doctors</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">View</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>
                Today
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'day' && (
        <Card>
          <CardHeader>
            <CardTitle>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {timeSlots.map(time => {
                const appointment = getAppointmentForSlot(time);
                return (
                  <div key={time} className="flex items-center gap-4 p-2 border rounded hover:bg-gray-50">
                    <span className="w-16 text-sm font-medium">{time}</span>
                    {appointment ? (
                      <div className={`flex-1 p-3 rounded border ${getStatusColor(appointment.status)}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            <p className="text-sm">Dr. {appointment.doctorName}</p>
                            <p className="text-xs mt-1">{appointment.sessionType}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/appointments/${appointment.id}`)}>
                              View
                            </Button>
                            {appointment.status === 'SCHEDULED' && (
                              <Button size="sm" variant="destructive" onClick={() => setCancelModal({ open: true, appointment })}>
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 p-3 border border-dashed border-gray-300 rounded text-gray-400 text-center">
                        Available
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'week' && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-8 gap-2">
              <div className="font-medium">Time</div>
              {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() + dayOffset);
                return (
                  <div key={dayOffset} className="font-medium text-center text-sm">
                    {date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                  </div>
                );
              })}
              {timeSlots.filter((_, i) => i % 2 === 0).map(time => (
                <React.Fragment key={time}>
                  <div className="text-sm py-4">{time}</div>
                  {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                    const date = new Date(selectedDate);
                    date.setDate(date.getDate() + dayOffset);
                    const dayAppointments = appointments.filter(apt => {
                      const aptDate = new Date(apt.appointmentDateTime).toDateString();
                      return aptDate === date.toDateString();
                    });
                    const appointment = dayAppointments.find(apt => {
                      const aptTime = new Date(apt.appointmentDateTime).toTimeString().slice(0, 5);
                      return aptTime === time;
                    });
                    return (
                      <div key={`${time}-${dayOffset}`} className="border rounded p-1 min-h-[60px] hover:bg-gray-50">
                        {appointment && (
                          <div className={`text-xs p-1 rounded ${getStatusColor(appointment.status)}`}>
                            <p className="font-medium truncate">{appointment.patientName}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmModal
        open={cancelModal.open}
        onOpenChange={(open) => setCancelModal({ open, appointment: null })}
        title="Cancel Appointment"
        description={`Cancel appointment for ${cancelModal.appointment?.patientName}?`}
        confirmText="Cancel Appointment"
        variant="destructive"
        onConfirm={handleCancelAppointment}
      />
    </div>
  );
};

export default ScheduleCalendar;