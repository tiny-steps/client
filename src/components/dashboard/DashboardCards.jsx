import React from 'react';
import AppointmentCard from './AppointmentCard.jsx';
import DoctorCard from './DoctorCard.jsx';
import BookingStatsCard from './BookingStatsCard.jsx';

const DashboardCards = ({
 appointments,
 doctors,
 bookingStats,
 onAppointmentStatusChange,
 onDoctorStatusChange,
 onSlotSelection
}) => {
 return (
 <div className="flex flex-wrap items-center justify-center gap-6">
 <AppointmentCard
 appointments={appointments}
 onStatusChange={onAppointmentStatusChange}
 />
 <DoctorCard
 doctors={doctors}
 onStatusChange={onDoctorStatusChange}
 onSlotSelection={onSlotSelection}
 />
 <BookingStatsCard
 bookingStats={bookingStats}
 />
 </div>
 );
};

export default DashboardCards;
