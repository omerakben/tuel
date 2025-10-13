/**
 * Comprehensive error boundary system for TUEL components
 * Provides graceful fallbacks, error logging, and recovery mechanisms
 */

import React, { Component, ErrorInfo, ReactNode } from "react";

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  onRetry?: (errorId: string, retryCount: number) => void;
  maxRetries?: number;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  errorComponent?: React.ComponentType<ErrorFallbackProps>;
  logErrors?: boolean;
  showErrorDetails?: boolean;
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  errorId: string;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onReset: () => void;
  showErrorDetails: boolean;
}

/**
 * Default error fallback component
 */
export function DefaultErrorFallback({
  error,
  errorId,
  retryCount,
  maxRetries,
  onRetry,
  onReset,
  showErrorDetails,
}: ErrorFallbackProps) {
  const canRetry = retryCount < maxRetries;

  return (
    <div
      className="tuel-error-boundary"
      style={{
        padding: "1rem",
        border: "1px solid #e53e3e",
        borderRadius: "0.5rem",
        backgroundColor: "#fed7d7",
        color: "#742a2a",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>🚨 Animation Error</strong>
      </div>

      <div style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
        Something went wrong with this animation component.
        {showErrorDetails && (
          <details style={{ marginTop: "0.5rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              Error Details
            </summary>
            <pre
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem",
                backgroundColor: "#f7fafc",
                borderRadius: "0.25rem",
                fontSize: "0.75rem",
                overflow: "auto",
              }}
            >
              {error.message}
              {error.stack && `\n\nStack trace:\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {canRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3182ce",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Retry ({retryCount + 1}/{maxRetries})
          </button>
        )}

        <button
          onClick={onReset}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#718096",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Reset
        </button>
      </div>

      {showErrorDetails && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", opacity: 0.7 }}>
          Error ID: {errorId}
        </div>
      )}
    </div>
  );
}

/**
 * Generate unique error ID for tracking
 */
function generateErrorId(): string {
  return `tuel-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log error to console and external services
 */
function logError(
  error: Error,
  errorInfo: ErrorInfo,
  errorId: string,
  logErrors: boolean = true
): void {
  if (!logErrors) return;

  const errorData = {
    errorId,
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "server",
  };

  // Console logging
  console.group(`🚨 TUEL Error Boundary - ${errorId}`);
  console.error("Error:", error);
  console.error("Error Info:", errorInfo);
  console.error("Error Data:", errorData);
  console.groupEnd();

  // In production, you might want to send this to an error tracking service
  // Example: Sentry.captureException(error, { extra: errorData });

  // Store error for debugging (development only)
  if (process.env.NODE_ENV === "development") {
    const errors = JSON.parse(localStorage.getItem("tuel-errors") || "[]");
    errors.push(errorData);
    // Keep only last 10 errors
    if (errors.length > 10) {
      errors.splice(0, errors.length - 10);
    }
    localStorage.setItem("tuel-errors", JSON.stringify(errors));
  }
}

/**
 * TUEL Error Boundary Component
 *
 * Features:
 * - Graceful error fallbacks
 * - Retry mechanism with exponential backoff
 * - Error logging and tracking
 * - Customizable error components
 * - Reset on props change
 * - Development debugging tools
 */
export class TuelErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, logErrors = true } = this.props;
    const { errorId } = this.state;

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Log the error
    logError(error, errorInfo, errorId, logErrors);

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo, errorId);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetOnPropsChange = true, resetKeys = [] } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when reset keys change
    if (
      hasError &&
      resetOnPropsChange &&
      resetKeys.length > 0 &&
      prevProps.resetKeys &&
      JSON.stringify(prevProps.resetKeys) !== JSON.stringify(resetKeys)
    ) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  retry = (): void => {
    const { onRetry, maxRetries = 3 } = this.props;
    const { retryCount, errorId } = this.state;

    if (retryCount >= maxRetries) {
      console.warn(
        `[TUEL] Max retries (${maxRetries}) reached for error ${errorId}`
      );
      return;
    }

    // Call custom retry handler
    if (onRetry) {
      onRetry(errorId, retryCount + 1);
    }

    // Increment retry count
    this.setState((prevState) => ({
      retryCount: prevState.retryCount + 1,
    }));

    // Reset error boundary after a short delay
    this.resetTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, Math.min(1000 * Math.pow(2, retryCount), 5000)); // Exponential backoff, max 5s
  };

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      retryCount: 0,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, errorId, retryCount } = this.state;
    const {
      children,
      fallback,
      errorComponent: ErrorComponent = DefaultErrorFallback,
      maxRetries = 3,
      showErrorDetails = process.env.NODE_ENV === "development",
    } = this.props;

    if (hasError && error && errorInfo) {
      // Custom fallback component
      if (fallback) {
        return fallback;
      }

      // Default error component
      return (
        <ErrorComponent
          error={error}
          errorInfo={errorInfo}
          errorId={errorId}
          retryCount={retryCount}
          maxRetries={maxRetries}
          onRetry={this.retry}
          onReset={this.resetErrorBoundary}
          showErrorDetails={showErrorDetails}
        />
      );
    }

    return children;
  }
}

/**
 * Hook for error boundary functionality in functional components
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) {
  const WrappedComponent = (props: P) => (
    <TuelErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </TuelErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

/**
 * Animation-specific error boundary with animation-aware fallbacks
 */
export function AnimationErrorBoundary({
  children,
  animationType = "unknown",
  ...props
}: ErrorBoundaryProps & { animationType?: string }) {
  const animationFallback = (
    <div
      className="tuel-animation-error"
      style={{
        padding: "1rem",
        border: "1px solid #f6ad55",
        borderRadius: "0.5rem",
        backgroundColor: "#fef5e7",
        color: "#744210",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>🎬 Animation Unavailable</strong>
      </div>
      <div style={{ fontSize: "0.875rem" }}>
        The {animationType} animation failed to load. Content is still
        accessible.
      </div>
    </div>
  );

  return (
    <TuelErrorBoundary
      {...props}
      fallback={animationFallback}
      onError={(error, errorInfo, errorId) => {
        console.warn(`[TUEL] Animation error in ${animationType}:`, error);
        props.onError?.(error, errorInfo, errorId);
      }}
    >
      {children}
    </TuelErrorBoundary>
  );
}
