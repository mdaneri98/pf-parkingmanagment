import { useMemo } from 'react';
import type { SpotDTO, DashboardMetrics } from '@parking/types';
import { ParkingService } from '@parking/services/parkingService';

export function useDashboardMetrics(allSpots: SpotDTO[]): DashboardMetrics {
  return useMemo(() => {
    return ParkingService.calculateDashboardMetrics(allSpots);
  }, [allSpots]);
}
