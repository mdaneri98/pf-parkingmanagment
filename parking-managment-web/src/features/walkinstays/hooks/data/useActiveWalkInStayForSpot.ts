import { useMemo } from 'react';
import { useGetWalkInStaysByParkingLotQuery } from '@walkinstays/api/walkInStayApi';
import { isActiveWalkInStay } from '@walkinstays/utils/walkInStayUtils';
import type { WalkInStayResponse } from '@walkinstays/types';

interface UseActiveWalkInStayForSpotOptions {
  skip?: boolean;
}

/**
 * Hook to get the active walk-in stay for a specific spot
 * Queries all walk-in stays for the parking lot and filters for the active one on this spot
 */
export const useActiveWalkInStayForSpot = (
  spotId: number,
  parkingLotId: number,
  options: UseActiveWalkInStayForSpotOptions = {}
): {
  data: WalkInStayResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
} => {
  const { skip = false } = options;

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetWalkInStaysByParkingLotQuery(
    { parkingLotId },
    { skip }
  );

  const activeWalkInStay = useMemo(() => {
    if (!response?.data) return undefined;

    // Find active walk-in stay for this spot
    return response.data.find(
      (stay) => stay.spotId === spotId && isActiveWalkInStay(stay.status)
    );
  }, [response?.data, spotId]);

  return {
    data: activeWalkInStay,
    isLoading,
    isError,
    error,
  };
};

