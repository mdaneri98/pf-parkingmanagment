import { store } from '../../stores/store';
import { parkingApi } from '../../features/parking/api/parkingApi';
import { setSelectedParkingLotId } from '../../features/parking/slice/parkingSlice';
import { appStorage } from '../utils/storage';
import { logger } from '../utils/logger';
import { AppErrorHandler, ErrorCodes } from '../utils/errorHandling';
import type { ParkingLotResponse } from '../../features/parking/types';

export class ParkingService {
  /**
   * Get parking lots for the current user
   */
  async getParkingLots(): Promise<ParkingLotResponse[]> {
    try {
      logger.debug('Fetching parking lots for current user');
      
      const result = await store.dispatch(
        parkingApi.endpoints.getParkingLots.initiate()
      );
      
      if (result.error) {
        throw AppErrorHandler.createError(
          'Failed to fetch parking lots',
          ErrorCodes.API_SERVER_ERROR,
          { service: 'ParkingService', action: 'getParkingLots' }
        );
      }

      const lots = result.data?.data || [];
      logger.info('Successfully fetched parking lots', { count: lots.length });
      
      return lots;
    } catch (error) {
      logger.error('Error fetching parking lots', { error });
      throw AppErrorHandler.handleError(error, {
        service: 'ParkingService',
        action: 'getParkingLots',
      });
    }
  }

  /**
   * Get parking lot by ID
   */
  async getParkingLotById(id: number): Promise<ParkingLotResponse | null> {
    try {
      logger.debug('Fetching parking lot by ID', { lotId: id });
      
      const result = await store.dispatch(
        parkingApi.endpoints.getParkingLotById.initiate(id)
      );
      
      if (result.error) {
        if (result.error.status === 404) {
          throw AppErrorHandler.createError(
            'Parking lot not found',
            ErrorCodes.PARKING_LOT_NOT_FOUND,
            { service: 'ParkingService', action: 'getParkingLotById', lotId: id }
          );
        }
        
        throw AppErrorHandler.createError(
          'Failed to fetch parking lot',
          ErrorCodes.API_SERVER_ERROR,
          { service: 'ParkingService', action: 'getParkingLotById', lotId: id }
        );
      }

      const lot = result.data?.data || null;
      logger.info('Successfully fetched parking lot', { lotId: id, found: !!lot });
      
      return lot;
    } catch (error) {
      logger.error('Error fetching parking lot by ID', { lotId: id, error });
      throw AppErrorHandler.handleError(error, {
        service: 'ParkingService',
        action: 'getParkingLotById',
        lotId: id,
      });
    }
  }

  /**
   * Get managed parking lots for current user
   */
  async getManagedParkingLots(userId: number): Promise<ParkingLotResponse[]> {
    try {
      const allLots = await this.getParkingLots();
      const managedLots = allLots.filter(lot => lot.managerId === userId);
      
      logger.info('Filtered managed parking lots', {
        userId,
        totalLots: allLots.length,
        managedLots: managedLots.length,
      });
      
      return managedLots;
    } catch (error) {
      logger.error('Error getting managed parking lots', { userId, error });
      throw AppErrorHandler.handleError(error, {
        service: 'ParkingService',
        action: 'getManagedParkingLots',
        userId,
      });
    }
  }

  /**
   * Select a parking lot and persist the selection
   */
  selectParkingLot(lotId: number): void {
    try {
      logger.info('Selecting parking lot', { lotId });
      
      // Update Redux state
      store.dispatch(setSelectedParkingLotId(lotId));
      
      // Persist to localStorage
      const success = appStorage.setSelectedParkingLotId(lotId);
      if (!success) {
        logger.warn('Failed to persist selected parking lot to storage', { lotId });
      }
      
      logger.debug('Parking lot selection completed', { lotId, persisted: success });
    } catch (error) {
      logger.error('Error selecting parking lot', { lotId, error });
      throw AppErrorHandler.handleError(error, {
        service: 'ParkingService',
        action: 'selectParkingLot',
        lotId,
      });
    }
  }

  /**
   * Get the currently selected parking lot ID
   */
  getSelectedParkingLotId(): number | null {
    try {
      const state = store.getState();
      const stateId = state.parking.selectedParkingLotId;
      const storageId = appStorage.getSelectedParkingLotId();
      
      // Prefer state over storage, but sync if different
      if (stateId !== storageId && stateId !== null) {
        appStorage.setSelectedParkingLotId(stateId);
        return stateId;
      }
      
      return stateId || storageId;
    } catch (error) {
      logger.error('Error getting selected parking lot ID', { error });
      return null;
    }
  }

  /**
   * Clear parking lot selection
   */
  clearSelection(): void {
    try {
      logger.info('Clearing parking lot selection');
      
      // Clear Redux state
      store.dispatch(setSelectedParkingLotId(null));
      
      // Clear from localStorage
      appStorage.clearSelectedParkingLotId();
      
      logger.debug('Parking lot selection cleared');
    } catch (error) {
      logger.error('Error clearing parking lot selection', { error });
      throw AppErrorHandler.handleError(error, {
        service: 'ParkingService',
        action: 'clearSelection',
      });
    }
  }

  /**
   * Calculate parking lot metrics
   */
  calculateMetrics(lot: ParkingLotResponse) {
    try {
      const capacity = lot.spots?.length ?? 0;
      const available = lot.spots?.filter(spot => spot.isAvailable).length ?? 0;
      const inUse = capacity - available;
      const occupancy = capacity > 0 ? Math.round((inUse / capacity) * 100) : 0;
      
      const metrics = { capacity, available, inUse, occupancy };
      
      logger.debug('Calculated parking lot metrics', {
        lotId: lot.id,
        ...metrics,
      });
      
      return metrics;
    } catch (error) {
      logger.error('Error calculating parking lot metrics', { lotId: lot.id, error });
      return { capacity: 0, available: 0, inUse: 0, occupancy: 0 };
    }
  }

  /**
   * Validate user access to parking lot
   */
  async validateAccess(lotId: number, userId: number): Promise<boolean> {
    try {
      const lot = await this.getParkingLotById(lotId);
      
      if (!lot) {
        return false;
      }
      
      const hasAccess = lot.managerId === userId;
      
      if (!hasAccess) {
        throw AppErrorHandler.createError(
          'Access denied to parking lot',
          ErrorCodes.PARKING_LOT_ACCESS_DENIED,
          { service: 'ParkingService', action: 'validateAccess', lotId, userId }
        );
      }
      
      return true;
    } catch (error) {
      logger.error('Error validating parking lot access', { lotId, userId, error });
      throw AppErrorHandler.handleError(error, {
        service: 'ParkingService',
        action: 'validateAccess',
        lotId,
        userId,
      });
    }
  }
}

// Create singleton instance
export const parkingService = new ParkingService();

export default parkingService;
