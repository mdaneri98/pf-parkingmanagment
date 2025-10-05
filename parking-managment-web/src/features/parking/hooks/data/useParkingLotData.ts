import { useGetParkingLotByIdQuery } from '@parking/api/parkingApi';
import { PARKING_CONSTANTS } from '@parking/constants/parking';

export function useParkingLotData(lotId: number) {
  const query = useGetParkingLotByIdQuery(lotId, {
    pollingInterval: PARKING_CONSTANTS.POLLING.DASHBOARD_INTERVAL,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !lotId || isNaN(lotId),
  });

  return {
    lot: query.data?.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
