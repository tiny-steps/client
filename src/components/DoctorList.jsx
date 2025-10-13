import React, { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useGetAllDoctors,
  useActivateDoctor,
  useDeactivateDoctor,
} from "../hooks/useDoctorQueries.js";
import { useGetUserById } from "../hooks/useUserQueries.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import useUserStore from "../store/useUserStore.js";
import useAddressStore from "../store/useAddressStore.js";

const DoctorList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const { role } = useUserStore();

  // Get the selected address ID to use as branchId
  const selectedAddressId = useAddressStore((state) => state.selectedAddressId);

  // Client-side search state
  const [searchInputs, setSearchInputs] = useState({
    name: "",
    speciality: "",
    isVerified: "",
    minRating: "",
    maxRating: "",
    status: "active", // Add status filter with default to active
  });

  // Fetch doctors based on status filter
  const fetchParams = {
    page: currentPage,
    size: 1000, // Fetch all for client-side filtering
    branchId: selectedAddressId, // Use selected address ID as branchId
  };

  // Apply status filter
  if (searchInputs.status === "active") {
    fetchParams.status = "ACTIVE";
  } else if (searchInputs.status === "inactive") {
    fetchParams.status = "INACTIVE";
  }
  // If status is "all", don't set status parameter to fetch both active and inactive

  const { data, isLoading, error, refetch } = useGetAllDoctors(fetchParams);

  const activateDoctorMutation = useActivateDoctor();
  const deactivateDoctorMutation = useDeactivateDoctor();

  // Filter doctors based on search criteria
  const filteredDoctors = useMemo(() => {
    const allDoctors = data?.content || [];

    if (
      !searchInputs.name &&
      !searchInputs.speciality &&
      !searchInputs.isVerified &&
      !searchInputs.minRating &&
      !searchInputs.maxRating
    ) {
      return allDoctors;
    }

    return allDoctors.filter((doctor) => {
      // Name filter
      if (
        searchInputs.name &&
        !doctor.name?.toLowerCase().includes(searchInputs.name.toLowerCase())
      ) {
        return false;
      }

      // Speciality filter - search through specializations array
      if (searchInputs.speciality) {
        const hasMatchingSpeciality = doctor.specializations?.some((spec) =>
          spec.speciality
            ?.toLowerCase()
            .includes(searchInputs.speciality.toLowerCase())
        );
        if (!hasMatchingSpeciality) {
          return false;
        }
      }

      // Verification filter
      if (
        searchInputs.isVerified &&
        doctor.isVerified !== (searchInputs.isVerified === "true")
      ) {
        return false;
      }

      // Rating filters
      if (
        searchInputs.minRating &&
        doctor.ratingAverage < parseFloat(searchInputs.minRating)
      ) {
        return false;
      }
      if (
        searchInputs.maxRating &&
        doctor.ratingAverage > parseFloat(searchInputs.maxRating)
      ) {
        return false;
      }

      return true;
    });
  }, [data?.content, searchInputs]);

  // Pagination
  const paginatedDoctors = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredDoctors.slice(startIndex, startIndex + pageSize);
  }, [filteredDoctors, currentPage, pageSize]);

  const pagination = useMemo(
    () => ({
      currentPage,
      totalPages: Math.ceil(filteredDoctors.length / pageSize),
      totalElements: filteredDoctors.length,
      size: pageSize,
    }),
    [filteredDoctors.length, currentPage, pageSize]
  );

  const clearSearch = () => {
    setSearchInputs({
      name: "",
      speciality: "",
      isVerified: "",
      minRating: "",
      maxRating: "",
      status: "active", // Reset to active
    });
    setCurrentPage(0);
  };

  const handleInputChange = (field, value) => {
    setSearchInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(0);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Doctor Access Issue
          </h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">This might be due to:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Backend authorization requirements</li>
              <li>Network connectivity issues</li>
              <li>Service unavailability</li>
            </ul>
          </div>
          <div className="mt-4 space-x-2">
            <Button onClick={() => refetch()} variant="default">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const hasActiveFilters = Object.values(searchInputs).some((v) => v);

  return (
    <div className="p-6 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <Button onClick={() => navigate({ to: "/doctors/add" })}>
          Add New Doctor
        </Button>
      </div>

      {/* Search Filters */}
      <Card className="mt-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              name="name"
              placeholder="Search by name..."
              value={searchInputs.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Speciality</label>
            <Input
              name="speciality"
              placeholder="Search by speciality..."
              value={searchInputs.speciality}
              onChange={(e) => handleInputChange("speciality", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={searchInputs.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="all">All Doctors</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Verification Status
            </label>
            <select
              name="isVerified"
              value={searchInputs.isVerified}
              onChange={(e) => handleInputChange("isVerified", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Min Rating</label>
            <Input
              name="minRating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="0.0"
              value={searchInputs.minRating}
              onChange={(e) => handleInputChange("minRating", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Rating</label>
            <Input
              name="maxRating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="5.0"
              value={searchInputs.maxRating}
              onChange={(e) => handleInputChange("maxRating", e.target.value)}
            />
          </div>
        </div>
        {hasActiveFilters && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredDoctors.length} of {data?.totalElements || 0} doctors
              found
            </span>
            <Button onClick={clearSearch} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Doctors List */}
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading doctors...</p>
          </div>
        ) : paginatedDoctors.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">
              {hasActiveFilters
                ? "No doctors found matching your search criteria."
                : "No doctors found."}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearSearch} className="mt-4">
                Clear Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onEdit={() => navigate({ to: `/doctors/edit/${doctor.id}` })}
                onActivate={() => activateDoctorMutation.mutate(doctor.id)}
                onDeactivate={() => deactivateDoctorMutation.mutate(doctor.id)}
                canEdit={role === "ADMIN"}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {paginatedDoctors.length} of {pagination.totalElements}{" "}
            doctors
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <span className="px-3 py-2 text-sm">
              Page {currentPage + 1} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(pagination.totalPages - 1, prev + 1)
                )
              }
              disabled={currentPage === pagination.totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Doctor Card Component
const DoctorCard = ({ doctor, onEdit, onActivate, onDeactivate, canEdit }) => {
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Fetch user data when component mounts
  React.useEffect(() => {
    if (doctor.userId) {
      setIsLoadingUser(true);
      fetch(`/api/v1/users/${doctor.userId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            setUserData(data.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        })
        .finally(() => {
          setIsLoadingUser(false);
        });
    }
  }, [doctor.userId]);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{doctor.name}</CardTitle>
            <div className="flex gap-2 mt-2">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  doctor.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {doctor.isVerified ? "Verified" : "Not Verified"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  doctor.status === "ACTIVE"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {doctor.status}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Speciality:</strong>{" "}
            {doctor.specializations && doctor.specializations.length > 0
              ? doctor.specializations.map((spec) => spec.speciality).join(", ")
              : "N/A"}
          </p>
          <p className="text-sm">
            <strong>Experience:</strong> {doctor.experienceYears} years
          </p>

          {/* User Contact Information */}
          {isLoadingUser ? (
            <p className="text-sm text-gray-500">Loading contact info...</p>
          ) : userData ? (
            <>
              <p className="text-sm">
                <strong>Email:</strong> {userData.email || "N/A"}
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> {userData.phone || "N/A"}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm">
                <strong>Email:</strong> {doctor.email || "N/A"}
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> {doctor.phone || "N/A"}
              </p>
            </>
          )}

          {doctor.remarks && (
            <p className="text-sm text-gray-600 mt-2">{doctor.remarks}</p>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {canEdit && (
            <Button onClick={onEdit} variant="outline" size="sm">
              Edit
            </Button>
          )}
          {canEdit && doctor.status === "ACTIVE" && (
            <Button onClick={onDeactivate} variant="outline" size="sm">
              Deactivate
            </Button>
          )}
          {canEdit && doctor.status === "INACTIVE" && (
            <Button onClick={onActivate} variant="outline" size="sm">
              Activate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorList;
