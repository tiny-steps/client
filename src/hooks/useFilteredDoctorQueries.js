import { useQuery } from "@tanstack/react-query";
import { timingService } from "../services/timingService.js";
import { sessionService } from "../services/sessionService.js";
import { useGetAllDoctors } from "./useDoctorQueries.js";

// Hook to get doctors filtered by availability
export const useGetDoctorsWithAvailability = (params = {}, options = {}) => {
  const { branchId } = params;

  // First get all doctors
  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useGetAllDoctors(
    {
      size: 100,
      status: "ACTIVE",
      ...(branchId && { branchId }),
    },
    {
      enabled: options.enabled !== false,
    }
  );

  // Then get doctor IDs with availability
  const {
    data: doctorIdsWithAvailability,
    isLoading: availabilityLoading,
    error: availabilityError,
  } = useQuery({
    queryKey: ["doctors-with-availability", branchId],
    queryFn: () => timingService.getDoctorIdsWithAvailability(branchId),
    enabled: options.enabled !== false,
  });

  const doctors = doctorsData?.data?.content || [];
  const availabilityDoctorIds = doctorIdsWithAvailability || [];

  // Filter doctors to only include those with availability
  const filteredDoctors = doctors.filter((doctor) =>
    availabilityDoctorIds.includes(doctor.id)
  );

  return {
    data: {
      data: {
        content: filteredDoctors,
      },
    },
    isLoading: doctorsLoading || availabilityLoading,
    error: doctorsError || availabilityError,
  };
};

// Hook to get doctors filtered by sessions
export const useGetDoctorsWithSessions = (params = {}, options = {}) => {
  const { branchId } = params;

  // First get all doctors
  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useGetAllDoctors(
    {
      size: 100,
      status: "ACTIVE",
      ...(branchId && { branchId }),
    },
    {
      enabled: options.enabled !== false,
    }
  );

  // Then get doctor IDs with sessions
  const {
    data: doctorIdsWithSessions,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery({
    queryKey: ["doctors-with-sessions", branchId],
    queryFn: () => sessionService.getDoctorIdsWithSessions(branchId),
    enabled: options.enabled !== false,
  });

  const doctors = doctorsData?.data?.content || [];
  const sessionsDoctorIds = doctorIdsWithSessions || [];

  // Filter doctors to only include those with sessions
  const filteredDoctors = doctors.filter((doctor) =>
    sessionsDoctorIds.includes(doctor.id)
  );

  return {
    data: {
      data: {
        content: filteredDoctors,
      },
    },
    isLoading: doctorsLoading || sessionsLoading,
    error: doctorsError || sessionsError,
  };
};

// Hook to get doctors with both availability and sessions
export const useGetDoctorsWithAvailabilityAndSessions = (
  params = {},
  options = {}
) => {
  const { branchId } = params;

  // First get all doctors
  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useGetAllDoctors(
    {
      size: 100,
      status: "ACTIVE",
      ...(branchId && { branchId }),
    },
    {
      enabled: options.enabled !== false,
    }
  );

  // Get doctor IDs with availability
  const {
    data: doctorIdsWithAvailability,
    isLoading: availabilityLoading,
    error: availabilityError,
  } = useQuery({
    queryKey: ["doctors-with-availability", branchId],
    queryFn: () => timingService.getDoctorIdsWithAvailability(branchId),
    enabled: options.enabled !== false,
  });

  // Get doctor IDs with sessions
  const {
    data: doctorIdsWithSessions,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery({
    queryKey: ["doctors-with-sessions", branchId],
    queryFn: () => sessionService.getDoctorIdsWithSessions(branchId),
    enabled: options.enabled !== false,
  });

  const doctors = doctorsData?.data?.content || [];
  const availabilityDoctorIds = doctorIdsWithAvailability || [];
  const sessionsDoctorIds = doctorIdsWithSessions || [];

  // Filter doctors to only include those with both availability and sessions
  const filteredDoctors = doctors.filter(
    (doctor) =>
      availabilityDoctorIds.includes(doctor.id) &&
      sessionsDoctorIds.includes(doctor.id)
  );

  return {
    data: {
      data: {
        content: filteredDoctors,
      },
    },
    isLoading: doctorsLoading || availabilityLoading || sessionsLoading,
    error: doctorsError || availabilityError || sessionsError,
  };
};
