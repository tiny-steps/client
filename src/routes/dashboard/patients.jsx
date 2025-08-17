import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function PatientsPage() {
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
            Patients Management
          </h1>
          <p className="text-gray-600">
            Manage patient records and appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Patient List</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium">Alice Johnson</h3>
                <p className="text-sm text-gray-600">Age: 32</p>
                <p className="text-sm text-blue-600">Next: 10:30 AM Today</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium">Bob Smith</h3>
                <p className="text-sm text-gray-600">Age: 45</p>
                <p className="text-sm text-green-600">Checked In</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium">Charlie Brown</h3>
                <p className="text-sm text-gray-600">Age: 28</p>
                <p className="text-sm text-red-600">Cancelled</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Patient's full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Patient's age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Medical History
                </label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                  placeholder="Brief medical history"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Patient
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/patients")({
  component: PatientsPage,
});
