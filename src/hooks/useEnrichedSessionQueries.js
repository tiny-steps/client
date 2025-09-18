import { useQuery } from "@tanstack/react-query";
import { sessionService } from "../services/sessionService.js";
import { doctorService } from "../services/doctorService.js";
import { addressService } from "../services/addressService.js";

// Helper function to enrich a single session with doctor and practice details
const enrichSessionWithDetails = async (session) => {
  try {
    const enrichedSession = { ...session };

    // Fetch doctor details if doctorId exists
    if (session.doctorId) {
      try {
        const doctorResponse = await doctorService.getDoctorById(
          session.doctorId
        );
        enrichedSession.doctor = {
          id: doctorResponse.id,
          name: doctorResponse.name || "Unknown Doctor",
          email: doctorResponse.email || "",
          phone: doctorResponse.phone || "",
          speciality: doctorResponse.speciality || "",
        };
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
        const enrichedSessions = await enrichSessionsWithDetails(
          response.content
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
