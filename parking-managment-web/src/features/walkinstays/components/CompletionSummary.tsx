import type { WalkInStayResponse } from '../types';
import { formatPrice, formatDuration } from '../utils/walkInStayUtils';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface Props {
    stay: WalkInStayResponse;
    onClose: () => void;
}

const calculateTotalDurationHours = (startTime: string, endTime: string): number => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const diffMilliseconds = end - start;
    return diffMilliseconds / (1000 * 60 * 60);
};

export const CompletionSummary = ({ stay, onClose }: Props) => {
    const totalHours = calculateTotalDurationHours(stay.reservedStartTime, stay.reservedEndTime);
    const formattedDuration = formatDuration(totalHours);
    const { t } = useTypedTranslation();

    return (
        <div className="space-y-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 text-center">
                {t('walkinstays.checkoutComplete')}
            </h3>

            <div className="space-y-2 text-center">

                {/* Total Time */}
                <div className="flex items-center justify-between p-2 bg-blue-100 dark:bg-blue-800/50 rounded-md">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {t('walkinstays.totalDuration')}
          </span>
                    <span className="text-lg font-extrabold text-blue-900 dark:text-blue-100">
            {formattedDuration}
          </span>
                </div>

                {/* Total Price */}
                <div className="flex items-center justify-between p-2 bg-blue-200 dark:bg-blue-700/50 rounded-md">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {t('walkinstays.totalPrice')}
          </span>
                    <span className="text-xl font-extrabold text-blue-900 dark:text-blue-100">
            {formatPrice(stay.price)}
          </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-2">
                    {t('walkinstays.licensePlate')}: {stay.vehicleLicensePlate}
                </p>
            </div>

            <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
            >
                {t('walkinstays.close')}
            </button>
        </div>
    );
};