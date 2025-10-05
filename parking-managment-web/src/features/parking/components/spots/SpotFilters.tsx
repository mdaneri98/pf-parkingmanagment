import { useState, useEffect } from 'react';
import type { SpotFilters } from '@parking/types';

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
          Filter Spots
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Availability Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Availability
          </label>
          <select
            value={filters.available === undefined ? 'all' : filters.available.toString()}
            onChange={(e) => handleFilterChange('available', e.target.value === 'all' ? undefined : e.target.value === 'true')}
            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Spots</option>
            <option value="true">Available Only</option>
            <option value="false">Occupied Only</option>
          </select>
        </div>

        {/* Vehicle Type Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Vehicle Type
          </label>
          <select
            value={filters.vehicleType || 'all'}
            onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
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
            Floor
          </label>
          <select
            value={filters.floor === undefined ? 'all' : filters.floor.toString()}
            onChange={(e) => handleFilterChange('floor', e.target.value === 'all' ? undefined : Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Floors</option>
            {availableFloors.map(floor => (
              <option key={floor} value={floor}>
                Floor {floor}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-wrap gap-2">
            {filters.available !== undefined && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                {filters.available ? 'Available' : 'Occupied'}
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
                Floor {filters.floor}
                <button
                  onClick={() => handleFilterChange('floor', undefined)}
                  className="ml-1 text-orange-500 hover:text-orange-700"
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
