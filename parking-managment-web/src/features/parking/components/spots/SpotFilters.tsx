import { useState, useEffect } from 'react';
import type { SpotFilters } from '@parking/types';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface Props {
  onFiltersChange: (filters: SpotFilters) => void;
  availableFloors?: number[];
  availableVehicleTypes?: string[];
  initialFilters?: SpotFilters;
}

export function SpotFilters({ 
  onFiltersChange, 
  availableFloors = [], 
  availableVehicleTypes = [],
  initialFilters = {}
}: Props) {
  const [filters, setFilters] = useState<SpotFilters>(initialFilters);
  const { t } = useTypedTranslation();

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof SpotFilters, value: string | number | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' || value === 'all' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {t('parking.spots.filterSpots')}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {t('parking.spots.clearAllFilters')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Availability Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {t('parking.spots.availability')}
          </label>
          <select
            value={filters.available === undefined ? 'all' : filters.available.toString()}
            onChange={(e) => handleFilterChange('available', e.target.value === 'all' ? undefined : e.target.value === 'true')}
            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('parking.spots.allSpots')}</option>
            <option value="true">{t('parking.spots.availableOnly')}</option>
            <option value="false">{t('parking.spots.occupiedOnly')}</option>
          </select>
        </div>

        {/* Vehicle Type Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {t('parking.spots.vehicleType')}
          </label>
          <select
            value={filters.vehicleType || 'all'}
            onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('parking.spots.allTypes')}</option>
            {availableVehicleTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Floor Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {t('parking.spots.floorLabel')}
          </label>
          <select
            value={filters.floor === undefined ? 'all' : filters.floor.toString()}
            onChange={(e) => handleFilterChange('floor', e.target.value === 'all' ? undefined : Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('parking.spots.allFloors')}</option>
            {availableFloors.map(floor => (
              <option key={floor} value={floor}>
                {t('parking.spots.floorLabel')} {floor}
              </option>
            ))}
          </select>
        </div>

        {/* Accessible Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {t('parking.spots.accessibility')}
          </label>
          <select
            value={filters.isAccessible === undefined ? 'all' : filters.isAccessible.toString()}
            onChange={(e) => handleFilterChange('isAccessible', e.target.value === 'all' ? undefined : e.target.value === 'true')}
            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('parking.spots.allSpots')}</option>
            <option value="true">{t('parking.spots.accessibleOnly')}</option>
            <option value="false">{t('parking.spots.nonAccessible')}</option>
          </select>
        </div>

        {/* Reservable Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {t('parking.spots.reservability')}
          </label>
          <select
            value={filters.isReservable === undefined ? 'all' : filters.isReservable.toString()}
            onChange={(e) => handleFilterChange('isReservable', e.target.value === 'all' ? undefined : e.target.value === 'true')}
            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('parking.spots.allSpots')}</option>
            <option value="true">{t('parking.spots.reservableOnly')}</option>
            <option value="false">{t('parking.spots.nonReservable')}</option>
          </select>
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-wrap gap-2">
            {filters.available !== undefined && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                {filters.available ? t('parking.spots.available') : t('parking.spots.occupied')}
                <button
                  onClick={() => handleFilterChange('available', undefined)}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.vehicleType && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                {filters.vehicleType.charAt(0).toUpperCase() + filters.vehicleType.slice(1)}
                <button
                  onClick={() => handleFilterChange('vehicleType', undefined)}
                  className="ml-1 text-purple-500 hover:text-purple-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.floor !== undefined && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                {t('parking.spots.floorLabel')} {filters.floor}
                <button
                  onClick={() => handleFilterChange('floor', undefined)}
                  className="ml-1 text-orange-500 hover:text-orange-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.isAccessible !== undefined && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                {filters.isAccessible ? t('parking.spots.accessible') : t('parking.spots.nonAccessible')}
                <button
                  onClick={() => handleFilterChange('isAccessible', undefined)}
                  className="ml-1 text-green-500 hover:text-green-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.isReservable !== undefined && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                {filters.isReservable ? t('parking.spots.reservable') : t('parking.spots.nonReservable')}
                <button
                  onClick={() => handleFilterChange('isReservable', undefined)}
                  className="ml-1 text-yellow-500 hover:text-yellow-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
