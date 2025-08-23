import { useMemo } from 'react';
import { logger, LogLevel, LogContext } from '../shared/utils/logger';

/**
 * Custom hook for accessing the logger throughout the application
 * Provides convenient methods for logging with React context awareness
 */
export const useLogger = () => {
  // Memoize logger methods to prevent unnecessary re-renders
  const logMethods = useMemo(() => ({
    error: (message: string, context?: LogContext, error?: Error) => {
      logger.error(message, { ...context, hook: 'useLogger' }, error);
    },
    
    warn: (message: string, context?: LogContext) => {
      logger.warn(message, { ...context, hook: 'useLogger' });
    },
    
    info: (message: string, context?: LogContext) => {
      logger.info(message, { ...context, hook: 'useLogger' });
    },
    
    debug: (message: string, context?: LogContext) => {
      logger.debug(message, { ...context, hook: 'useLogger' });
    },
    
    trace: (message: string, context?: LogContext) => {
      logger.trace(message, { ...context, hook: 'useLogger' });
    },

    // API-specific logging
    apiRequest: (method: string, url: string, context?: LogContext) => {
      logger.apiRequest(method, url, { ...context, hook: 'useLogger' });
    },

    apiResponse: (status: number, url: string, responseTime?: number, context?: LogContext) => {
      logger.apiResponse(status, url, responseTime, { ...context, hook: 'useLogger' });
    },

    apiError: (error: any, url: string, context?: LogContext) => {
      logger.apiError(error, url, { ...context, hook: 'useLogger' });
    },

    // Auth-specific logging
    authEvent: (event: string, context?: LogContext) => {
      logger.authEvent(event, { ...context, hook: 'useLogger' });
    },

    tokenRefresh: (attempt: number, success: boolean, context?: LogContext) => {
      logger.tokenRefresh(attempt, success, { ...context, hook: 'useLogger' });
    },

    // Performance logging
    performance: (operation: string, duration: number, context?: LogContext) => {
      logger.performance(operation, duration, { ...context, hook: 'useLogger' });
    },

    // Utility methods
    setLevel: (level: LogLevel) => {
      logger.setLevel(level);
    },

    setEnabled: (enabled: boolean) => {
      logger.setEnabled(enabled);
    },

    // Component lifecycle logging
    componentMount: (componentName: string, props?: any) => {
      logger.debug(`Component mounted: ${componentName}`, {
        componentName,
        props: props ? Object.keys(props) : undefined,
        hook: 'useLogger',
      });
    },

    componentUnmount: (componentName: string) => {
      logger.debug(`Component unmounted: ${componentName}`, {
        componentName,
        hook: 'useLogger',
      });
    },

    // User interaction logging
    userAction: (action: string, context?: LogContext) => {
      logger.info(`User action: ${action}`, {
        action,
        timestamp: new Date().toISOString(),
        hook: 'useLogger',
        ...context,
      });
    },

    // Form logging
    formEvent: (event: string, formName: string, context?: LogContext) => {
      logger.debug(`Form event: ${event}`, {
        event,
        formName,
        timestamp: new Date().toISOString(),
        hook: 'useLogger',
        ...context,
      });
    },

    formValidation: (formName: string, isValid: boolean, errors?: any) => {
      const level = isValid ? LogLevel.DEBUG : LogLevel.WARN;
      const message = `Form validation: ${formName} - ${isValid ? 'VALID' : 'INVALID'}`;
      
      if (level === LogLevel.WARN) {
        logger.warn(message, {
          formName,
          isValid,
          errorCount: errors ? Object.keys(errors).length : 0,
          hook: 'useLogger',
        });
      } else {
        logger.debug(message, {
          formName,
          isValid,
          hook: 'useLogger',
        });
      }
    },
  }), []);

  return logMethods;
};

export default useLogger;
