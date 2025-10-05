import { ParkingError } from '../types';
import { ERROR_MESSAGES } from '../constants/parking';

/**
 * Enhanced error handling service for parking operations
 */
export class ErrorHandlingService {
  /**
   * Transforms API errors into standardized ParkingError instances
   */
  static transformApiError(error: any, context: string): ParkingError {
    // Handle different error structures
    if (error?.data?.message) {
      return new ParkingError(
        error.data.message,
        error.data.code || 'API_ERROR',
        { context, originalError: error }
      );
    }

    if (error?.message) {
      return new ParkingError(
        error.message,
        'GENERIC_ERROR',
        { context, originalError: error }
      );
    }

    if (error?.status) {
      return this.createHttpError(error.status, context);
    }

    // Fallback for unknown errors
    return new ParkingError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR',
      { context, originalError: error }
    );
  }

  /**
   * Creates appropriate errors based on HTTP status codes
   */
  private static createHttpError(status: number, context: string): ParkingError {
    switch (status) {
      case 400:
        return new ParkingError(
          'Invalid request. Please check your input.',
          'BAD_REQUEST',
          { context, status }
        );
      case 401:
        return new ParkingError(
          'You are not authorized to perform this action.',
          'UNAUTHORIZED',
          { context, status }
        );
      case 403:
        return new ParkingError(
          'You do not have permission to perform this action.',
          'FORBIDDEN',
          { context, status }
        );
      case 404:
        return new ParkingError(
          'The requested resource was not found.',
          'NOT_FOUND',
          { context, status }
        );
      case 409:
        return new ParkingError(
          'This action conflicts with the current state.',
          'CONFLICT',
          { context, status }
        );
      case 422:
        return new ParkingError(
          'The data provided is invalid.',
          'VALIDATION_ERROR',
          { context, status }
        );
      case 500:
        return new ParkingError(
          ERROR_MESSAGES.NETWORK.SERVER_ERROR,
          'SERVER_ERROR',
          { context, status }
        );
      case 503:
        return new ParkingError(
          'Service is temporarily unavailable.',
          'SERVICE_UNAVAILABLE',
          { context, status }
        );
      default:
        return new ParkingError(
          `HTTP Error ${status}`,
          'HTTP_ERROR',
          { context, status }
        );
    }
  }

  /**
   * Determines if an error is retryable
   */
  static isRetryableError(error: ParkingError): boolean {
    const retryableCodes = [
      'NETWORK_ERROR',
      'TIMEOUT',
      'SERVER_ERROR',
      'SERVICE_UNAVAILABLE'
    ];
    return retryableCodes.includes(error.code);
  }

  /**
   * Gets user-friendly error message
   */
  static getUserFriendlyMessage(error: ParkingError): string {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return ERROR_MESSAGES.NETWORK.CONNECTION_ERROR;
      case 'TIMEOUT':
        return ERROR_MESSAGES.NETWORK.TIMEOUT;
      case 'SERVER_ERROR':
        return ERROR_MESSAGES.NETWORK.SERVER_ERROR;
      case 'VALIDATION_ERROR':
        return error.message; // Validation messages are usually user-friendly
      case 'NOT_FOUND':
        return 'The requested item could not be found.';
      case 'UNAUTHORIZED':
        return 'Please log in to continue.';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  /**
   * Logs errors for debugging (in development) or monitoring (in production)
   */
  static logError(error: ParkingError, context?: Record<string, unknown>): void {
    const errorInfo = {
      message: error.message,
      code: error.code,
      details: error.details,
      context,
      timestamp: new Date().toISOString(),
    };

    if (import.meta.env.DEV) {
      console.error('[ParkingError]', errorInfo);
    } else {
      // In production, you might want to send to a monitoring service
      // Example: sendToMonitoringService(errorInfo);
    }
  }
}
