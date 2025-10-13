import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import {
  TuelErrorBoundary,
  DefaultErrorFallback,
  AnimationErrorBoundary,
  useErrorBoundary,
  withErrorBoundary,
} from "../errorBoundary";

// Mock console methods
const consoleSpy = {
  warn: vi.fn(),
  error: vi.fn(),
  group: vi.fn(),
  groupEnd: vi.fn(),
};

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(consoleSpy.warn);
  vi.spyOn(console, "error").mockImplementation(consoleSpy.error);
  vi.spyOn(console, "group").mockImplementation(consoleSpy.group);
  vi.spyOn(console, "groupEnd").mockImplementation(consoleSpy.groupEnd);
});

afterEach(() => {
  vi.clearAllMocks();
});

// Test component that throws errors
const ThrowingComponent = ({
  shouldThrow = true,
}: {
  shouldThrow?: boolean;
}) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("TuelErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <TuelErrorBoundary>
        <div>Test content</div>
      </TuelErrorBoundary>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders error fallback when child throws", () => {
    render(
      <TuelErrorBoundary>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    expect(screen.getByText("🚨 Animation Error")).toBeInTheDocument();
    expect(
      screen.getByText("Something went wrong with this animation component.")
    ).toBeInTheDocument();
  });

  it("calls onError callback when error occurs", () => {
    const onError = vi.fn();

    render(
      <TuelErrorBoundary onError={onError}>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object),
      expect.stringMatching(/^tuel-error-/)
    );
  });

  it("allows retry functionality", async () => {
    render(
      <TuelErrorBoundary maxRetries={3}>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    const retryButton = screen.getByText("Retry (1/3)");
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);

    // Should show retry count increased
    await waitFor(() => {
      expect(screen.getByText("Retry (2/3)")).toBeInTheDocument();
    });
  });

  it("respects max retries limit", async () => {
    render(
      <TuelErrorBoundary maxRetries={1}>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    const retryButton = screen.getByText("Retry (1/1)");
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.queryByText("Retry (2/1)")).not.toBeInTheDocument();
    });
  });

  it("allows reset functionality", () => {
    render(
      <TuelErrorBoundary>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);

    // Should render children again after reset
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("uses custom error component", () => {
    const CustomErrorComponent = ({ error }: { error: Error }) => (
      <div>Custom error: {error.message}</div>
    );

    render(
      <TuelErrorBoundary errorComponent={CustomErrorComponent}>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    expect(screen.getByText("Custom error: Test error")).toBeInTheDocument();
  });

  it("uses custom fallback", () => {
    render(
      <TuelErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    expect(screen.getByText("Custom fallback")).toBeInTheDocument();
  });

  it("resets on resetKeys change", () => {
    const { rerender } = render(
      <TuelErrorBoundary resetKeys={["key1"]}>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    expect(screen.getByText("🚨 Animation Error")).toBeInTheDocument();

    rerender(
      <TuelErrorBoundary resetKeys={["key2"]}>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    // Should reset and try to render children again
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("suppresses error logging when disabled", () => {
    render(
      <TuelErrorBoundary logErrors={false}>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    expect(consoleSpy.group).not.toHaveBeenCalled();
    expect(consoleSpy.error).not.toHaveBeenCalled();
  });
});

describe("DefaultErrorFallback", () => {
  const mockError = new Error("Test error");
  const mockErrorInfo = {
    componentStack: "Test component stack",
  } as React.ErrorInfo;

  it("renders error information", () => {
    render(
      <DefaultErrorFallback
        error={mockError}
        errorInfo={mockErrorInfo}
        errorId="test-error-id"
        retryCount={0}
        maxRetries={3}
        onRetry={vi.fn()}
        onReset={vi.fn()}
        showErrorDetails={true}
      />
    );

    expect(screen.getByText("🚨 Animation Error")).toBeInTheDocument();
    expect(
      screen.getByText("Something went wrong with this animation component.")
    ).toBeInTheDocument();
  });

  it("shows error details when enabled", () => {
    render(
      <DefaultErrorFallback
        error={mockError}
        errorInfo={mockErrorInfo}
        errorId="test-error-id"
        retryCount={0}
        maxRetries={3}
        onRetry={vi.fn()}
        onReset={vi.fn()}
        showErrorDetails={true}
      />
    );

    const detailsElement = screen.getByText("Error Details");
    expect(detailsElement).toBeInTheDocument();
  });

  it("hides error details when disabled", () => {
    render(
      <DefaultErrorFallback
        error={mockError}
        errorInfo={mockErrorInfo}
        errorId="test-error-id"
        retryCount={0}
        maxRetries={3}
        onRetry={vi.fn()}
        onReset={vi.fn()}
        showErrorDetails={false}
      />
    );

    expect(screen.queryByText("Error Details")).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    const onRetry = vi.fn();

    render(
      <DefaultErrorFallback
        error={mockError}
        errorInfo={mockErrorInfo}
        errorId="test-error-id"
        retryCount={0}
        maxRetries={3}
        onRetry={onRetry}
        onReset={vi.fn()}
        showErrorDetails={false}
      />
    );

    const retryButton = screen.getByText("Retry (1/3)");
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalled();
  });

  it("calls onReset when reset button is clicked", () => {
    const onReset = vi.fn();

    render(
      <DefaultErrorFallback
        error={mockError}
        errorInfo={mockErrorInfo}
        errorId="test-error-id"
        retryCount={0}
        maxRetries={3}
        onRetry={vi.fn()}
        onReset={onReset}
        showErrorDetails={false}
      />
    );

    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);

    expect(onReset).toHaveBeenCalled();
  });
});

describe("AnimationErrorBoundary", () => {
  it("renders animation-specific fallback", () => {
    render(
      <AnimationErrorBoundary animationType="fade">
        <ThrowingComponent />
      </AnimationErrorBoundary>
    );

    expect(screen.getByText("🎬 Animation Unavailable")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The fade animation failed to load. Content is still accessible."
      )
    ).toBeInTheDocument();
  });

  it("calls onError with animation context", () => {
    const onError = vi.fn();

    render(
      <AnimationErrorBoundary animationType="slide" onError={onError}>
        <ThrowingComponent />
      </AnimationErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object),
      expect.stringMatching(/^tuel-error-/)
    );
  });
});

describe("useErrorBoundary hook", () => {
  it("provides error boundary functionality", () => {
    const TestComponent = () => {
      const { captureError, resetError } = useErrorBoundary();

      return (
        <div>
          <button onClick={() => captureError(new Error("Hook error"))}>
            Trigger Error
          </button>
          <button onClick={resetError}>Reset Error</button>
        </div>
      );
    };

    render(<TestComponent />);

    const triggerButton = screen.getByText("Trigger Error");
    fireEvent.click(triggerButton);

    // Should throw error and be caught by error boundary
    expect(screen.getByText("🚨 Animation Error")).toBeInTheDocument();
  });
});

describe("withErrorBoundary HOC", () => {
  it("wraps component with error boundary", () => {
    const WrappedComponent = withErrorBoundary(ThrowingComponent);

    render(<WrappedComponent />);

    expect(screen.getByText("🚨 Animation Error")).toBeInTheDocument();
  });

  it("preserves component display name", () => {
    const TestComponent = () => <div>Test</div>;
    TestComponent.displayName = "TestComponent";

    const WrappedComponent = withErrorBoundary(TestComponent);

    expect(WrappedComponent.displayName).toBe(
      "withErrorBoundary(TestComponent)"
    );
  });
});

describe("Error ID generation", () => {
  it("generates unique error IDs", () => {
    const errorIds = new Set();

    for (let i = 0; i < 100; i++) {
      render(
        <TuelErrorBoundary>
          <ThrowingComponent />
        </TuelErrorBoundary>
      );

      // Extract error ID from console calls
      const errorCall = consoleSpy.group.mock.calls.find((call) =>
        call[0].includes("tuel-error-")
      );

      if (errorCall) {
        const errorId = errorCall[0].match(/tuel-error-[^)]+/)?.[0];
        if (errorId) {
          errorIds.add(errorId);
        }
      }
    }

    // All error IDs should be unique
    expect(errorIds.size).toBeGreaterThan(0);
  });
});

describe("Error logging", () => {
  it("logs errors to console in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(
      <TuelErrorBoundary>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    expect(consoleSpy.group).toHaveBeenCalledWith(
      expect.stringMatching(/🚨 TUEL Error Boundary/)
    );
    expect(consoleSpy.error).toHaveBeenCalledWith("Error:", expect.any(Error));

    process.env.NODE_ENV = originalEnv;
  });

  it("stores errors in localStorage in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(() => "[]"),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });

    render(
      <TuelErrorBoundary>
        <ThrowingComponent />
      </TuelErrorBoundary>
    );

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "tuel-errors",
      expect.stringContaining("Test error")
    );

    process.env.NODE_ENV = originalEnv;
  });
});
