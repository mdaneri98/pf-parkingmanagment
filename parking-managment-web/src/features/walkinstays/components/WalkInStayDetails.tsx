import type { WalkInStayResponse } from '../types';
import { TIME_THRESHOLD_CONFIGS } from '../constants/walkInStays';
import {
  formatDateTime,
  formatRemainingTime,
  getTimeThresholdStatus,
  formatPrice,
} from '../utils/walkInStayUtils';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface WalkInStayDetailsProps {
  walkInStay: WalkInStayResponse;
  remainingMinutes?: number;
  onExtend: () => void;
  onComplete: () => void;
  isExtending?: boolean;
  isCompleting?: boolean;
}

export const WalkInStayDetails = ({
  walkInStay,
  remainingMinutes,
  onExtend,
  onComplete,
  isExtending = false,
  isCompleting = false,
}: WalkInStayDetailsProps) => {
  const thresholdStatus = getTimeThresholdStatus(remainingMinutes);
  const thresholdConfig = TIME_THRESHOLD_CONFIGS[thresholdStatus];
  const { t } = useTypedTranslation();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-green-900 dark:text-green-100">
          {t('walkinstays.active')}
        </h3>
      </div>

      {/* Vehicle Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">{t('walkinstays.vehicle')}:</span>
          <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
            {walkInStay.vehicleLicensePlate}
          </span>
        </div>

        {/* Start Time */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">{t('walkinstays.startedAt')}:</span>
          <span className="text-neutral-900 dark:text-neutral-100">
            {formatDateTime(walkInStay.reservedStartTime)}
          </span>
        </div>

        {/* Expected End Time */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">{t('walkinstays.expectedEnd')}:</span>
          <span className="text-neutral-900 dark:text-neutral-100">
            {formatDateTime(walkInStay.expectedEndTime)}
          </span>
        </div>

        {/* Remaining Time with Warning Indicator */}
        {remainingMinutes !== undefined && (
          <div className="flex items-center justify-between text-sm p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <span className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-1">
              <span>{thresholdConfig.icon}</span>
              {t('walkinstays.remainingTime')}:
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {formatRemainingTime(remainingMinutes)}
            </span>
          </div>
        )}

        {/* Warning Messages */}
        {thresholdStatus === 'warning' && (
          <div className="flex items-center gap-1 text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{t('walkinstays.timeWarning')}</span>
          </div>
        )}

        {thresholdStatus === 'critical' && (
          <div className="flex items-center gap-1 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded animate-pulse">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{t('walkinstays.timeCritical')}</span>
          </div>
        )}

        {/* Price */}
        {walkInStay.price > 0 && (
          <div className="flex items-center justify-between text-sm pt-2 border-t border-green-200 dark:border-green-800">
            <span className="text-neutral-600 dark:text-neutral-400">{t('walkinstays.price')}:</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {formatPrice(walkInStay.price)}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2">
        <button
          onClick={onExtend}
          disabled={isExtending || isCompleting}
          className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors font-medium"
        >
          {isExtending ? t('walkinstays.extending') : t('walkinstays.extend')}
        </button>
        <button
          onClick={onComplete}
          disabled={isExtending || isCompleting}
          className="flex-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors font-medium"
        >
          {isCompleting ? t('walkinstays.completing') : t('walkinstays.complete')}
        </button>
      </div>
    </div>
  );
};

