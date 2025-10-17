import { useState, FormEvent } from 'react';
import { WALK_IN_STAY_CONSTANTS, UI_LABELS } from '../constants/walkInStays';

interface ExtendTimeFormProps {
  onSubmit: (extraHours: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
  currentExpiry?: string;
}

export const ExtendTimeForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  currentExpiry,
}: ExtendTimeFormProps) => {
  const [extraHours, setExtraHours] = useState(1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(extraHours);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Current Expiry Info */}
      {currentExpiry && (
        <div className="p-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-md">
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {UI_LABELS.CURRENT_EXPIRY}: <span className="font-medium text-neutral-900 dark:text-neutral-100">{currentExpiry}</span>
          </p>
        </div>
      )}

      {/* Extra Hours Button Grid */}
      <div>
        <label 
          className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2"
        >
          {UI_LABELS.EXTRA_HOURS}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {WALK_IN_STAY_CONSTANTS.EXTEND_OPTIONS.map((hours) => (
            <button
              key={hours}
              type="button"
              onClick={() => setExtraHours(hours)}
              disabled={isLoading}
              autoFocus={hours === 1}
              className={`
                px-3 py-2 text-sm font-medium rounded-md border transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${extraHours === hours 
                  ? 'bg-green-600 text-white border-green-600 shadow-sm' 
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
                }
              `}
            >
              +{hours}h
            </button>
          ))}
        </div>
      </div>

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
          className="flex-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors font-medium"
        >
          {isLoading ? 'Extending...' : UI_LABELS.CONFIRM}
        </button>
      </div>
    </form>
  );
};

