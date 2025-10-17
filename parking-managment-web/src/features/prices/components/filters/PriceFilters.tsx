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
    const vehicleTypeOptions = getVehicleTypeOptions();

    const updateFilter = <K extends keyof PriceFilterState>(
        field: K,
        value: PriceFilterState[K]
    ) => {
        onFiltersChange({ [field]: value });
    };

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 space-y-4 w-full">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Filters</h3>
                    {activeCount > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {activeCount} active
            </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        onClick={onReset}
                        className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                        disabled={isLoading}
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Quick Filters + Sorting */}
            <div className="flex flex-wrap gap-2 items-center w-full">
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

            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-4 w-full">
                {/* Vehicle Type */}
                <div className="flex flex-col flex-1 min-w-[160px]">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Vehicle Type</label>
                    <select
                        value={filters.vehicleType || ''}
                        onChange={(e) => updateFilter('vehicleType', e.target.value || undefined)}
                        className="input w-full"
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

                {/* Date Range */}
                <div className="flex flex-col flex-1 min-w-[160px]">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">From</label>
                    <Input
                        type="datetime-local"
                        value={filters.startDate ? formatDateTimeForInput(filters.startDate) : ''}
                        onChange={(e) => updateFilter('startDate', e.target.value ? parseDateTimeFromInput(e.target.value) : undefined)}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex flex-col flex-1 min-w-[160px]">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">To</label>
                    <Input
                        type="datetime-local"
                        value={filters.endDate ? formatDateTimeForInput(filters.endDate) : ''}
                        onChange={(e) => updateFilter('endDate', e.target.value ? parseDateTimeFromInput(e.target.value) : undefined)}
                        disabled={isLoading}
                    />
                </div>

                {/* Price Range */}
                <div className="flex flex-col flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Price Range</label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice || ''}
                            onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                            step="0.01"
                            min="0"
                            disabled={isLoading}
                            leftIcon={<span className="text-xs">$</span>}
                            className="flex-1"
                        />
                        <Input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice || ''}
                            onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                            step="0.01"
                            min="0"
                            disabled={isLoading}
                            leftIcon={<span className="text-xs">$</span>}
                            className="flex-1"
                        />
                    </div>
                </div>
            </div>

            {/* Clear individual filter sections */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                    <button
                        onClick={() => { updateFilter('minPrice', undefined); updateFilter('maxPrice', undefined); }}
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
                        onClick={() => { updateFilter('startDate', undefined); updateFilter('endDate', undefined); }}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        disabled={isLoading}
                    >
                        Clear date range
                    </button>
                )}
            </div>
        </div>
    );
}
