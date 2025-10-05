import { useState, useMemo } from 'react';
import { useGetSpotsByParkingLotIdQuery } from '@parking/api/parkingApi';
import { PARKING_CONSTANTS } from '@parking/constants/parking';
import { ParkingService } from '@parking/services/parkingService';
import type { SpotFilters, AvailableFilters } from '@parking/types';

export function useSpotsData(lotId: number) {
  const [spotFilters, setSpotFilters] = useState<SpotFilters>({});

  
  const allSpotsQuery = useGetSpotsByParkingLotIdQuery(
    { 
      parkingLotId: lotId, 
      page: 0, 
      size: PARKING_CONSTANTS.PAGINATION.FETCH_ALL_SIZE, // FIXME: Remove this once we have a proper pagination
    },
    {
      pollingInterval: PARKING_CONSTANTS.POLLING.DASHBOARD_INTERVAL,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      skip: !lotId || isNaN(lotId),
    }
  );

  const allSpots = allSpotsQuery.data?.data?.content || [];

  // Apply client-side filtering to the complete dataset
  const spots = useMemo(() => {
    if (Object.keys(spotFilters).length === 0) {
      return allSpots;
    }
    return ParkingService.filterSpots(allSpots, spotFilters);
  }, [allSpots, spotFilters]);

  const availableFilters: AvailableFilters = useMemo(() => {
    return ParkingService.generateFilterOptions(allSpots);
  }, [allSpots]);

  return {
    spots: {
      data: { data: { content: spots } },
      isLoading: allSpotsQuery.isLoading,
      isError: allSpotsQuery.isError,
      error: allSpotsQuery.error,
      refetch: allSpotsQuery.refetch,
    },
    allSpots: {
      data: { data: { content: allSpots } },
      isLoading: allSpotsQuery.isLoading,
      isError: allSpotsQuery.isError,
      error: allSpotsQuery.error,
      refetch: allSpotsQuery.refetch,
    },

    // Derived data
    spotsData: spots,
    allSpotsData: allSpots,
    availableFilters,

    // Filters
    spotFilters,
    setSpotFilters,

    // Utilities
    refetchSpots: allSpotsQuery.refetch,
  };
}
