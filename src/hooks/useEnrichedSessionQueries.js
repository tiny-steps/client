import { useQuery } from "@tanstack/react-query";
import { sessionService } from "../services/sessionService.js";
import { doctorService } from "../services/doctorService.js";
import { addressService } from "../services/addressService.js";
import { timingService } from "../services/timingService.js";

// Helper function to enrich a single session with doctor and practice details
const enrichSessionWithDetails = async (session) => {
  try {
    const enrichedSession = { ...session };

    // Fetch doctor details if doctorId exists
    if (session.doctorId) {
      try {
        console.log(
          `🔍 Enriching session ${session.id} with doctor ${session.doctorId}`
        );
        const doctorResponse = await doctorService.getDoctorById(
          session.doctorId
        );
        console.log(
          `🔍 Doctor response for ${session.doctorId}:`,
          doctorResponse
        );
        enrichedSession.doctor = {
          id: doctorResponse.data.id,
          name: doctorResponse.data.name || "Unknown Doctor",
          email: doctorResponse.data.email || "",
          phone: doctorResponse.data.phone || "",
          speciality: doctorResponse.data.speciality || "",
        };
        console.log(`🔍 Enriched doctor:`, enrichedSession.doctor);
      } catch (error) {
        console.warn(`Failed to fetch doctor ${session.doctorId}:`, error);
        enrichedSession.doctor = {
          id: session.doctorId,
          name: "Unknown Doctor",
        };
      }
    }

    // Fetch practice/address details if branchId exists
    if (session.branchId) {
      try {
        const addressResponse = await addressService.getAddressById(
          session.branchId
        );
        enrichedSession.practice = {
          id: addressResponse.id,
          name:
            addressResponse.name ||
            addressResponse.metadata?.branchName ||
            `${addressResponse.city}, ${addressResponse.state}` ||
            "Unknown Practice",
          city: addressResponse.city || "",
          state: addressResponse.state || "",
          type: addressResponse.type || "",
        };
      } catch (error) {
        console.warn(`Failed to fetch practice ${session.branchId}:`, error);
        enrichedSession.practice = {
          id: session.branchId,
          name: "Unknown Practice",
        };
      }
    }

    return enrichedSession;
  } catch (error) {
    console.error("Error enriching session:", error);
    return session; // Return original session if enrichment fails
  }
};

// Helper function to enrich multiple sessions
const enrichSessionsWithDetails = async (sessions) => {
  if (!sessions || sessions.length === 0) return [];

  // Enrich all sessions in parallel
  const enrichedSessions = await Promise.all(
    sessions.map((session) => enrichSessionWithDetails(session))
  );

  return enrichedSessions;
};

// Hook to get all sessions with enriched doctor and practice details
export const useGetAllEnrichedSessions = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["enrichedSessions", params],
    queryFn: async () => {
      const response = await sessionService.getAllSessions(params);

      if (response.content) {
        console.log(
          "🔍 Raw sessions from API:",
          response.content.map((s) => ({ id: s.id, doctorId: s.doctorId }))
        );

        // Get doctors with availability to filter sessions
        const doctorsWithAvailability =
          await timingService.getDoctorIdsWithAvailability(params.branchId);

        console.log("🔍 Doctors with availability:", doctorsWithAvailability);

        // Filter sessions to only include those from doctors with availability
        // TEMPORARILY DISABLED FOR DEBUGGING
        const filteredSessions = response.content; // .filter((session) => doctorsWithAvailability.includes(session.doctorId));

        console.log(
          "🔍 Filtered sessions:",
          filteredSessions.map((s) => ({ id: s.id, doctorId: s.doctorId }))
        );

        const enrichedSessions = await enrichSessionsWithDetails(
          filteredSessions
        );

        console.log(
          "🔍 Final enriched sessions:",
          enrichedSessions.map((s) => ({
            id: s.id,
            doctorId: s.doctorId,
            doctorName: s.doctor?.name,
          }))
        );

        return {
          ...response,
          content: enrichedSessions,
        };
      }

      return response;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    cacheTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    ...options,
  });
};

// Hook to get a single enriched session by ID
export const useGetEnrichedSessionById = (id, options = {}) => {
  return useQuery({
    queryKey: ["enrichedSession", id],
    queryFn: async () => {
      const session = await sessionService.getSessionById(id);
      return enrichSessionWithDetails(session);
    },
    enabled: !!id && options.enabled !== false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    cacheTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    ...options,
  });
};
