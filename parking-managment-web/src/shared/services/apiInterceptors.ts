import { logger } from '../utils/logger';
import { AppErrorHandler, ErrorCodes } from '../utils/errorHandling';
import { config } from '../config/env';

export interface RequestInterceptor {
  name: string;
  onRequest?: (url: string, options: RequestInit) => RequestInit | Promise<RequestInit>;
  onResponse?: (response: Response, url: string, options: RequestInit) => Response | Promise<Response>;
  onError?: (error: any, url: string, options: RequestInit) => void | Promise<void>;
}

export class ApiInterceptorService {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: RequestInterceptor[] = [];
  private errorInterceptors: RequestInterceptor[] = [];

  constructor() {
    this.registerDefaultInterceptors();
  }

  /**
   * Register a request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    if (interceptor.onRequest) {
      this.requestInterceptors.push(interceptor);
      logger.debug('Request interceptor registered', { name: interceptor.name });
    }
  }

  /**
   * Register a response interceptor
   */
  addResponseInterceptor(interceptor: RequestInterceptor): void {
    if (interceptor.onResponse) {
      this.responseInterceptors.push(interceptor);
      logger.debug('Response interceptor registered', { name: interceptor.name });
    }
  }

  /**
   * Register an error interceptor
   */
  addErrorInterceptor(interceptor: RequestInterceptor): void {
    if (interceptor.onError) {
      this.errorInterceptors.push(interceptor);
      logger.debug('Error interceptor registered', { name: interceptor.name });
    }
  }

  /**
   * Process request through all interceptors
   */
  async processRequest(url: string, options: RequestInit): Promise<RequestInit> {
    let processedOptions = { ...options };

    for (const interceptor of this.requestInterceptors) {
      try {
        if (interceptor.onRequest) {
          processedOptions = await interceptor.onRequest(url, processedOptions);
        }
      } catch (error) {
        logger.error('Request interceptor failed', {
          interceptor: interceptor.name,
          url,
          error,
        });
      }
    }

    return processedOptions;
  }

  /**
   * Process response through all interceptors
   */
  async processResponse(response: Response, url: string, options: RequestInit): Promise<Response> {
    let processedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      try {
        if (interceptor.onResponse) {
          processedResponse = await interceptor.onResponse(processedResponse, url, options);
        }
      } catch (error) {
        logger.error('Response interceptor failed', {
          interceptor: interceptor.name,
          url,
          error,
        });
      }
    }

