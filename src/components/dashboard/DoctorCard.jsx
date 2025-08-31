import React from "react";
import { Stethoscope, CheckCircle, XCircle } from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";

const DoctorCard = ({ doctors, onStatusChange, onSlotSelection }) => {
  // Ensure doctors data is valid
  const validDoctors = doctors || { availableCount: 0, list: [] };
  const doctorList = validDoctors.list || [];
  const getStatusColor = (status) => {
    if (status === "checked-in") return "text-green-500";
    if (status === "cancelled") return "text-red-500";
    return "text-gray-400";
  };

  const frontContent = (
    <div className="flex items-center justify-center md:justify-between gap-4 md:gap-8 w-full">
      <Stethoscope size={64} className="md:size-20" />
      <div className="hidden md:flex flex-col gap-6 text-right">
        <div className="text-2xl">
          Doctors <br /> Available
        </div>
        <p className="text-4xl font-bold">{`${validDoctors.availableCount}/${doctorList.length}`}</p>
      </div>
      <p className="md:hidden text-4xl font-bold">{`${validDoctors.availableCount}/${doctorList.length}`}</p>
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
            <th scope="col" className="px-4 py-2">
              Doctor
            </th>
            <th scope="col" className="px-4 py-2">
              Slots
            </th>
            <th scope="col" className="px-4 py-2 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {doctorList.map((doc) => (
            <tr
              key={doc.id}
              className="bg-white/5 backdrop-blur-sm border-b border-white/10 hover:bg-white/10 :bg-gray-700/20 transition-colors"
            >
              <td className="px-4 py-2 font-medium">{doc.name}</td>
              <td className="px-4 py-2">
                {(doc.slots || []).length > 1 ? (
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 "
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onSlotSelection(doc.name, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select time
                    </option>
                    {(doc.slots || []).map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{doc.slots[0] || "N/A"}</span>
                )}
              </td>
              <td className="px-4 py-2 flex justify-center items-center gap-2">
                <CheckCircle
                  onClick={() => onStatusChange(doc.id, "checked-in")}
                  className={`cursor-pointer hover:text-green-500 ${
                    getStatusColor(doc.status) === "text-green-500"
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                />
                <XCircle
                  onClick={() => onStatusChange(doc.id, "cancelled")}
                  className={`cursor-pointer hover:text-red-500 ${
                    getStatusColor(doc.status) === "text-red-500"
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
    <FlippableCard frontContent={frontContent} backContent={backContent} />
  );
};

export default DoctorCard;
