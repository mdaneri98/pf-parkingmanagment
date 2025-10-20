import type { SpotDTO, SpotFilters } from '@parking/types';
import { SpotFilters as SpotFiltersComponent } from '@parking/components/spots/SpotFilters';
import { ParkingSpotsGrid } from '@parking/components/spots/ParkingSpotsGrid';
import { ErrorState } from '@parking/components/common/ErrorState';
import { PlusIcon } from '@parking/components/common/Icons';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface SpotsSectionProps {
  spots: SpotDTO[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onCreateSpot: () => void;
  onSpotClick: (spot: SpotDTO) => void;
  onFiltersChange: (filters: SpotFilters) => void;
  availableFilters: {
    floors: number[];
    vehicleTypes: string[];
  };
  spotFilters: SpotFilters;
  isCreating: boolean;
}

export function SpotsSection({
  spots,
  isLoading,
  isError,
  onRetry,
  onCreateSpot,
  onSpotClick,
  onFiltersChange,
  availableFilters,
  spotFilters,
  isCreating
}: SpotsSectionProps) {
  const { t } = useTypedTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('parking.dashboard.spotsTitle')}
        </h2>
        <div className="flex items-center space-x-3">
          {isError && (
            <button
              onClick={onRetry}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              {t('common.retry')}
            </button>
          )}
          <button
            onClick={onCreateSpot}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
            disabled={isCreating}
          >
            <PlusIcon />
            <span>{t('parking.spots.createSpot')}</span>
          </button>
        </div>
      </div>

      <SpotFiltersComponent
        onFiltersChange={onFiltersChange}
        availableFloors={availableFilters.floors}
        availableVehicleTypes={availableFilters.vehicleTypes}
        initialFilters={spotFilters}
      />

      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        {isError ? (
          <ErrorState 
            title={t('parking.dashboard.loadingError')}
            message={t('parking.dashboard.loadingErrorMessage')}
            onRetry={onRetry}
          />
        ) : (
          <ParkingSpotsGrid
            spots={spots}
            isLoading={isLoading}
            onSpotClick={onSpotClick}
          />
        )}
      </div>
    </div>
  );
}