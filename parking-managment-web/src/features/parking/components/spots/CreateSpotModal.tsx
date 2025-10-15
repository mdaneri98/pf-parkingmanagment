import { useState, useCallback } from 'react';
import type { CreateSpotRequest } from '@parking/types';
import { VEHICLE_TYPES, getVehicleTypeOptions, VehicleType } from '@shared/constants';

// Definición de tipos de datos de formulario, incluyendo el nuevo estado
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
  floor: 1, // Inicializado como number
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
            ...rest,
            floor: floorValue,
            code: `${prefix || ''}${start}`,
          });
        } else {
          const end = Number(endNumber);
          for (let i = start; i <= end; i++) {
            spots.push({
              ...rest,
              floor: floorValue,
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
      // Limpiamos los campos al cambiar de modo
      startNumber: '',
      endNumber: '',
    }));
  }, []);

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {formData.isSingleSpot ? 'Create New Spot' : 'Create Multiple Spots'}
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
                {formData.isSingleSpot ? 'Spot Number' : 'Spot Code Range'}
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
                    placeholder="Prefix (e.g. A)"
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
                            ${formData.isSingleSpot ? 'col-span-2' : 'col-span-1'}`} // Ocupa 2 columnas en modo single
                    placeholder={formData.isSingleSpot ? 'Spot Number (e.g. 10)' : '(e.g. 1)'}
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
                        placeholder="(e.g. 50)"
                        min={0}
                        required
                    />
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {formData.isSingleSpot
                    ? 'Code will be generated as: Prefix + Number (e.g. A10)'
                    : 'Codes will be generated as: Prefix + number (e.g. A1, A2, ..., A50)'}
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
                {formData.isSingleSpot ? 'Multiple Spots Mode' : 'Single Spot Mode'}
              </button>
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Floor
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
                Vehicle Type
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
                  Consider for Online Reservations
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    If enabled, this spot can be booked by users.
                  </p>
                </label>
                <input
                    type="checkbox"
                    id="isReservable"
                    checked={formData.isReservable}
                    onChange={(e) => updateFormField('isReservable', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-neutral-300 dark:border-neutral-600 rounded focus:ring-blue-500"
                />
              </div>

              {/* 2. isAccessible (¿Acepta Discapacitados?) */}
              <div className="flex items-center justify-between">
                <label htmlFor="isAccessible" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  Accessible Spot (PCD)
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Designated for users with reduced mobility or special needs.
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
                Cancel
              </button>
              <button
                  type="submit"
                  // Lógica de validación ajustada para el modo simple y múltiple
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
                    ? 'Creating...'
                    : formData.isSingleSpot ? 'Create Spot' : 'Create Spots' // Texto del botón dinámico
                }
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}