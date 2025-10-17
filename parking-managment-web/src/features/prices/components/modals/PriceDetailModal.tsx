import type { PriceDisplayData } from '../../types';
import { formatARS } from '@prices/utils/PriceUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  price: PriceDisplayData | null;
  onEdit?: (price: PriceDisplayData) => void;
  onDelete?: (price: PriceDisplayData) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function PriceDetailModal({ 
  isOpen, 
  onClose, 
  price,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: Props) {
  if (!isOpen || !price) return null;

  const handleEdit = () => {
    onEdit?.(price);
  };

  const handleDelete = () => {
    onDelete?.(price);
  };

  const formattedARS = formatARS(price.formattedPrice);

  const getStatusBadge = () => {
    if (price.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
          Active
        </span>
      );
    }
    
    if (price.isExpired) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></span>
          Expired
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></span>
        Upcoming
      </span>
    );
  };

  const getDuration = () => {
    const startDate = new Date(price.validFrom);
    const endDate = new Date(price.validTo);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.round(diffDays / 30)} months`;
    return `${Math.round(diffDays / 365)} years`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Price Rule Details
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Header with status */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{price.vehicleTypeIcon}</div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  {price.vehicleTypeLabel}
                </h3>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formattedARS}
                </p>
              </div>
            </div>
            <div>
              {getStatusBadge()}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Validity Period
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Start Date:</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {price.formattedValidFrom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">End Date:</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {price.formattedValidTo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Duration:</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {getDuration()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Time remaining/elapsed info */}
          {price.isActive && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  This price rule is currently active
                </span>
              </div>
            </div>
          )}

          {price.isExpired && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  This price rule has expired
                </span>
              </div>
            </div>
          )}

          {!price.isActive && !price.isExpired && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  This price rule will become active on {new Date(price.validFrom).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            {canEdit && (
              <button
                onClick={handleEdit}
                className="btn btn-secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
