import { useState } from 'react';
import { Input } from '@shared/ui/components';
import { getVehicleTypeOptions } from '@shared/constants';
import { formatDateTimeForInput, parseDateTimeFromInput } from '@prices/utils/priceUtils';
import type { PriceFilterState } from '@prices/slice/pricesSlice';

interface Props {
  filters: PriceFilterState;
  onFiltersChange: (filters: Partial<PriceFilterState>) => void;
  onReset: () => void;
  activeCount: number;
  isLoading?: boolean;
}

export function PriceFilters({ 
  filters, 
  onFiltersChange, 
  onReset, 
  activeCount,
  isLoading = false,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const vehicleTypeOptions = getVehicleTypeOptions();

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const updateFilter = <K extends keyof PriceFilterState>(
    field: K,
    value: PriceFilterState[K]
  ) => {
    onFiltersChange({ [field]: value });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            Filters
          </h3>
          {activeCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {activeCount} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              disabled={isLoading}
            >
              Clear all
            </button>
          )}
          <button
            onClick={handleToggleExpanded}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
            disabled={isLoading}
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('showActiveOnly', !filters.showActiveOnly)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              filters.showActiveOnly
                ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-600 dark:hover:bg-neutral-700'
            }`}
            disabled={isLoading}
          >
            <span className={`w-2 h-2 rounded-full mr-2 inline-block ${
              filters.showActiveOnly ? 'bg-green-500' : 'bg-neutral-400'
            }`}></span>
            Active Only
          </button>
          
          <button
            onClick={() => updateFilter('showExpiredOnly', !filters.showExpiredOnly)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              filters.showExpiredOnly
                ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
                : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-600 dark:hover:bg-neutral-700'
            }`}
            disabled={isLoading}
          >
            <span className={`w-2 h-2 rounded-full mr-2 inline-block ${
              filters.showExpiredOnly ? 'bg-red-500' : 'bg-neutral-400'
            }`}></span>
            Expired Only
          </button>

          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value as 'asc' | 'desc')}
            className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
            disabled={isLoading}
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Range */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Price Range
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  step="0.01"
                  min="0"
                  disabled={isLoading}
                  leftIcon={<span className="text-xs">$</span>}
                />
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice || ''}
                  onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  step="0.01"
                  min="0"
                  disabled={isLoading}
                  leftIcon={<span className="text-xs">$</span>}
                />
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Vehicle Type
              </h4>
              <select
                value={filters.vehicleType || ''}
                onChange={(e) => updateFilter('vehicleType', e.target.value || undefined)}
                className="input"
                disabled={isLoading}
              >
                <option value="">All vehicle types</option>
                {vehicleTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Validity Period
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="From Date"
                type="datetime-local"
                value={filters.startDate ? formatDateTimeForInput(filters.startDate) : ''}
                onChange={(e) => updateFilter('startDate', e.target.value ? parseDateTimeFromInput(e.target.value) : undefined)}
                disabled={isLoading}
                helpText="Filter prices valid from this date"
              />
              <Input
                label="To Date"
                type="datetime-local"
                value={filters.endDate ? formatDateTimeForInput(filters.endDate) : ''}
                onChange={(e) => updateFilter('endDate', e.target.value ? parseDateTimeFromInput(e.target.value) : undefined)}
                disabled={isLoading}
                helpText="Filter prices valid until this date"
              />
            </div>
          </div>

          {/* Clear individual filter sections */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
              <button
                onClick={() => onFiltersChange({ minPrice: undefined, maxPrice: undefined })}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                disabled={isLoading}
              >
                Clear price range
              </button>
            )}
            {filters.vehicleType && (
              <button
                onClick={() => updateFilter('vehicleType', undefined)}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                disabled={isLoading}
              >
                Clear vehicle type
              </button>
            )}
            {(filters.startDate || filters.endDate) && (
              <button
                onClick={() => onFiltersChange({ startDate: undefined, endDate: undefined })}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                disabled={isLoading}
              >
                Clear date range
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

