import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';
import i18n from '../i18n/config';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error boundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    }, error);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="ml-3 text-sm font-medium text-red-800">
                  {i18n.t('shared.errorBoundary.title')}
                </h3>
              </div>
              <div className="text-sm text-red-700 mb-4">
                {i18n.t('shared.errorBoundary.message')}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={this.handleRetry}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  {i18n.t('shared.errorBoundary.tryAgain')}
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  {i18n.t('shared.errorBoundary.refreshPage')}
                </button>
              </div>
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4">
                  <summary className="text-xs text-red-600 cursor-pointer">
                    {i18n.t('shared.errorBoundary.errorDetails')}
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
