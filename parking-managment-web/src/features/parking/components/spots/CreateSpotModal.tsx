import { useState, useCallback } from 'react';
import type { CreateSpotRequest } from '@parking/types';
import { VEHICLE_TYPES, getVehicleTypeOptions, VehicleType } from '@shared/constants';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';
import { Modal } from '@shared/ui/components';

interface FormData {
  parkingLotId: number;
  floor: number | '';
  prefix: string;
  startNumber: number | '';
  endNumber: number | '';
  vehicleType: VehicleType;
  isSingleSpot: boolean;
  isReservable: boolean;
  isAccessible: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (spots: CreateSpotRequest[]) => void;
  parkingLotId: number;
  isLoading: boolean;
}

const getInitialFormData = (parkingLotId: number): FormData => ({
  parkingLotId,
  floor: 1,
  prefix: '',
  startNumber: '' as number | '',
  endNumber: '' as number | '',
  vehicleType: VEHICLE_TYPES.CAR,
  isSingleSpot: true,
  isReservable: false,
  isAccessible: false,
});

export function CreateSpotModal({ isOpen, onClose, onSubmit, parkingLotId, isLoading }: Props) {
  const [formData, setFormData] = useState<FormData>(() => getInitialFormData(parkingLotId));
  const { t } = useTypedTranslation();

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData(parkingLotId));
  }, [parkingLotId]);

  const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        const { prefix, startNumber, endNumber, floor, isSingleSpot, isReservable, isAccessible, ...rest } = formData;

        const spots: CreateSpotRequest[] = [];
        const floorValue = floor === '' ? 1 : floor;
        const start = Number(startNumber);

        const baseSpotData = {
          ...rest,
          isReservable,
          isAccessible,
          floor: floorValue,
        };

        if (isSingleSpot) {
          spots.push({
            ...baseSpotData,
            code: `${prefix || ''}${start}`,
          });
        } else {
          const end = Number(endNumber);
          for (let i = start; i <= end; i++) {
            spots.push({
              ...baseSpotData,
              code: `${prefix || ''}${i}`,
            });
          }
        }

        onSubmit(spots);
        resetForm();
      },
      [formData, onSubmit, resetForm]
  );

  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  const updateFormField = useCallback(<T extends keyof FormData>(field: T, value: FormData[T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleSingleSpotMode = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      isSingleSpot: !prev.isSingleSpot,
      startNumber: '',
      endNumber: '',
    }));
  }, []);

  if (!isOpen) return null;

  return (
      <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {formData.isSingleSpot ? t('parking.spots.modals.createSpot.titleSingle') : t('parking.spots.modals.createSpot.titleMultiple')}
            </h2>
            <button
                onClick={handleClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
            >
              <svg
                  className="w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Spot Code Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {formData.isSingleSpot ? t('parking.spots.modals.createSpot.spotNumber') : t('parking.spots.modals.createSpot.spotCodeRange')}
              </label>
              <div className="grid grid-cols-3 gap-4">

                {/* Campo Prefix */}
                <input
                    type="text"
                    value={formData.prefix}
                    onChange={(e) => updateFormField('prefix', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg
                           bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('parking.spots.modals.createSpot.prefixPlaceholder')}
                    maxLength={5}
                />

                {/* Campo de Número Único o Start */}
                <input
                    type="number"
                    value={formData.startNumber}
                    onChange={(e) =>
                        updateFormField(
                            'startNumber',
                            e.target.value === '' ? '' : parseInt(e.target.value, 10)
                        )
                    }
                    className={`w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg 
                            bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                            ${formData.isSingleSpot ? 'col-span-2' : 'col-span-1'}`}
                    placeholder={formData.isSingleSpot ? t('parking.spots.modals.createSpot.spotNumberPlaceholder') : t('parking.spots.modals.createSpot.startPlaceholder')}
                    min={0}
                    required
                />

                {/* Campo End (Solo visible en modo múltiple) */}
                {!formData.isSingleSpot && (
                    <input
                        type="number"
                        value={formData.endNumber}
                        onChange={(e) =>
                            updateFormField(
                                'endNumber',
                                e.target.value === '' ? '' : parseInt(e.target.value, 10)
                            )
                        }
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg
                             bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('parking.spots.modals.createSpot.endPlaceholder')}
                        min={0}
                        required
                    />
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {formData.isSingleSpot
                    ? t('parking.spots.modals.createSpot.codeHintSingle')
                    : t('parking.spots.modals.createSpot.codeHintMultiple')}
              </p>
            </div>
            {/* Toggle para Single/Multiple Spots */}
            <div className="flex justify-end">
              <button
                  type="button"
                  onClick={toggleSingleSpotMode}
                  className="text-xs font-semibold py-1 px-2 rounded-full
                          bg-neutral-100 dark:bg-neutral-700 text-blue-600 dark:text-blue-400
                          hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
              >
                {formData.isSingleSpot ? t('parking.spots.modals.createSpot.multipleSpotsMode') : t('parking.spots.modals.createSpot.singleSpotMode')}
              </button>
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {t('parking.spots.modals.createSpot.floor')}
              </label>
              <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) =>
                      updateFormField(
                          'floor',
                          e.target.value === '' ? '' : parseInt(e.target.value, 10)
                      )
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg
                         bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={-10}
                  max={99}
                  required
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {t('parking.spots.modals.createSpot.vehicleType')}
              </label>
              <select
                  value={formData.vehicleType}
                  onChange={(e) => updateFormField('vehicleType', e.target.value as VehicleType)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg
                         bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
              >
                {getVehicleTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-2 border-neutral-200 dark:border-neutral-700">

              {/* 1. isReservable */}
              <div className="flex items-center justify-between">
                <label htmlFor="isReservable" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  {t('parking.spots.modals.createSpot.reservableTitle')}
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {t('parking.spots.modals.createSpot.reservableDesc')}
                  </p>
                </label>
                <input
                    type="checkbox"
                    id="isReservable"
                    checked={formData.isReservable}
                    onChange={(e) => updateFormField('isReservable', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-neutral-400 dark:border-neutral-500 rounded focus:ring-blue-500"
                />
              </div>

              {/* 2. isAccessible */}
              <div className="flex items-center justify-between">
                <label htmlFor="isAccessible" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  {t('parking.spots.modals.createSpot.accessibleTitle')}
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {t('parking.spots.modals.createSpot.accessibleDesc')}
                  </p>
                </label>
                <input
                    type="checkbox"
                    id="isAccessible"
                    checked={formData.isAccessible}
                    onChange={(e) => updateFormField('isAccessible', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-neutral-400 dark:border-neutral-500 rounded focus:ring-blue-500"
                />
              </div>

            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-neutral-700 dark:text-neutral-300
                         bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600
                         rounded-lg transition-colors"
                  disabled={isLoading}
              >
                {t('common.cancel')}
              </button>
              <button
                  type="submit"
                  disabled={
                      isLoading ||
                      formData.startNumber === '' ||
                      (!formData.isSingleSpot && formData.endNumber === '') ||
                      (!formData.isSingleSpot && Number(formData.endNumber) < Number(formData.startNumber))
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                    ? t('parking.spots.modals.createSpot.creating')
                    : formData.isSingleSpot ? t('parking.spots.modals.createSpot.createButton') : t('parking.spots.modals.createSpot.createButtonMultiple')
                }
              </button>
            </div>
          </form>
        </div>
      </Modal>
  );
}