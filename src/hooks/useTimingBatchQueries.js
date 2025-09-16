import { useQuery } from "@tanstack/react-query";
import { timingService } from "../services/timingService.js";

export const timingBatchKeys = {
  all: ["timingBatch"],
  dateRange: (doctorId, startDate, endDate, practiceId) => [
    ...timingBatchKeys.all,
    "dateRange",
    doctorId,
    startDate,
    endDate,
    practiceId,
  ],
};

/**
 * Hook to efficiently fetch timeslots for multiple dates in a range
 * This optimizes the weekly and monthly calendar views by batching API calls
 */
export const useGetTimeSlotsForDateRange = (
  doctorId,
  startDate,
  endDate,
  practiceId = null,
  branchId = null,
  options = {}
) => {
  return useQuery({
    queryKey: timingBatchKeys.dateRange(
      doctorId,
      startDate,
      endDate,
      practiceId
    ),
    queryFn: async () => {
      if (!doctorId || !startDate || !endDate) {
        return { data: {} };
      }

      const timeSlotsMap = {};
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Generate array of dates between start and end
      const dates = [];
      const currentDate = new Date(start);

      while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split("T")[0];
        dates.push(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Batch fetch timeslots for all dates
      const promises = dates.map(async (date) => {
        try {
          const response = await timingService.getTimeSlots(
            doctorId,
            date,
            practiceId,
            branchId
          );
          return { date, slots: response.data?.slots || [] };
        } catch (error) {
          console.warn(`Failed to fetch timeslots for ${date}:`, error);
          return { date, slots: [] };
        }
      });

      const results = await Promise.allSettled(promises);

      // Process results and build timeslots map
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          const { date, slots } = result.value;
          timeSlotsMap[date] = slots;
        }
      });

      return { data: timeSlotsMap };
    },
    enabled: !!doctorId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Hook to get timeslots for a specific week
 */
export const useGetTimeSlotsForWeek = (
  doctorId,
  weekStartDate,
  practiceId = null,
  branchId = null,
  options = {}
) => {
  const startDate = weekStartDate;
  const endDate = new Date(weekStartDate);
  endDate.setDate(endDate.getDate() + 6); // Add 6 days to get the full week

  return useGetTimeSlotsForDateRange(
    doctorId,
    startDate.toISOString().split("T")[0],
    endDate.toISOString().split("T")[0],
    practiceId,
    branchId,
    options
  );
};

/**
 * Hook to get timeslots for a specific month
 */
export const useGetTimeSlotsForMonth = (
  doctorId,
  monthDate,
  practiceId = null,
  branchId = null,
  options = {}
) => {
  const startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const endDate = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0
  );

  return useGetTimeSlotsForDateRange(
    doctorId,
    startDate.toISOString().split("T")[0],
    endDate.toISOString().split("T")[0],
    practiceId,
    branchId,
    options
  );
};
