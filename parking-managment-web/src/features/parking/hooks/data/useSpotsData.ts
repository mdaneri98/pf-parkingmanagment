import { useState, useMemo, useEffect } from 'react';
import { useGetSpotsByParkingLotIdQuery } from '@parking/api/parkingApi';
import { PARKING_CONSTANTS } from '@parking/constants/parking';
import { ParkingService } from '@parking/services/parkingService';
import type { SpotFilters, AvailableFilters } from '@parking/types';
import { useNotification } from '@shared/contexts/NotificationContext';
import { useErrorHandler } from '@shared/utils/errorHandling';

export function useSpotsData(lotId: number) {
  const [spotFilters, setSpotFilters] = useState<SpotFilters>({});
  const { showNotification } = useNotification();
  const { getUserFriendlyMessage } = useErrorHandler();

  
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

  // Show error notification when spots data fails to load
  useEffect(() => {
    if (allSpotsQuery.isError && allSpotsQuery.error) {
      const errorMessage = getUserFriendlyMessage(allSpotsQuery.error);
      showNotification('error', `Failed to load parking spots: ${errorMessage}`);
    }
  }, [allSpotsQuery.isError, allSpotsQuery.error, showNotification, getUserFriendlyMessage]);

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
