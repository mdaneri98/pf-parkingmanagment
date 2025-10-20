import { logger } from './logger';
import i18n from '@shared/i18n/config';
import { ERROR_MESSAGE_KEYS } from '@shared/constants/errorMessages';

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
  
  // HTTP Errors
  HTTP_BAD_REQUEST = 'HTTP_BAD_REQUEST',
  HTTP_UNAUTHORIZED = 'HTTP_UNAUTHORIZED',
  HTTP_FORBIDDEN = 'HTTP_FORBIDDEN',
  HTTP_NOT_FOUND = 'HTTP_NOT_FOUND',
  HTTP_CONFLICT = 'HTTP_CONFLICT',
  HTTP_UNPROCESSABLE_ENTITY = 'HTTP_UNPROCESSABLE_ENTITY',
  HTTP_SERVER_ERROR = 'HTTP_SERVER_ERROR',
  HTTP_SERVICE_UNAVAILABLE = 'HTTP_SERVICE_UNAVAILABLE',
  
  // API Errors
  API_NETWORK_ERROR = 'API_NETWORK_ERROR',
  API_TIMEOUT = 'API_TIMEOUT',
  API_SERVER_ERROR = 'API_SERVER_ERROR',
  API_NOT_FOUND = 'API_NOT_FOUND',
  API_VALIDATION_ERROR = 'API_VALIDATION_ERROR',
  
  // Network Errors
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  
  // Operation Errors
  OPERATION_CREATE_FAILED = 'OPERATION_CREATE_FAILED',
  OPERATION_UPDATE_FAILED = 'OPERATION_UPDATE_FAILED',
  OPERATION_DELETE_FAILED = 'OPERATION_DELETE_FAILED',
  OPERATION_LOAD_FAILED = 'OPERATION_LOAD_FAILED',
  
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
        return i18n.t('errors.sessionExpired');
      
      case ErrorCodes.AUTH_INVALID_CREDENTIALS:
        return i18n.t('errors.invalidCredentials');
      
      case ErrorCodes.AUTH_ACCESS_DENIED:
        return i18n.t('errors.accessDenied');
      
      case ErrorCodes.HTTP_BAD_REQUEST:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.BAD_REQUEST);
      
      case ErrorCodes.HTTP_UNAUTHORIZED:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.UNAUTHORIZED);
      
      case ErrorCodes.HTTP_FORBIDDEN:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.FORBIDDEN);
      
      case ErrorCodes.HTTP_NOT_FOUND:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.NOT_FOUND);
      
      case ErrorCodes.HTTP_CONFLICT:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.CONFLICT);
      
      case ErrorCodes.HTTP_UNPROCESSABLE_ENTITY:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.VALIDATION_ERROR);
      
      case ErrorCodes.HTTP_SERVER_ERROR:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.SERVER_ERROR);
      
      case ErrorCodes.HTTP_SERVICE_UNAVAILABLE:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.SERVICE_UNAVAILABLE);
      
      case ErrorCodes.API_NETWORK_ERROR:
      case ErrorCodes.NETWORK_TIMEOUT:
        return i18n.t(ERROR_MESSAGE_KEYS.NETWORK.CONNECTION_ERROR);
      
      case ErrorCodes.API_TIMEOUT:
        return i18n.t(ERROR_MESSAGE_KEYS.NETWORK.TIMEOUT);
      
      case ErrorCodes.API_SERVER_ERROR:
        return i18n.t(ERROR_MESSAGE_KEYS.NETWORK.SERVER_ERROR);
      
      case ErrorCodes.API_NOT_FOUND:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.NOT_FOUND);
      
      case ErrorCodes.API_VALIDATION_ERROR:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.VALIDATION_ERROR);
      
      case ErrorCodes.PARKING_LOT_NOT_FOUND:
        return i18n.t('errors.parkingLotNotFound');
      
      case ErrorCodes.PARKING_LOT_ACCESS_DENIED:
        return i18n.t('errors.parkingLotAccessDenied');
      
      case ErrorCodes.USER_NOT_FOUND:
        return i18n.t('errors.userNotFound');
      
      case 401:
        return i18n.t('errors.authenticationRequired');
      
      case 403:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.FORBIDDEN);
      
      case 404:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.NOT_FOUND);
      
      case 409:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.CONFLICT);
      
      case 422:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.VALIDATION_ERROR);
      
      case 429:
        return i18n.t('errors.tooManyRequests');
      
      case 500:
      case 502:
      case 503:
      case 504:
        return i18n.t(ERROR_MESSAGE_KEYS.HTTP.SERVER_ERROR);
      
      default:
        return i18n.t(ERROR_MESSAGE_KEYS.GENERAL.UNKNOWN_ERROR);
    }
  }

  /**
   * Transforms API errors into standardized AppError instances
   */
  static transformApiError(error: any, context: string): AppError {
    // Handle different error structures
    if (error?.data?.message) {
      return this.createError(
        error.data.message,
        error.data.code || ErrorCodes.API_SERVER_ERROR,
        { context, originalError: error }
      );
    }

    if (error?.message) {
      return this.createError(
        error.message,
        ErrorCodes.UNKNOWN_ERROR,
        { context, originalError: error }
      );
    }

    if (error?.status) {
      return this.createHttpError(error.status, context);
    }

    // Fallback for unknown errors
    return this.createError(
      i18n.t(ERROR_MESSAGE_KEYS.GENERAL.UNEXPECTED_ERROR),
      ErrorCodes.UNKNOWN_ERROR,
      { context, originalError: error }
    );
  }

  /**
   * Creates appropriate errors based on HTTP status codes
   */
  private static createHttpError(status: number, context: string): AppError {
    switch (status) {
      case 400:
        return this.createError(
          i18n.t(ERROR_MESSAGE_KEYS.HTTP.BAD_REQUEST),
          ErrorCodes.HTTP_BAD_REQUEST,
          { context, status }
        );
      case 401:
        return this.createError(
          i18n.t(ERROR_MESSAGE_KEYS.HTTP.UNAUTHORIZED),
          ErrorCodes.HTTP_UNAUTHORIZED,
          { context, status }
        );
      case 403:
        return this.createError(
          i18n.t(ERROR_MESSAGE_KEYS.HTTP.FORBIDDEN),
          ErrorCodes.HTTP_FORBIDDEN,
          { context, status }
        );
      case 404:
        return this.createError(
          i18n.t(ERROR_MESSAGE_KEYS.HTTP.NOT_FOUND),
          ErrorCodes.HTTP_NOT_FOUND,
          { context, status }
        );
      case 409:
        return this.createError(
          i18n.t(ERROR_MESSAGE_KEYS.HTTP.CONFLICT),
          ErrorCodes.HTTP_CONFLICT,
          { context, status }
        );
      case 422:
        return this.createError(
          i18n.t(ERROR_MESSAGE_KEYS.HTTP.VALIDATION_ERROR),
          ErrorCodes.HTTP_UNPROCESSABLE_ENTITY,
          { context, status }
        );
      case 500:
        return this.createError(
          i18n.t(ERROR_MESSAGE_KEYS.HTTP.SERVER_ERROR),
          ErrorCodes.HTTP_SERVER_ERROR,
          { context, status }
        );
      case 503:
        return this.createError(
          i18n.t(ERROR_MESSAGE_KEYS.HTTP.SERVICE_UNAVAILABLE),
          ErrorCodes.HTTP_SERVICE_UNAVAILABLE,
          { context, status }
        );
      default:
        return this.createError(
          i18n.t(ERROR_MESSAGE_KEYS.HTTP.HTTP_ERROR, { status }),
          ErrorCodes.UNKNOWN_ERROR,
          { context, status }
        );
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
      case 400:
        return ErrorCodes.HTTP_BAD_REQUEST;
      case 401:
        return ErrorCodes.AUTH_TOKEN_EXPIRED;
      case 403:
        return ErrorCodes.AUTH_ACCESS_DENIED;
      case 404:
        return ErrorCodes.HTTP_NOT_FOUND;
      case 409:
        return ErrorCodes.HTTP_CONFLICT;
      case 422:
        return ErrorCodes.HTTP_UNPROCESSABLE_ENTITY;
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorCodes.HTTP_SERVER_ERROR;
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
      ErrorCodes.NETWORK_TIMEOUT,
      ErrorCodes.HTTP_SERVER_ERROR,
      ErrorCodes.HTTP_SERVICE_UNAVAILABLE,
    ];

    // Retryable HTTP status codes
    const retryableStatuses = [408, 429, 500, 502, 503, 504];

    return retryableCodes.includes(code) || retryableStatuses.includes(status);
  }

  static shouldShowErrorToUser(error: AppError | any): boolean {
    // Don't show technical errors to users
    const technicalCodes = [
      ErrorCodes.UNKNOWN_ERROR,
      ErrorCodes.HTTP_SERVER_ERROR,
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
