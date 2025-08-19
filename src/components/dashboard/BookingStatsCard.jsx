import React from 'react';
import { BookMarked } from 'lucide-react';
import BookingPieChart from '../BookingPieChart.jsx';
import FlippableCard from '../FlipableCard.jsx';

const BookingStatsCard = ({ bookingStats }) => {
    const frontContent = (
        <div className="flex items-center justify-center md:justify-between gap-4 md:gap-8 w-full">
            <BookMarked size={64} className="md:size-20" />
            <BookingPieChart
                data={[
                    {
                        label: "Completed",
                        value: bookingStats.completed,
                        color: "#10B981",
                    },
                    {
                        label: "Cancelled",
                        value: bookingStats.cancelled,
                        color: "#EF4444",
                    },
                    {
                        label: "Rescheduled",
                        value: bookingStats.rescheduled,
                        color: "#F59E0B",
                    },
                ]}
            />
        </div>
    );

    const backContent = (
        <div
            className="w-full h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-white/10 backdrop-blur-sm border-b border-white/20 dark:bg-gray-700/20 dark:text-gray-400 dark:border-gray-600/30">
                    <tr>
                        <th scope="col" className="px-4 py-2">Category</th>
                        <th scope="col" className="px-4 py-2 text-right">Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white/5 backdrop-blur-sm border-b border-white/10 dark:bg-gray-800/10 dark:border-gray-700/20 hover:bg-white/10 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-4 py-2 font-medium">Total Bookings</td>
                        <td className="px-4 py-2 text-right">{bookingStats.total}</td>
                    </tr>
                    <tr className="bg-white/5 backdrop-blur-sm border-b border-white/10 dark:bg-gray-800/10 dark:border-gray-700/20 hover:bg-white/10 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-4 py-2 font-medium">Cancelled by Doctor</td>
                        <td className="px-4 py-2 text-right">{bookingStats.byDoctor}</td>
                    </tr>
                    <tr className="bg-white/5 backdrop-blur-sm border-b border-white/10 dark:bg-gray-800/10 dark:border-gray-700/20 hover:bg-white/10 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-4 py-2 font-medium">Cancelled by Patient</td>
                        <td className="px-4 py-2 text-right">{bookingStats.byPatient}</td>
                    </tr>
                    <tr className="bg-white/5 backdrop-blur-sm border-b border-white/10 dark:bg-gray-800/10 dark:border-gray-700/20 hover:bg-white/10 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-4 py-2 font-medium">Missed (No Show)</td>
                        <td className="px-4 py-2 text-right">{bookingStats.missedNoShow}</td>
                    </tr>
                    <tr className="bg-white/5 backdrop-blur-sm dark:bg-gray-800/10 hover:bg-white/10 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-4 py-2 font-medium">Missed (Rescheduled)</td>
                        <td className="px-4 py-2 text-right">{bookingStats.missedRescheduled}</td>
                    </tr>
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

export default BookingStatsCard;
