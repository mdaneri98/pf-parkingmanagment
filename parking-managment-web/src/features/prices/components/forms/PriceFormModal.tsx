import { useState, useEffect } from 'react';
import { Input } from '@shared/ui/components';
import { getVehicleTypeOptions, VEHICLE_TYPES } from '@shared/constants';
import type { PriceFormData, ParkingPriceResponse, PriceValidationError } from '@prices/types';
import { 
  validatePriceFormData, 
  formatDateTimeForInput, 
  parseDateTimeFromInput,
  apiResponseToFormData,
} from '../../utils/priceUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: PriceFormData) => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  initialData?: ParkingPriceResponse;
  existingPrices?: ParkingPriceResponse[];
  title?: string;
}

const getDefaultFormData = (): PriceFormData => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return {
    vehicleType: VEHICLE_TYPES.CAR,
    price: 0,
    validFrom: tomorrow,
    validTo: nextMonth,
  };
};

export function PriceFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  mode,
  initialData,
  existingPrices,
  title,
}: Props) {
  const [formData, setFormData] = useState<PriceFormData>(getDefaultFormData());
  const [validationErrors, setValidationErrors] = useState<PriceValidationError[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const vehicleTypeOptions = getVehicleTypeOptions();
  const modalTitle = title || (mode === 'create' ? 'Create Price Rule' : 'Edit Price Rule');

  // Initialize form data when modal opens or initial data changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(apiResponseToFormData(initialData));
      } else {
        setFormData(getDefaultFormData());
      }
      setValidationErrors([]);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, mode, initialData]);

  // Validate form data when it changes (only after first submit attempt)
  useEffect(() => {
    if (hasAttemptedSubmit) {
      const validation = validatePriceFormData(
        formData, 
        existingPrices, 
        mode === 'edit' ? initialData?.id : undefined
      );
      setValidationErrors(validation.errors);
    }
  }, [formData, hasAttemptedSubmit, existingPrices, mode, initialData?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    
    const validation = validatePriceFormData(
      formData, 
      existingPrices, 
      mode === 'edit' ? initialData?.id : undefined
    );
    setValidationErrors(validation.errors);
    
    if (validation.isValid) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData(getDefaultFormData());
    setValidationErrors([]);
    setHasAttemptedSubmit(false);
  };

  const getFieldError = (fieldName: keyof PriceFormData): string | undefined => {
    return validationErrors.find(error => error.field === fieldName)?.message;
  };

  const updateField = <K extends keyof PriceFormData>(
    field: K, 
    value: PriceFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {modalTitle}
          </h2>
          <button 
            onClick={handleClose} 
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Vehicle Type */}
          <div>
            <label htmlFor="vehicleType" className="label">
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              value={formData.vehicleType}
              onChange={(e) => updateField('vehicleType', e.target.value as any)}
              className="input"
              disabled={isLoading}
            >
              {vehicleTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
            {getFieldError('vehicleType') && (
              <p className="error-text">{getFieldError('vehicleType')}</p>
            )}
          </div>

          {/* Price */}
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            min="0.01"
            max="9999.99"
            value={formData.price || ''}
            onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
            error={getFieldError('price')}
            disabled={isLoading}
            placeholder="0.00"
            leftIcon={<span className="text-sm">$</span>}
          />

          {/* Valid From */}
          <Input
            label="Valid From"
            type="datetime-local"
            value={formatDateTimeForInput(formData.validFrom)}
            onChange={(e) => updateField('validFrom', parseDateTimeFromInput(e.target.value))}
            error={getFieldError('validFrom')}
            disabled={isLoading}
            helpText="When this price rule starts being effective"
          />

          {/* Valid To */}
          <Input
            label="Valid To"
            type="datetime-local"
            value={formatDateTimeForInput(formData.validTo)}
            onChange={(e) => updateField('validTo', parseDateTimeFromInput(e.target.value))}
            error={getFieldError('validTo')}
            disabled={isLoading}
            helpText="When this price rule expires"
          />

          <p>
              <span className="font-medium">Duration:</span>{' '}
              {Math.ceil((formData.validTo.getTime() - formData.validFrom.getTime()) / (1000 * 60 * 60 * 24))} days
          </p>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </div>
              ) : (
                mode === 'create' ? 'Create Price Rule' : 'Update Price Rule'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
