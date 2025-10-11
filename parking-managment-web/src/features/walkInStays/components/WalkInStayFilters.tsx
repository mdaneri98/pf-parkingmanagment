import { useState, useEffect } from 'react';
import { WalkInStayStatus } from '../types';
import { Input } from "@shared/ui/components";
import { WALK_IN_STAY_STATUS } from '../constants/walkInStays';
import { WalkInStayFilterState } from '../slice/walkInStaysSlice';

interface WalkInStayFiltersProps {
  filters?: WalkInStayFilterState;
  isLoading?: boolean;
  onFiltersChange: (filters: {
    status?: WalkInStayStatus;
    vehiclePlate?: string;
    showActiveOnly?: boolean;
  }) => void;
  initialFilters?: {
    status?: WalkInStayStatus;
    vehiclePlate?: string;
    showActiveOnly?: boolean;
  };
}

export function WalkInStayFilters({
  filters,
  isLoading = false,
  onFiltersChange,
  initialFilters = {}
}: WalkInStayFiltersProps) {

  const [status, setStatus] = useState<WalkInStayStatus | ''>(
    initialFilters.status ?? ''
  );
  const [vehiclePlate, setVehiclePlate] = useState<string>(
    initialFilters.vehiclePlate ?? ''
  );
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(
    initialFilters.showActiveOnly ?? false
  );

  const updateFilter = <K extends keyof WalkInStayFilterState>(
    field: K,
    value: WalkInStayFilterState[K]
  ) => {
    onFiltersChange({ [field]: value });
  };

  useEffect(() => {
    onFiltersChange({
      status: status || undefined,
      vehiclePlate: vehiclePlate || undefined,
      showActiveOnly,
    });
  }, [status, vehiclePlate, showActiveOnly, onFiltersChange]);

  const clearFilters = () => {
    setStatus('');
    setVehiclePlate('');
    setShowActiveOnly(false);
  };

  const hasActiveFilters = status !== '' || vehiclePlate !== '' || showActiveOnly;

  // Convert WALK_IN_STAY_STATUS object to options list
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.entries(WALK_IN_STAY_STATUS).map(([key, value]) => ({
      value: key as WalkInStayStatus,
      label: value.label,
    })),
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Filter Walk-In Stays
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WalkInStayStatus | '')}
            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Plate Filter */}
        <Input
          label="Vehicle Plate"
          type="text"
          value={vehiclePlate}
          onChange={(e) => {
            setVehiclePlate(e.target.value);
            updateFilter('vehiclePlate', e.target.value || undefined);
          }}
          disabled={isLoading}
          helpText="Filter by license plate"
          placeholder="Enter license plate..."
        />

        {/* Show Active Only Toggle */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Show Active Only
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => {
                setShowActiveOnly(e.target.checked);
                updateFilter('showActiveOnly', e.target.checked);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Only show active stays
            </label>
          </div>
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-wrap gap-2">
            {status && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                {WALK_IN_STAY_STATUS[status]?.label ?? status}
                <button
                  onClick={() => setStatus('')}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {vehiclePlate && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                Plate: {vehiclePlate}
                <button
                  onClick={() => setVehiclePlate('')}
                  className="ml-1 text-purple-500 hover:text-purple-700"
                >
                  ×
                </button>
              </span>
            )}
            {showActiveOnly && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                Active Only
                <button
                  onClick={() => setShowActiveOnly(false)}
                  className="ml-1 text-green-500 hover:text-green-700"
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
