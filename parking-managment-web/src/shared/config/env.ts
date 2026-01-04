export const config = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Parking Management',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  enableLogging: (import.meta.env.VITE_ENABLE_LOGGING ?? 'true') === 'true',
  enableDebug: (import.meta.env.VITE_ENABLE_DEBUG ?? 'true') === 'true',
  enableHttpLogging: (import.meta.env.VITE_ENABLE_HTTP_LOGGING ?? 'false') === 'true',
  
  // Polling Configuration
  polling: {
    dashboardInterval: parseInt(import.meta.env.VITE_DASHBOARD_POLLING_INTERVAL ?? '30000', 10),
  },
};


