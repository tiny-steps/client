import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function SessionPage() {
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
            Session Management
          </h1>
          <p className="text-gray-600">
            Track active sessions and patient consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                <h3 className="font-medium">Dr. Smith - Alice Johnson</h3>
                <p className="text-sm text-gray-600">Started: 10:30 AM</p>
                <p className="text-sm text-green-600">In Progress</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50">
                <h3 className="font-medium">Dr. Jones - Bob Smith</h3>
                <p className="text-sm text-gray-600">Started: 2:15 PM</p>
                <p className="text-sm text-yellow-600">Waiting for Doctor</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                <h3 className="font-medium">Dr. Wilson - Charlie Brown</h3>
                <p className="text-sm text-gray-600">Scheduled: 4:00 PM</p>
                <p className="text-sm text-blue-600">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Session Statistics</h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">Sessions Today</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-xs text-gray-600">In Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-xs text-gray-600">Cancelled</div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Average Session Duration</h3>
                <div className="text-2xl font-bold text-purple-600">32 min</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Session Notes</h2>
          <div className="space-y-3">
            <div className="border-b pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Alice Johnson - Consultation</h4>
                  <p className="text-sm text-gray-600">
                    Dr. Smith | 10:30 AM - 11:15 AM
                  </p>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Completed
                </span>
              </div>
              <p className="text-sm mt-2">
                Patient reported improvement in symptoms. Prescribed medication
                adjustment.
              </p>
            </div>
            <div className="border-b pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Bob Smith - Follow-up</h4>
                  <p className="text-sm text-gray-600">
                    Dr. Jones | 9:00 AM - 9:30 AM
                  </p>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Completed
                </span>
              </div>
              <p className="text-sm mt-2">
                Routine check-up. All vitals normal. Next appointment in 3
                months.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/session")({
  component: SessionPage,
});
