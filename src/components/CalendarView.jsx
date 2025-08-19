import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useWindowSize } from "../hooks/useWindowSize";

const CalendarView = ({ appointments }) => {
    const [view, setView] = useState("today");
    const [currentDate, setCurrentDate] = useState(
        new Date("2025-08-17T11:52:00")
    );
    const { width } = useWindowSize();
    const isMobile = width < 768;

    useEffect(() => {
        if (isMobile) {
            setView("today");
        }
    }, [isMobile]);

    const today = new Date("2025-08-17T11:52:00");

    const handlePrev = () => {
        if (view === "weekly") {
            setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
        } else if (view === "monthly") {
            setCurrentDate(
                new Date(currentDate.setMonth(currentDate.getMonth() - 1))
            );
        }
    };

    const handleNext = () => {
        if (view === "weekly") {
            setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
        } else if (view === "monthly") {
            setCurrentDate(
                new Date(currentDate.setMonth(currentDate.getMonth() + 1))
            );
        }
    };

    const renderToolbar = () => (
        <div className="hidden md:flex justify-center items-center mb-6 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg">
            <div className="flex space-x-2 bg-white/20 backdrop-blur-md border border-white/30 p-1 rounded-md shadow-lg">
                {["today", "weekly", "monthly"].map((viewType) => (
                    <button
                        key={viewType}
                        onClick={() => setView(viewType)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${view === viewType ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                        {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderTodayView = () => {
        const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
        return (
            <div className="bg-white/20 backdrop-blur-md border border-white/30 dark:bg-gray-800/20 dark:border-gray-700/30 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-center">
                    {today.toDateString()}
                </h3>
                <div className="space-y-4">
                    {hours.map((hour) => (
                        <div
                            key={hour}
                            className="flex border-t border-gray-200 dark:border-gray-700 pt-2"
                        >
                            <div className="w-16 text-right pr-4 text-sm text-gray-500">{`${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? "AM" : "PM"}`}</div>
                            <div className="flex-1 pl-4 border-l border-gray-200 dark:border-gray-700">
                                {appointments.upcoming
                                    .filter((a) => parseInt(a.time.split(":")[0]) === hour)
                                    .map((a) => (
                                        <div
                                            key={a.id}
                                            className="text-xs bg-blue-100 dark:bg-blue-900 p-1 rounded mb-1"
                                        >
                                            {a.patientName} at {a.time}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWeeklyView = () => {
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const days = Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });

        return (
            <div className="bg-white/20 backdrop-blur-md border border-white/30 dark:bg-gray-800/20 dark:border-gray-700/30 p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handlePrev}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        <ChevronLeft />
                    </button>
                    <h3 className="text-lg font-semibold">
                        {startOfWeek.toLocaleString("default", { month: "long" })}{" "}
                        {startOfWeek.getFullYear()}
                    </h3>
                    <button
                        onClick={handleNext}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        <ChevronRight />
                    </button>
                </div>
                <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600 dark:text-gray-300">
                    {weekDays.map((day) => (
                        <div key={day} className="py-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-700">
                    {days.map((day) => (
                        <div
                            key={day.toISOString()}
                            className={`p-2 h-24 border-r border-b border-gray-200 dark:border-gray-700 ${day.toDateString() === today.toDateString() ? "bg-blue-50 dark:bg-blue-900/50" : ""}`}
                        >
              <span
                  className={`text-xs font-medium ${day.getMonth() !== currentDate.getMonth() ? "text-gray-400" : ""}`}
              >
                {day.getDate()}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderMonthlyView = () => {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const firstDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        const lastDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );
        const daysInMonth = lastDay.getDate();
        const startDayIndex = firstDay.getDay();

        const calendarDays = [];
        for (let i = 0; i < startDayIndex; i++) {
            calendarDays.push({ key: `prev-${i}`, day: null, isCurrentMonth: false });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push({ key: `current-${i}`, day: i, isCurrentMonth: true });
        }
        while (calendarDays.length % 7 !== 0) {
            calendarDays.push({
                key: `next-${calendarDays.length}`,
                day: null,
                isCurrentMonth: false,
            });
        }

        return (
            <div className="bg-white/20 backdrop-blur-md border border-white/30 dark:bg-gray-800/20 dark:border-gray-700/30 p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handlePrev}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        <ChevronLeft />
                    </button>
                    <h3 className="text-lg font-semibold">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button
                        onClick={handleNext}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        <ChevronRight />
                    </button>
                </div>
                <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600 dark:text-gray-300">
                    {weekDays.map((day) => (
                        <div key={day} className="py-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-700">
                    {calendarDays.map((d) => (
                        <div
                            key={d.key}
                            className={`p-2 h-24 border-r border-b border-gray-200 dark:border-gray-700 ${d.day === today.getDate() && d.isCurrentMonth ? "bg-blue-50 dark:bg-blue-900/50" : ""}`}
                        >
              <span
                  className={`text-xs font-medium ${!d.isCurrentMonth ? "text-gray-400" : ""}`}
              >
                {d.day}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="mt-12">
            {renderToolbar()}
            {view === "today" && renderTodayView()}
            {!isMobile && view === "weekly" && renderWeeklyView()}
            {!isMobile && view === "monthly" && renderMonthlyView()}
        </div>
    );
};

export default CalendarView;
