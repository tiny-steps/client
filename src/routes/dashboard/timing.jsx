import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function TimingPage() {
  const pageRef = useRef(null);

  useGSAP(() => {
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current,
      {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div ref={pageRef} className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Timing Management
          </h1>
          <p className="text-gray-600">
            Configure working hours and availability slots.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Current Schedule</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Monday</span>
                <span className="text-sm text-gray-600">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Tuesday</span>
                <span className="text-sm text-gray-600">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Wednesday</span>
                <span className="text-sm text-gray-600">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Thursday</span>
                <span className="text-sm text-gray-600">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Friday</span>
                <span className="text-sm text-gray-600">9:00 AM - 3:00 PM</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Saturday</span>
                <span className="text-sm text-red-600">Closed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Sunday</span>
                <span className="text-sm text-red-600">Closed</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Update Working Hours</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Day</label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-sm">Mark as closed</label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Update Schedule
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/timing")({
  component: TimingPage,
});
