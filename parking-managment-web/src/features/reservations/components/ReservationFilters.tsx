import { useState, useEffect } from 'react';
import { ReservationStatus } from '../types';
import { Input } from "@shared/ui/components";
import { RESERVATION_STATUS } from '../constants/reservations';
import { formatDateTimeForInput, parseDateTimeFromInput } from "@features/prices";
import { ReservationFilterState } from '../slice/reservationsSlice';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface ReservationFiltersProps {
    filters?: ReservationFilterState;
    isLoading?: boolean;
    onFiltersChange: (filters: {
        status?: ReservationStatus;
        from?: string;
        to?: string;
    }) => void;
    initialFilters?: {
        status?: ReservationStatus;
        from?: string;
        to?: string;
    };
}

export function ReservationFilters({
                                       filters,
                                       isLoading = false,
                                       onFiltersChange,
                                       initialFilters = {}
                                   }: ReservationFiltersProps) {
    const { t } = useTypedTranslation();

    const [status, setStatus] = useState<ReservationStatus | ''>(
        initialFilters.status ?? ReservationStatus.PENDING
    );
    const [fromDate, setFromDate] = useState<Date | undefined>(
        initialFilters.from ? new Date(initialFilters.from) : undefined
    );
    const [toDate, setToDate] = useState<Date | undefined>(
        initialFilters.to ? new Date(initialFilters.to) : undefined
    );

    const updateFilter = <K extends keyof ReservationFilterState>(
        field: K,
        value: ReservationFilterState[K]
    ) => {
        onFiltersChange({ [field]: value });
    };

    useEffect(() => {
        onFiltersChange({
            status: status || undefined,
            from: fromDate ? formatDateTimeForInput(fromDate) : undefined,
            to: toDate ? formatDateTimeForInput(toDate) : undefined,
        });
    }, [status, fromDate, toDate, onFiltersChange]);

    const clearFilters = () => {
        setStatus('');
        setFromDate(undefined);
        setToDate(undefined);
    };

    const hasActiveFilters = status !== '' || fromDate || toDate;

    // Convert RESERVATION_STATUS object to options list
    const statusOptions = [
        { value: '', label: t('reservations.filters.allStatuses') },
        ...Object.entries(RESERVATION_STATUS).map(([key, value]) => ({
            value: key as ReservationStatus,
            label: t(value.labelKey),
        })),
    ];

    return (
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {t('reservations.filters.title')}
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        {t('reservations.filters.clearFilters')}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {t('reservations.filters.status')}
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ReservationStatus | '')}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Range - From */}
                <Input
                    label={t('reservations.filters.fromDate')}
                    type="datetime-local"
                    value={fromDate ? formatDateTimeForInput(fromDate) : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        setFromDate(val ? parseDateTimeFromInput(val) : undefined);
                        updateFilter('from', val ? formatDateTimeForInput(parseDateTimeFromInput(val)) : undefined);
                    }}
                    disabled={isLoading}
                    helpText={t('reservations.filters.fromDateHelp')}
                />

                {/* Date Range - To */}
                <Input
                    label={t('reservations.filters.toDate')}
                    type="datetime-local"
                    value={toDate ? formatDateTimeForInput(toDate) : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        setToDate(val ? parseDateTimeFromInput(val) : undefined);
                        updateFilter('to', val ? formatDateTimeForInput(parseDateTimeFromInput(val)) : undefined);
                    }}
                    disabled={isLoading}
                    helpText={t('reservations.filters.toDateHelp')}
                />
            </div>

            {/* Active filters summary */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex flex-wrap gap-2">
                        {status && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                {t(RESERVATION_STATUS[status]?.labelKey) ?? status}
                                <button
                                    onClick={() => setStatus('')}
                                    className="ml-1 text-blue-500 hover:text-blue-700"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {fromDate && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                                {t('reservations.filters.from')} {fromDate.toLocaleString()}
                                <button
                                    onClick={() => setFromDate(undefined)}
                                    className="ml-1 text-purple-500 hover:text-purple-700"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {toDate && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                                {t('reservations.filters.to')} {toDate.toLocaleString()}
                                <button
                                    onClick={() => setToDate(undefined)}
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
