import type { WalkInStayResponse } from '../types';
import { UI_LABELS, TIME_THRESHOLD_CONFIGS } from '../constants/walkInStays';
import {
  formatDateTime,
  formatRemainingTime,
  getTimeThresholdStatus,
  formatPrice,
} from '../utils/walkInStayUtils';

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-green-900 dark:text-green-100">
          {UI_LABELS.ACTIVE}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded ${thresholdConfig.bgClass} ${thresholdConfig.textClass} font-medium`}>
          {UI_LABELS.ACTIVE}
        </span>
      </div>

      {/* Vehicle Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">{UI_LABELS.VEHICLE}:</span>
          <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
            {walkInStay.vehicleLicensePlate}
          </span>
        </div>

        {/* Start Time */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">{UI_LABELS.STARTED_AT}:</span>
          <span className="text-neutral-900 dark:text-neutral-100">
            {formatDateTime(walkInStay.reservedStartTime)}
          </span>
        </div>

        {/* Expected End Time */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">{UI_LABELS.EXPECTED_END}:</span>
          <span className="text-neutral-900 dark:text-neutral-100">
            {formatDateTime(walkInStay.expectedEndTime)}
          </span>
        </div>

        {/* Remaining Time with Warning Indicator */}
        {remainingMinutes !== undefined && (
          <div className={`flex items-center justify-between text-sm p-2 rounded-md ${thresholdConfig.bgClass}`}>
            <span className={`font-medium ${thresholdConfig.textClass} flex items-center gap-1`}>
              <span>{thresholdConfig.icon}</span>
              {UI_LABELS.REMAINING_TIME}:
            </span>
            <span className={`font-bold ${thresholdConfig.colorClass}`}>
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
            <span>{UI_LABELS.TIME_WARNING}</span>
          </div>
        )}

        {thresholdStatus === 'critical' && (
          <div className="flex items-center gap-1 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded animate-pulse">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{UI_LABELS.TIME_CRITICAL}</span>
          </div>
        )}

        {/* Price */}
        {walkInStay.price > 0 && (
          <div className="flex items-center justify-between text-sm pt-2 border-t border-green-200 dark:border-green-800">
            <span className="text-neutral-600 dark:text-neutral-400">{UI_LABELS.PRICE}:</span>
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
          className="flex-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors font-medium"
        >
          {isExtending ? 'Extending...' : UI_LABELS.EXTEND}
        </button>
        <button
          onClick={onComplete}
          disabled={isExtending || isCompleting}
          className="flex-1 px-3 py-2 text-sm bg-neutral-600 hover:bg-neutral-700 text-white rounded-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors font-medium"
        >
          {isCompleting ? 'Completing...' : UI_LABELS.COMPLETE}
        </button>
      </div>
    </div>
  );
};

