import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function SchedulePage() {
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
            Schedule Management
          </h1>
          <p className="text-gray-600">
            Manage appointments and doctor schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Time</th>
                    <th className="text-center py-2">Mon</th>
                    <th className="text-center py-2">Tue</th>
                    <th className="text-center py-2">Wed</th>
                    <th className="text-center py-2">Thu</th>
                    <th className="text-center py-2">Fri</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr className="border-b">
                    <td className="py-3 font-medium">9:00 AM</td>
                    <td className="text-center">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Dr. Smith
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Dr. Jones
                      </div>
                    </td>
                    <td className="text-center">-</td>
                    <td className="text-center">
                      <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Dr. Wilson
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Dr. Smith
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">10:00 AM</td>
                    <td className="text-center">
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Dr. Jones
                      </div>
                    </td>
                    <td className="text-center">-</td>
                    <td className="text-center">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Dr. Smith
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Dr. Jones
                      </div>
                    </td>
                    <td className="text-center">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">11:00 AM</td>
                    <td className="text-center">-</td>
                    <td className="text-center">
                      <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Dr. Wilson
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Dr. Jones
                      </div>
                    </td>
                    <td className="text-center">-</td>
                    <td className="text-center">
                      <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Dr. Wilson
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">2:00 PM</td>
                    <td className="text-center">
                      <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Dr. Wilson
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Dr. Smith
                      </div>
                    </td>
                    <td className="text-center">-</td>
                    <td className="text-center">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Dr. Smith
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Dr. Jones
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  New Appointment
                </button>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Block Time Slot
                </button>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                  Set Availability
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Appointments</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Available Slots</span>
                  <span className="font-medium text-green-600">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Doctors On Duty</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cancelled</span>
                  <span className="font-medium text-red-600">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/schedule")({
  component: SchedulePage,
});
