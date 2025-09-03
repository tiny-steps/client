import React from "react";
import { Stethoscope, CheckCircle, XCircle } from "lucide-react";
import FlippableCard from "../FlipableCard.jsx";
import { useWindowSize } from "../../hooks/useWindowSize.js";

const DoctorCard = ({ doctors, onStatusChange, onSlotSelection }) => {
  const { isMobile, isTablet } = useWindowSize();
  // Ensure doctors data is valid
  const validDoctors = doctors || { availableCount: 0, list: [] };
  const doctorList = validDoctors.list || [];
  const getStatusColor = (status) => {
    if (status === "checked-in") return "text-green-500";
    if (status === "cancelled") return "text-red-500";
    return "text-gray-400";
  };

  const frontContent = (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
      <Stethoscope 
        size={isMobile ? 40 : isTablet ? 48 : 56} 
        className="text-green-600 transition-all duration-200" 
      />
      <div className="text-center w-full">
        <div className={`font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight ${
          isMobile ? 'text-base' : 'text-lg sm:text-xl'
        }`}>
          Doctor Availability
        </div>
        <div className={`flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm ${
          isMobile ? 'flex-col space-y-2' : 'flex-row'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
            <span className="truncate">
              Available: {validDoctors.availableCount || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
            <span className="truncate">
              Busy: {(validDoctors.list?.length || 0) - (validDoctors.availableCount || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className={`font-semibold text-gray-800 ${
          isMobile ? 'text-base' : 'text-lg'
        }`}>
          Doctor Slots
        </h3>
        <span className="text-xs sm:text-sm text-gray-600">
          {doctorList.length} doctors
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        {doctorList.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm text-center px-4">
            No doctors available
          </div>
        ) : (
          <div className="space-y-2">
            {isMobile ? (
              // Mobile card layout
              <div className="space-y-2">
                {doctorList.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium text-gray-800 truncate flex-1 mr-2">
                        {doc.name}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <CheckCircle
                          onClick={() => onStatusChange(doc.id, "checked-in")}
                          className={`cursor-pointer hover:text-green-500 w-5 h-5 ${
                            getStatusColor(doc.status) === "text-green-500"
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        />
                        <XCircle
                          onClick={() => onStatusChange(doc.id, "cancelled")}
                          className={`cursor-pointer hover:text-red-500 w-5 h-5 ${
                            getStatusColor(doc.status) === "text-red-500"
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div className="mb-1">
                        <span className="font-medium">Slots:</span>
                      </div>
                      {(doc.slots || []).length > 1 ? (
                        <select
                          className="bg-white border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
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
                        <span className="text-gray-800">{doc.slots[0] || "N/A"}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop table layout
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-white/10 backdrop-blur-sm border-b border-white/20">
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
                        className="bg-white/5 backdrop-blur-sm border-b border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <td className="px-4 py-2 font-medium truncate max-w-24">{doc.name}</td>
                        <td className="px-4 py-2">
                          {(doc.slots || []).length > 1 ? (
                            <select
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
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
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <FlippableCard frontContent={frontContent} backContent={backContent} />
  );
};

export default DoctorCard;
