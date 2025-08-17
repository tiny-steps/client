import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function ReportPage() {
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
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            View comprehensive reports and analytics for your practice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">156</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">89</div>
            <div className="text-sm text-gray-600">Appointments This Month</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">$12,450</div>
            <div className="text-sm text-gray-600">Revenue This Month</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">94%</div>
            <div className="text-sm text-gray-600">Patient Satisfaction</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Statistics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Appointments Completed</span>
                  <span>78/89 (88%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "88%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Patient Retention</span>
                  <span>142/156 (91%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "91%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Revenue Target</span>
                  <span>$12,450/$15,000 (83%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "83%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Doctor Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="font-medium">Dr. Smith</div>
                  <div className="text-sm text-gray-600">Cardiologist</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">32 patients</div>
                  <div className="text-sm text-green-600">95% satisfaction</div>
                </div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="font-medium">Dr. Jones</div>
                  <div className="text-sm text-gray-600">Pediatrician</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">28 patients</div>
                  <div className="text-sm text-green-600">97% satisfaction</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Dr. Wilson</div>
                  <div className="text-sm text-gray-600">Neurologist</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">18 patients</div>
                  <div className="text-sm text-green-600">92% satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Generate Report</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Export PDF
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Report Type
              </label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option>Monthly Summary</option>
                <option>Patient List</option>
                <option>Financial Report</option>
                <option>Doctor Performance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Date From
              </label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date To</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/report")({
  component: ReportPage,
});
