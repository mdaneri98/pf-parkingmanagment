import { useState, useEffect } from 'react';
import { Input } from '@shared/ui/components/Input';
import { Button } from '@shared/ui/components/Button';
import { ParkingSpotsGrid } from '@parking/components/spots/ParkingSpotsGrid';
import { EmptyState } from '@parking/components/common/EmptyState';
import { ErrorState } from '@parking/components/common/ErrorState';
import { LoadingSpinner } from '@shared/ui/components/LoadingSpinner';
import { useGetWalkInStayByLicensePlateQuery } from '@walkinstays/api/walkInStayApi';
import { useGetSpotsByParkingLotIdQuery } from '@parking/api/parkingApi';
import { PARKING_CONSTANTS } from '@parking/constants/parking';
import type { SpotDTO } from '@parking/types';
import { logger } from '@shared/utils/logger';

interface LicensePlateSearchProps {
  lotId: number;
  onSpotFound?: (spot: SpotDTO) => void;
  onSpotClick?: (spot: SpotDTO) => void;
}

export function LicensePlateSearch({ lotId, onSpotFound, onSpotClick }: LicensePlateSearchProps) {
  const [licensePlate, setLicensePlate] = useState('');
  const [searchTrigger, setSearchTrigger] = useState<string | null>(null);

  // Live search with 500ms debounce
  useEffect(() => {
    if (!licensePlate.trim()) {
      setSearchTrigger(null);
      return;
    }
    
    const timer = setTimeout(() => {
      logger.info('[LicensePlateSearch] Auto-triggering search for license plate', { 
        licensePlate: licensePlate.trim() 
      });
      setSearchTrigger(licensePlate.trim());
    }, 500);
    
    return () => clearTimeout(timer);
  }, [licensePlate]);

  const { 
    data: walkInStayData, 
    isLoading: isSearching, 
    isError: isSearchError,
    error: searchError 
  } = useGetWalkInStayByLicensePlateQuery(
    { licensePlate: searchTrigger!, parkingLotId: lotId },
    {
      skip: !searchTrigger,
    }
  );

  const { data: spotsData } = useGetSpotsByParkingLotIdQuery(
    { 
      parkingLotId: lotId, 
      page: 0, 
      size: PARKING_CONSTANTS.PAGINATION.FETCH_ALL_SIZE,
    },
    {
      skip: !walkInStayData?.data || walkInStayData.data.length === 0,
    }
  );

  // Debug logging
  useEffect(() => {
    logger.info('[LicensePlateSearch] Component state:', {
      lotId,
      searchTrigger,
      licensePlate,
      isSearching,
      isSearchError,
      searchError,
      walkInStayData,
      spotsData,
    });
  }, [lotId, searchTrigger, licensePlate, isSearching, isSearchError, searchError, walkInStayData, spotsData]);

  const handleSearch = () => {
    if (licensePlate.trim()) {
      logger.info('[LicensePlateSearch] Manual search triggered for license plate', { licensePlate: licensePlate.trim() });
      setSearchTrigger(licensePlate.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setLicensePlate('');
    setSearchTrigger(null);
  };

  // Get the first walk-in stay from the array (most recent)
  const walkInStay = walkInStayData?.data && walkInStayData.data.length > 0 
    ? walkInStayData.data[0] 
    : null;

  // Get all spots from the query result
  const allSpots = spotsData?.data?.content || [];

  // Find the spot from the parking lot data
  const foundSpot = walkInStay && allSpots.length > 0
    ? allSpots.find(spot => spot.id === walkInStay.spotId)
    : null;

  // Get all matching spots (in case there are multiple walk-in stays)
  const foundSpots = walkInStayData?.data && walkInStayData.data.length > 0 && allSpots.length > 0
    ? walkInStayData.data
        .map(stay => allSpots.find(spot => spot.id === stay.spotId))
        .filter((spot): spot is SpotDTO => spot !== undefined)
    : [];

  // Debug logging for spot lookup
  useEffect(() => {
    if (walkInStayData?.data && walkInStayData.data.length > 0) {
      const stay = walkInStayData.data[0];
      logger.info('[LicensePlateSearch] Walk-in stay found:', {
        totalResults: walkInStayData.data.length,
        walkInStayId: stay.id,
        spotId: stay.spotId,
        vehicleLicensePlate: stay.vehicleLicensePlate,
      });
    }

    if (allSpots.length > 0) {
      logger.info('[LicensePlateSearch] Parking lot spots:', {
        totalSpots: allSpots.length,
        spotIds: allSpots.map(s => s.id),
      });
    }

    if (walkInStay && allSpots.length > 0) {
      const matchingSpot = allSpots.find(
        spot => spot.id === walkInStay.spotId
      );
      logger.info('[LicensePlateSearch] Spot lookup result:', {
        lookingForSpotId: walkInStay.spotId,
        foundSpot: matchingSpot,
        foundSpotId: matchingSpot?.id,
        foundSpotCode: matchingSpot?.code,
      });
    }
  }, [walkInStayData, spotsData, walkInStay, allSpots]);

  // Call onSpotFound callback when spot is found
  if (foundSpot && onSpotFound) {
    onSpotFound(foundSpot);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          License Plate Search
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Find vehicles by their license plate number
        </p>
      </div>

      {/* Search Card */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-8 shadow-sm">
        {/* Search Input Section */}
        <div className="space-y-2 mb-8">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="License Plate"
                placeholder="e.g., ABC123"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
                autoFocus
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!licensePlate.trim() || isSearching}
              loading={isSearching}
            >
              Search
            </Button>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Start typing to search automatically
          </p>
        </div>

        {/* Search Results Section */}
        {!searchTrigger && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-700 mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Ready to Search
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Enter a license plate number above to find the vehicle's parking spot
            </p>
          </div>
        )}

        {isSearching && (
          <div className="flex flex-col justify-center items-center py-16">
            <LoadingSpinner />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
              Searching for "{searchTrigger}"...
            </p>
          </div>
        )}

        {(isSearchError || (searchTrigger && walkInStayData?.data && walkInStayData.data.length === 0)) && (
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-50 dark:bg-error-900/20 mb-4">
              <svg className="w-8 h-8 text-error-500 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Vehicle Not Found
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              No active parking session found for <span className="font-medium text-neutral-900 dark:text-neutral-100">"{searchTrigger}"</span>. 
              The vehicle may not be parked in this lot or the license plate may be incorrect.
            </p>
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={handleClearSearch}
              >
                Try Another Search
              </Button>
            </div>
          </div>
        )}

        {foundSpots.length > 0 && !isSearching && (
          <div className="space-y-6">
            {/* Parking Spots Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Parking Spots
                </h4>
              </div>
              <ParkingSpotsGrid 
                spots={foundSpots}
                onSpotClick={onSpotClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

