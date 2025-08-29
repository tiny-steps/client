import React from 'react';
import { Baby, CheckCircle, XCircle } from 'lucide-react';
import FlippableCard from '../FlipableCard.jsx';

const AppointmentCard = ({ appointments, onStatusChange }) => {
 const getStatusColor = (status) => {
 if (status === "checked-in") return "text-green-500";
 if (status === "cancelled") return "text-red-500";
 return "text-gray-400";
 };

 const frontContent = (
 <div className="flex items-center justify-center md:justify-between gap-4 md:gap-8 w-full">
 <Baby size={64} className="md:size-20" />
 <div className="hidden md:flex flex-col gap-6 text-right">
 <div className="text-2xl">
 Today's <br /> Appointments
 </div>
 <p className="text-4xl font-bold">{`${appointments.completed}/${appointments.total}`}</p>
 </div>
 <p className="md:hidden text-4xl font-bold">{`${appointments.completed}/${appointments.total}`}</p>
 </div>
 );

 const backContent = (
 <div
 className="w-full h-full overflow-y-auto"
 onClick={(e) => e.stopPropagation()}
 >
 <table className="w-full text-sm text-left text-gray-600 ">
 <thead className="text-xs text-gray-700 uppercase bg-white/10 backdrop-blur-sm border-b border-white/20 ">
 <tr>
 <th scope="col" className="px-4 py-2">Patient</th>
 <th scope="col" className="px-4 py-2">Time</th>
 <th scope="col" className="px-4 py-2 text-center">Actions</th>
 </tr>
 </thead>
 <tbody>
 {appointments.upcoming.map((appt) => (
 <tr
 key={appt.id}
 >
 <td className="px-4 py-2 font-medium">{appt.patientName}</td>
 <td className="px-4 py-2">{appt.time}</td>
 <td className="px-4 py-2 flex justify-center items-center gap-2">
 <CheckCircle
 onClick={() => onStatusChange(appt.id, "checked-in")}
 className={`cursor-pointer hover:text-green-500 ${
 getStatusColor(appt.status) === "text-green-500" 
 ? "text-green-500" 
 : "text-gray-400"
 }`}
 />
 <XCircle
 onClick={() => onStatusChange(appt.id, "cancelled")}
 className={`cursor-pointer hover:text-red-500 ${
 getStatusColor(appt.status) === "text-red-500" 
 ? "text-red-500" 
 : "text-gray-400"
 }`}
 />
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 );

 return (
 <FlippableCard
 frontContent={frontContent}
 backContent={backContent}
 />
 );
};

export default AppointmentCard;
