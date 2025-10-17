import { useState, FormEvent } from 'react';
import type { WalkInStayFormData } from '../types';
import { 
  WALK_IN_STAY_CONSTANTS, 
  UI_LABELS 
} from '../constants/walkInStays';
import { 
  normalizeLicensePlate, 
  validateWalkInStayForm 
} from '../utils/walkInStayUtils';

interface WalkInStayFormProps {
  onSubmit: (formData: WalkInStayFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const WalkInStayForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: WalkInStayFormProps) => {
  const [licensePlate, setLicensePlate] = useState('');
  const [expectedHours, setExpectedHours] = useState(2);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData: WalkInStayFormData = {
      licensePlate: normalizeLicensePlate(licensePlate),
      expectedHours,
    };

    const validation = validateWalkInStayForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSubmit(formData);
  };

  const handleLicensePlateChange = (value: string) => {
    setLicensePlate(value.toUpperCase());
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* License Plate Input */}
      <div>
        <label 
          htmlFor="licensePlate" 
          className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
        >
          {UI_LABELS.LICENSE_PLATE}
        </label>
        <input
          id="licensePlate"
          type="text"
          value={licensePlate}
          onChange={(e) => handleLicensePlateChange(e.target.value)}
          placeholder={UI_LABELS.LICENSE_PLATE_PLACEHOLDER}
          disabled={isLoading}
          className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md 
                     bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
          autoFocus
        />
      </div>

      {/* Expected Hours Button Grid */}
      <div>
        <label 
          className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2"
        >
          {UI_LABELS.EXPECTED_HOURS}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {WALK_IN_STAY_CONSTANTS.EXTEND_OPTIONS.map((hours) => (
            <button
              key={hours}
              type="button"
              onClick={() => setExpectedHours(hours)}
              disabled={isLoading}
              className={`
                px-3 py-2 text-sm font-medium rounded-md border transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${expectedHours === hours 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
                }
              `}
            >
              {hours}h
            </button>
          ))}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          {errors.map((error, index) => (
            <p key={index} className="text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 
                     text-neutral-700 dark:text-neutral-300 rounded-md
                     hover:bg-neutral-50 dark:hover:bg-neutral-800
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {UI_LABELS.CANCEL}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors font-medium"
        >
          {isLoading ? 'Creating...' : UI_LABELS.SUBMIT}
        </button>
      </div>
    </form>
  );
};

