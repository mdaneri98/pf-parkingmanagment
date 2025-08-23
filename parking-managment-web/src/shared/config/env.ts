export const config = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Parking Management',
  appVersion: (globalThis as any).__APP_VERSION__ ?? '0.1.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api',
  enableLogging: (import.meta.env.VITE_ENABLE_LOGGING ?? 'true') === 'true',
  enableDebug: (import.meta.env.VITE_ENABLE_DEBUG ?? 'true') === 'true',
  
  // API Configuration
  api: {
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT ?? '30000', 10),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS ?? '3', 10),
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY ?? '1000', 10),
  },
  
  // Polling Configuration
  polling: {
    dashboardInterval: parseInt(import.meta.env.VITE_DASHBOARD_POLLING_INTERVAL ?? '30000', 10),
    backgroundRefreshInterval: parseInt(import.meta.env.VITE_BACKGROUND_REFRESH_INTERVAL ?? '300000', 10),
  },
  
  // Token Configuration
  auth: {
    tokenRefreshThreshold: parseInt(import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD ?? '60', 10), // seconds
    maxRefreshAttempts: parseInt(import.meta.env.VITE_MAX_REFRESH_ATTEMPTS ?? '3', 10),
  },
  
  // Feature Flags
  features: {
    enableOfflineMode: (import.meta.env.VITE_ENABLE_OFFLINE_MODE ?? 'false') === 'true',
    enableAnalytics: (import.meta.env.VITE_ENABLE_ANALYTICS ?? 'false') === 'true',
    enableNotifications: (import.meta.env.VITE_ENABLE_NOTIFICATIONS ?? 'true') === 'true',
  },
  
  // Environment Detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
};


