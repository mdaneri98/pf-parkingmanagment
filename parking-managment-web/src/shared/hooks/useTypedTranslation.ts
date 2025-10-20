import { useTranslation } from 'react-i18next';

/**
 * Type-safe translation hook
 * Wraps useTranslation from react-i18next with type safety
 */
export function useTypedTranslation() {
  return useTranslation();
}

