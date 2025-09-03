import React from 'react';
import { BookMarked } from 'lucide-react';
import BookingPieChart from '../BookingPieChart.jsx';
import FlippableCard from '../FlipableCard.jsx';
import { useWindowSize } from '../../hooks/useWindowSize.js';

const BookingStatsCard = ({ bookingStats }) => {
 const { isMobile, isTablet } = useWindowSize();
 const frontContent = (
   <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
     <BookMarked 
       size={isMobile ? 40 : isTablet ? 48 : 56} 
       className="text-purple-600 transition-all duration-200" 
     />
     <div className="text-center w-full">
       <div className={`font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight ${
         isMobile ? 'text-base' : 'text-lg sm:text-xl'
       }`}>
         Booking Statistics
       </div>
       <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2 ${
         isMobile ? 'text-xl' : ''
       }`}>
         {bookingStats.total}
       </div>
       <div className="text-xs sm:text-sm text-gray-600">
         Total Bookings
       </div>
     </div>
   </div>
 );

 const backContent = (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h3 className={`font-semibold text-gray-800 mb-3 sm:mb-4 ${
        isMobile ? 'text-base' : 'text-lg'
      }`}>
        Booking Breakdown
      </h3>
      <div className={`flex-1 flex items-center justify-center ${
        isMobile ? 'w-full' : 'w-auto'
      }`}>
        <div className={isMobile ? 'scale-75' : 'scale-100'}>
          <BookingPieChart
            data={[
              {
                label: "Confirmed",
                value: bookingStats.total - bookingStats.byDoctor - bookingStats.byPatient - bookingStats.missedNoShow - bookingStats.missedRescheduled,
                color: "#10B981",
              },
              {
                label: "Cancelled by Doctor",
                value: bookingStats.byDoctor,
                color: "#F59E0B",
              },
              {
                label: "Cancelled by Patient",
                value: bookingStats.byPatient,
                color: "#EF4444",
              },
              {
                label: "Missed",
                value: bookingStats.missedNoShow + bookingStats.missedRescheduled,
                color: "#6B7280",
              },
            ]}
          />
        </div>
      </div>
      <div className={`grid gap-2 sm:gap-4 mt-3 sm:mt-4 w-full text-center ${
        isMobile ? 'grid-cols-1 space-y-1' : 'grid-cols-2'
      }`}>
        <div className={`flex items-center justify-center gap-2 ${
          isMobile ? 'bg-gray-50 rounded-lg p-2' : ''
        }`}>
          <div className={`w-3 h-3 bg-green-500 rounded-full flex-shrink-0 ${
            isMobile ? 'block' : 'hidden'
          }`}></div>
          <div className="flex-1">
            <div className={`font-medium text-green-600 ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}>
              {bookingStats.total - bookingStats.byDoctor - bookingStats.byPatient - bookingStats.missedNoShow - bookingStats.missedRescheduled}
            </div>
            <div className="text-xs text-gray-600">Confirmed</div>
          </div>
        </div>
        <div className={`flex items-center justify-center gap-2 ${
          isMobile ? 'bg-gray-50 rounded-lg p-2' : ''
        }`}>
          <div className={`w-3 h-3 bg-red-500 rounded-full flex-shrink-0 ${
            isMobile ? 'block' : 'hidden'
          }`}></div>
          <div className="flex-1">
            <div className={`font-medium text-red-600 ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}>
              {bookingStats.byDoctor + bookingStats.byPatient}
            </div>
            <div className="text-xs text-gray-600">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );

 return (
 <FlippableCard
 frontContent={frontContent}
 backContent={backContent}
 />
 );
};

export default BookingStatsCard;
