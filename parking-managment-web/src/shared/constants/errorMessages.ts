/**
 * Centralized error message keys for consistent error handling across all features
 */
export const ERROR_MESSAGE_KEYS = {
  HTTP: {
    BAD_REQUEST: 'errors.badRequest',
    UNAUTHORIZED: 'errors.unauthorized',
    FORBIDDEN: 'errors.forbidden',
    NOT_FOUND: 'errors.notFound',
    CONFLICT: 'errors.conflict',
    VALIDATION_ERROR: 'errors.validationError',
    SERVER_ERROR: 'errors.serverError',
    SERVICE_UNAVAILABLE: 'errors.serviceUnavailable',
    HTTP_ERROR: 'errors.httpError',
  },
  NETWORK: {
    CONNECTION_ERROR: 'errors.networkError',
    TIMEOUT: 'errors.timeout',
    SERVER_ERROR: 'errors.serverError',
  },
  GENERAL: {
    UNKNOWN_ERROR: 'errors.unknownError',
    UNEXPECTED_ERROR: 'errors.unexpectedError',
  },
} as const;
