import { config } from '../config/env';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4,
}

export interface LogContext {
  [key: string]: any;
}

class Logger {
  private isEnabled: boolean;
  private currentLevel: LogLevel;
  private prefix: string;

  constructor() {
    this.isEnabled = config.enableLogging;
    this.currentLevel = config.enableDebug ? LogLevel.DEBUG : LogLevel.INFO;
    this.prefix = `[${config.appName}]`;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.isEnabled && level <= this.currentLevel;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `${this.prefix} ${timestamp} [${level}] ${message}${contextStr}`;
  }

  private log(level: LogLevel, levelName: string, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(levelName, message, context);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, error || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.TRACE:
        console.trace(formattedMessage);
        break;
    }
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, 'ERROR', message, context, error);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, 'WARN', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, 'INFO', message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, context);
  }

  trace(message: string, context?: LogContext): void {
    this.log(LogLevel.TRACE, 'TRACE', message, context);
  }

  // API-specific logging methods
  apiRequest(method: string, url: string, context?: LogContext): void {
    this.debug(`API Request: ${method} ${url}`, {
      method,
      url,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

  apiResponse(status: number, url: string, responseTime?: number, context?: LogContext): void {
    const level = status >= 400 ? LogLevel.WARN : LogLevel.DEBUG;
    const message = `API Response: ${status} ${url}`;
    const logContext = {
      status,
      url,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
      timestamp: new Date().toISOString(),
      ...context,
    };

    if (level === LogLevel.WARN) {
      this.warn(message, logContext);
    } else {
      this.debug(message, logContext);
    }
  }

  apiError(error: any, url: string, context?: LogContext): void {
    this.error(`API Error: ${url}`, {
      url,
      error: error?.message || error?.toString(),
      status: error?.status,
      timestamp: new Date().toISOString(),
      ...context,
    }, error instanceof Error ? error : undefined);
  }

  // Auth-specific logging methods
  authEvent(event: string, context?: LogContext): void {
    this.info(`Auth Event: ${event}`, {
      event,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

}

// Create and export a singleton instance
export const logger = new Logger();

// Export the class for testing or custom instances
export { Logger };
