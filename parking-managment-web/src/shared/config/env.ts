export const config = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Parking Management',
  appVersion: (globalThis as any).__APP_VERSION__ ?? '0.1.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api',
  enableLogging: (import.meta.env.VITE_ENABLE_LOGGING ?? 'true') === 'true',
  enableDebug: (import.meta.env.VITE_ENABLE_DEBUG ?? 'true') === 'true',
};


