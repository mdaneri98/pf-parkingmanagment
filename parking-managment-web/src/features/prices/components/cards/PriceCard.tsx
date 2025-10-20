import type { PriceDisplayData } from '@prices/types';
import { formatARS } from '@prices/utils/priceUtils';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface Props {
  price: PriceDisplayData;
  onView?: (price: PriceDisplayData) => void;
  onEdit?: (price: PriceDisplayData) => void;
  onDelete?: (price: PriceDisplayData) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  compact?: boolean;
}

export function PriceCard({ 
  price, 
  onView, 
  onEdit, 
  onDelete,
  canEdit = true,
  canDelete = true,
  compact = false,
}: Props) {
  const { t } = useTypedTranslation();
  const getStatusColor = () => {
    if (price.isActive) return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
    if (price.isExpired) return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
    return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
  };

  const getStatusBadge = () => {
    if (price.isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {t('prices.card.status.active')}
        </span>
      );
    }
    
    if (price.isExpired) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          {t('prices.card.status.expired')}
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {t('prices.card.status.upcoming')}
      </span>
    );
  };

  const handleView = () => {
    onView?.(price);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(price);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(price);
  };

  const formattedARS = formatARS(price.formattedPrice);

  if (compact) {
    return (
      <div 
        className={`border rounded-lg p-3 cursor-pointer hover:shadow-sm transition-shadow ${getStatusColor()}`}
        onClick={handleView}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{price.vehicleTypeIcon}</span>
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {formattedARS}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {price.vehicleTypeLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            {(canEdit || canDelete) && (
              <div className="flex space-x-1">
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                    title={t('common.edit')}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded text-red-600 dark:text-red-400"
                    title={t('common.delete')}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${getStatusColor()}`}
      onClick={handleView}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{price.vehicleTypeIcon}</div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              {price.vehicleTypeLabel}
            </h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {formattedARS}
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">{t('prices.card.validFrom')}</span>
          <span className="text-neutral-900 dark:text-neutral-100">{price.formattedValidFrom}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">{t('prices.card.validTo')}</span>
          <span className="text-neutral-900 dark:text-neutral-100">{price.formattedValidTo}</span>
        </div>
      </div>

      {/* Progress bar for active prices */}
      {price.isActive && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
            <span>{t('prices.card.progress')}</span>
            <span>
              {Math.round(
                ((new Date().getTime() - new Date(price.validFrom).getTime()) /
                (new Date(price.validTo).getTime() - new Date(price.validFrom).getTime())) * 100
              )}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(0, 
                  ((new Date().getTime() - new Date(price.validFrom).getTime()) /
                  (new Date(price.validTo).getTime() - new Date(price.validFrom).getTime())) * 100
                ))}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      {(canEdit || canDelete) && (
        <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
          {canEdit && (
            <button
              onClick={handleEdit}
              className="flex items-center px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {t('prices.card.edit')}
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t('prices.card.delete')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
