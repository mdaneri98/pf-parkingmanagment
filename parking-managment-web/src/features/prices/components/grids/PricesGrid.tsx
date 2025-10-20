import { PriceCard } from '../cards/PriceCard';
import { LoadingSpinner } from '@shared/ui/components';
import type { PriceDisplayData } from '../../types';
import { formatARS } from '@prices/utils/priceUtils';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface Props {
  prices: PriceDisplayData[];
  isLoading?: boolean;
  isEmpty?: boolean;
  onPriceView?: (price: PriceDisplayData) => void;
  onPriceEdit?: (price: PriceDisplayData) => void;
  onPriceDelete?: (price: PriceDisplayData) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  compact?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  layoutMode?: 'default' | 'active';
}

interface PricesStatsProps {
  totalCount: number;
  activeCount: number;
  upcomingCount: number;
  minPrice?: number;
  maxPrice?: number;
}

export function PricesGrid({
                             prices,
                             isLoading = false,
                             isEmpty = false,
                             onPriceView,
                             onPriceEdit,
                             onPriceDelete,
                             canEdit = true,
                             canDelete = true,
                             compact = false,
                             emptyMessage,
                             emptyDescription,
                             layoutMode = 'default',
                           }: Props) {
  const { t } = useTypedTranslation();
  
  // Use provided messages or fallback to translated defaults
  const finalEmptyMessage = emptyMessage || t('prices.noPriceRulesFound');
  const finalEmptyDescription = emptyDescription || t('prices.createFirstPriceRule');
  if (isLoading) {
    return (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
    );
  }

  // Empty state
  if (isEmpty || prices.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            {finalEmptyMessage}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-sm">
            {finalEmptyDescription}
          </p>
        </div>
    );
  }
    let gridClasses;

    if (layoutMode === 'active') {
        gridClasses = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
    } else if (compact) {
        gridClasses = "grid grid-cols-1 gap-3";
    } else {
        gridClasses = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
    }

    return (
        <div className={gridClasses}>
        {prices.map((price) => (
            <PriceCard
                key={price.id}
                price={price}
                onView={onPriceView}
                onEdit={onPriceEdit}
                onDelete={onPriceDelete}
                canEdit={canEdit}
                canDelete={canDelete}
                compact={compact}
            />
        ))}
      </div>
  );
}

export function PricesStats({
  totalCount,
  activeCount,
  upcomingCount,
  minPrice = 0,
  maxPrice = 0,
}: PricesStatsProps) {
  const { t } = useTypedTranslation();
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-green-200 dark:border-green-800 p-4">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {activeCount}
        </div>
        <div className="text-sm text-green-700 dark:text-green-300">
          {t('prices.stats.active')}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {upcomingCount}
        </div>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          {t('prices.stats.upcoming')}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {formatARS(minPrice)}
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('prices.stats.minPrice')}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {formatARS(maxPrice)}
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('prices.stats.maxPrice')}
        </div>
      </div>
    </div>
  );
}
