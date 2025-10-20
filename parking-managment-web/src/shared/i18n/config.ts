import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './resources/en.json';
import es from './resources/es.json';

// Define supported languages
export const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Language detection order configuration
const detectionOptions = {
  // Order of language detection
  order: ['localStorage', 'navigator'],
  
  // Keys to lookup language in localStorage
  lookupLocalStorage: 'i18nextLng',
  
  // Cache user language
  caches: ['localStorage'],
  
  // Optional: exclude cache for certain languages
  excludeCacheFor: ['cimode'],
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Language detection
  .use(initReactI18next) // React integration
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    
    fallbackLng: 'en', // Fallback language
    supportedLngs: SUPPORTED_LANGUAGES,
    
    detection: detectionOptions,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false, // Disable suspense for better error handling
    },
    
    // Debug mode (set to false in production)
    debug: false,
  });

export default i18n;

