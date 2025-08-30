import { logger } from './logger';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

export interface AppError extends Error {
  code?: string;
  context?: ErrorContext;
  isUserFriendly?: boolean;
}

export enum ErrorCodes {
  // Authentication Errors
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_ACCESS_DENIED = 'AUTH_ACCESS_DENIED',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  
  // API Errors
  API_NETWORK_ERROR = 'API_NETWORK_ERROR',
  API_TIMEOUT = 'API_TIMEOUT',
  API_SERVER_ERROR = 'API_SERVER_ERROR',
  API_NOT_FOUND = 'API_NOT_FOUND',
  API_VALIDATION_ERROR = 'API_VALIDATION_ERROR',
  
  // Business Logic Errors
  PARKING_LOT_NOT_FOUND = 'PARKING_LOT_NOT_FOUND',
  PARKING_LOT_ACCESS_DENIED = 'PARKING_LOT_ACCESS_DENIED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  
  // General Errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class AppErrorHandler {
  static createError(
    message: string,
    code: ErrorCodes = ErrorCodes.UNKNOWN_ERROR,
    context?: ErrorContext,
    isUserFriendly = true
  ): AppError {
    const error = new Error(message) as AppError;
    error.code = code;
    error.context = context;
    error.isUserFriendly = isUserFriendly;
    return error;
  }

  static getUserFriendlyMessage(error: AppError | Error | any): string {
    if (error?.isUserFriendly && error.message) {
      return error.message;
    }

    const code = error?.code || error?.status;
    
    switch (code) {
      case ErrorCodes.AUTH_TOKEN_EXPIRED:
      case ErrorCodes.AUTH_SESSION_EXPIRED:
        return 'Your session has expired. Please sign in again.';
      
      case ErrorCodes.AUTH_INVALID_CREDENTIALS:
        return 'Invalid email or password. Please check your credentials and try again.';
      
      case ErrorCodes.AUTH_ACCESS_DENIED:
        return 'Access denied. You do not have permission to perform this action.';
      
      case ErrorCodes.API_NETWORK_ERROR:
        return 'Network error. Please check your internet connection and try again.';
      
      case ErrorCodes.API_TIMEOUT:
        return 'Request timed out. Please try again.';
      
      case ErrorCodes.API_SERVER_ERROR:
        return 'Server error. Please try again later or contact support.';
      
      case ErrorCodes.API_NOT_FOUND:
        return 'The requested resource was not found.';
      
      case ErrorCodes.API_VALIDATION_ERROR:
        return 'Please check your input and try again.';
      
      case ErrorCodes.PARKING_LOT_NOT_FOUND:
        return 'Parking lot not found. Please select a different parking lot.';
      
      case ErrorCodes.PARKING_LOT_ACCESS_DENIED:
        return 'You do not have access to this parking lot.';
      
      case ErrorCodes.USER_NOT_FOUND:
        return 'User not found';
      
      case 401:
        return 'Authentication required. Please sign in.';
      
      case 403:
        return 'Access forbidden. You do not have permission to perform this action.';
      
      case 404:
        return 'The requested resource was not found.';
      
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later.';
      
      default:
        return 'An unexpected error occurred.';
    }
  }

  static handleError(error: any, context?: ErrorContext): AppError {
    // Convert various error types to AppError
    let appError: AppError;

    if (error instanceof Error) {
      appError = error as AppError;
      if (!appError.code) {
        appError.code = ErrorCodes.UNKNOWN_ERROR;
      }
    } else if (typeof error === 'string') {
      appError = this.createError(error, ErrorCodes.UNKNOWN_ERROR, context);
    } else if (error?.status) {
      // API error
      const message = error.data?.message || error.statusText || 'API Error';
      appError = this.createError(message, this.getErrorCodeFromStatus(error.status), context);
    } else {
      appError = this.createError('Unknown error occurred', ErrorCodes.UNKNOWN_ERROR, context);
    }

    // Merge context
    if (context) {
      appError.context = { ...appError.context, ...context };
    }

    // Log the error
    logger.error(`Error handled: ${appError.code}`, {
      message: appError.message,
      code: appError.code,
      context: appError.context,
      stack: appError.stack,
    });

    return appError;
  }

  private static getErrorCodeFromStatus(status: number): ErrorCodes {
    switch (status) {
      case 401:
        return ErrorCodes.AUTH_TOKEN_EXPIRED;
      case 403:
        return ErrorCodes.AUTH_ACCESS_DENIED;
      case 404:
        return ErrorCodes.API_NOT_FOUND;
      case 422:
        return ErrorCodes.API_VALIDATION_ERROR;
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorCodes.API_SERVER_ERROR;
      default:
        return ErrorCodes.UNKNOWN_ERROR;
    }
  }

  static isRetryableError(error: AppError | any): boolean {
    const code = error?.code;
    const status = error?.status;

    // Retryable error codes
    const retryableCodes = [
      ErrorCodes.API_NETWORK_ERROR,
      ErrorCodes.API_TIMEOUT,
      ErrorCodes.API_SERVER_ERROR,
    ];

    // Retryable HTTP status codes
    const retryableStatuses = [408, 429, 500, 502, 503, 504];

    return retryableCodes.includes(code) || retryableStatuses.includes(status);
  }

  static shouldShowErrorToUser(error: AppError | any): boolean {
    // Don't show technical errors to users
    const technicalCodes = [
      ErrorCodes.UNKNOWN_ERROR,
      ErrorCodes.API_SERVER_ERROR,
    ];

    return !technicalCodes.includes(error?.code) && error?.isUserFriendly !== false;
  }
}

// Utility hook for error handling in components
export function useErrorHandler() {
  return {
    handleError: (error: any, context?: ErrorContext) => {
      return AppErrorHandler.handleError(error, context);
    },
    
    getUserFriendlyMessage: (error: any) => {
      return AppErrorHandler.getUserFriendlyMessage(error);
    },
    
    isRetryable: (error: any) => {
      return AppErrorHandler.isRetryableError(error);
    },
    
    shouldShow: (error: any) => {
      return AppErrorHandler.shouldShowErrorToUser(error);
    },
  };
}