    return processedResponse;
  }

  /**
   * Process error through all interceptors
   */
  async processError(error: any, url: string, options: RequestInit): Promise<void> {
    for (const interceptor of this.errorInterceptors) {
      try {
        if (interceptor.onError) {
          await interceptor.onError(error, url, options);
        }
      } catch (interceptorError) {
        logger.error('Error interceptor failed', {
          interceptor: interceptor.name,
          url,
          originalError: error,
          interceptorError,
        });
      }
    }
  }

  /**
   * Register default interceptors
   */
  private registerDefaultInterceptors(): void {
    // Request logging interceptor
    this.addRequestInterceptor({
      name: 'RequestLogger',
      onRequest: (url, options) => {
        const requestId = Math.random().toString(36).substring(7);
        
        logger.debug('API Request Intercepted', {
          requestId,
          url,
          method: options.method || 'GET',
          hasBody: !!options.body,
          timestamp: new Date().toISOString(),
        });

        // Add request ID to headers for tracing
        const headers = new Headers(options.headers);
        headers.set('X-Request-ID', requestId);

        return {
          ...options,
          headers,
        };
      },
    });

    // Timeout interceptor
    this.addRequestInterceptor({
      name: 'TimeoutHandler',
      onRequest: (url, options) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          logger.warn('Request timed out', { url, timeout: config.api.timeout });
        }, config.api.timeout);

        // Clear timeout when request completes
        const originalSignal = options.signal;
        if (originalSignal) {
          originalSignal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
          });
        }

        return {
          ...options,
          signal: controller.signal,
        };
      },
    });

    // Response validation interceptor
    this.addResponseInterceptor({
      name: 'ResponseValidator',
      onResponse: async (response, url, options) => {
        const requestId = response.headers.get('X-Request-ID');
        
        logger.debug('API Response Intercepted', {
          requestId,
          url,
          status: response.status,
          statusText: response.statusText,
          timestamp: new Date().toISOString(),
        });

        // Validate response status
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.clone().json();
          } catch {
            errorData = await response.clone().text();
          }

          const error = AppErrorHandler.createError(
            `API request failed: ${response.status} ${response.statusText}`,
            this.getErrorCodeFromStatus(response.status),
            {
              url,
              status: response.status,
              statusText: response.statusText,
              requestId,
              responseData: errorData,
            }
          );

          throw error;
        }

        return response;
      },
    });

    // Rate limiting interceptor
    this.addResponseInterceptor({
      name: 'RateLimitHandler',
      onResponse: (response, url) => {
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        const rateLimitReset = response.headers.get('X-RateLimit-Reset');
        
        if (rateLimitRemaining && parseInt(rateLimitRemaining) < 10) {
          logger.warn('API rate limit approaching', {
            url,
            remaining: rateLimitRemaining,
            resetTime: rateLimitReset,
          });
        }

        return response;
      },
    });

    // Error logging interceptor
    this.addErrorInterceptor({
      name: 'ErrorLogger',
      onError: (error, url, options) => {
        const requestId = Math.random().toString(36).substring(7);
        
        logger.error('API Request Failed', {
          requestId,
          url,
          method: options.method || 'GET',
          error: error.message || error,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });

        // Report to monitoring service in production
        if (config.isProduction && config.features.enableAnalytics) {
          this.reportErrorToMonitoring(error, url, options);
        }
      },
    });

    // Retry interceptor for retryable errors
    this.addErrorInterceptor({
      name: 'RetryHandler',
      onError: async (error, url, options) => {
        if (AppErrorHandler.isRetryableError(error) && !options.retryCount) {
          logger.info('Attempting request retry', {
            url,
            error: error.message,
            retryAttempt: 1,
          });
          
          // Add retry logic here if needed
          // This is a placeholder for more sophisticated retry logic
        }
      },
    });
  }

  /**
   * Get error code from HTTP status
   */
  private getErrorCodeFromStatus(status: number): ErrorCodes {
    switch (status) {
      case 400:
        return ErrorCodes.API_VALIDATION_ERROR;
      case 401:
        return ErrorCodes.AUTH_TOKEN_EXPIRED;
      case 403:
        return ErrorCodes.AUTH_ACCESS_DENIED;
      case 404:
        return ErrorCodes.API_NOT_FOUND;
      case 408:
        return ErrorCodes.API_TIMEOUT;
      case 429:
        return ErrorCodes.API_TIMEOUT; // Rate limited
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorCodes.API_SERVER_ERROR;
      default:
        return ErrorCodes.UNKNOWN_ERROR;
    }
  }

  /**
   * Report error to monitoring service
   */
  private reportErrorToMonitoring(error: any, url: string, options: RequestInit): void {
    try {
      // Placeholder for monitoring service integration
      // Could integrate with services like Sentry, DataDog, etc.
      logger.debug('Reporting error to monitoring service', {
        url,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } catch (reportingError) {
      logger.error('Failed to report error to monitoring service', {
        originalError: error,
        reportingError,
      });
    }
  }
}

// Create singleton instance
export const apiInterceptors = new ApiInterceptorService();

// Enhanced fetch function with interceptors
export async function interceptedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    // Process request through interceptors
    const processedOptions = await apiInterceptors.processRequest(url, options);
    
    // Make the request
    const response = await fetch(url, processedOptions);
    
    // Process response through interceptors
    const processedResponse = await apiInterceptors.processResponse(response, url, processedOptions);
    
    return processedResponse;
  } catch (error) {
    // Process error through interceptors
    await apiInterceptors.processError(error, url, options);
    throw error;
  }
}

export default apiInterceptors;
