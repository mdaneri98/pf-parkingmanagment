import { useMemo, useEffect } from 'react';
import { useGetPricesByParkingLotIdQuery } from '@prices/api/pricesApi';
import type { PriceSearchFilters, PriceDisplayData } from '@prices/types';
import { enhancePriceForDisplay, sortPrices } from '@prices/utils/priceUtils';
import { useNotification } from '@shared/contexts/NotificationContext';
import { useErrorHandler } from '@shared/utils/errorHandling';

interface UsePricesDataOptions {
  parkingLotId: number;
  filters?: PriceSearchFilters;
  sortBy?: 'price' | 'vehicleType' | 'validFrom' | 'validTo';
  sortOrder?: 'asc' | 'desc';
  enabled?: boolean;
}

export const usePricesData = ({
  parkingLotId,
  filters = {},
  sortBy = 'price',
  sortOrder = 'asc',
  enabled = true,
}: UsePricesDataOptions) => {
  const { showNotification } = useNotification();
  const { getUserFriendlyMessage } = useErrorHandler();
  
  // Build query parameters
  const queryParams = useMemo(() => ({
    parkingLotId,
    ...filters,
  }), [parkingLotId, filters]);

  // Fetch prices data
  const {
    data: rawResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetPricesByParkingLotIdQuery(queryParams, {
    skip: !enabled || !parkingLotId,
    refetchOnMountOrArgChange: true,
  });

  // Process and enhance the data
  const processedData = useMemo(() => {
    if (!rawResponse?.data) {
      return {
        prices: [],
        activePrices: [],
        expiredPrices: [],
        upcomingPrices: [],
        totalCount: 0,
      };
    }

    // Enhance each price with display data
    const enhancedPrices = rawResponse.data.map(enhancePriceForDisplay);
    
    // Sort the prices
    const sortedPrices = sortPrices(enhancedPrices, sortBy, sortOrder);

    // Categorize prices by status
    const now = new Date();
    const activePrices = sortedPrices.filter(price => price.isActive);
    const expiredPrices = sortedPrices.filter(price => price.isExpired);
    const upcomingPrices = sortedPrices.filter(price => 
      !price.isActive && !price.isExpired && new Date(price.validFrom) > now
    );

    return {
      prices: sortedPrices,
      activePrices,
      expiredPrices,
      upcomingPrices,
      totalCount: sortedPrices.length,
    };
  }, [rawResponse?.data, sortBy, sortOrder]);

  // Group prices by vehicle type
  const pricesByVehicleType = useMemo(() => {
    const grouped: Record<string, PriceDisplayData[]> = {};
    
    processedData.prices.forEach(price => {
      const vehicleType = price.vehicleType;
      if (!grouped[vehicleType]) {
        grouped[vehicleType] = [];
      }
      grouped[vehicleType].push(price);
    });

    return grouped;
  }, [processedData.prices]);

  // Statistics
  const statistics = useMemo(() => {
    const prices = processedData.prices;
    
    if (prices.length === 0) {
      return {
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        priceRange: 0,
        vehicleTypeCount: 0,
        activeRulesCount: 0,
        expiredRulesCount: 0,
        upcomingRulesCount: 0,
      };
    }

    const priceValues = prices.map(p => p.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const averagePrice = priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length;
    
    return {
      averagePrice: Number(averagePrice.toFixed(2)),
      minPrice,
      maxPrice,
      priceRange: maxPrice - minPrice,
      vehicleTypeCount: Object.keys(pricesByVehicleType).length,
      activeRulesCount: processedData.activePrices.length,
      expiredRulesCount: processedData.expiredPrices.length,
      upcomingRulesCount: processedData.upcomingPrices.length,
    };
  }, [processedData, pricesByVehicleType]);

  // Show error notification when prices data fails to load
  useEffect(() => {
    if (isError && error) {
      const errorMessage = getUserFriendlyMessage(error);
      showNotification('error', `Failed to load pricing data: ${errorMessage}`);
    }
  }, [isError, error, showNotification, getUserFriendlyMessage]);

  return {
    // Data
    prices: processedData.prices,
    activePrices: processedData.activePrices,
    expiredPrices: processedData.expiredPrices,
    upcomingPrices: processedData.upcomingPrices,
    pricesByVehicleType,
    totalCount: processedData.totalCount,
    
    // Statistics
    statistics,
    
    // Query state
    isLoading,
    isError,
    isFetching,
    error,
    
    // Actions
    refetch,
    
    // Helpers
    isEmpty: processedData.totalCount === 0,
    hasActivePrices: processedData.activePrices.length > 0,
    hasExpiredPrices: processedData.expiredPrices.length > 0,
    hasUpcomingPrices: processedData.upcomingPrices.length > 0,
  };
};
