import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReducedMotionProvider } from "../components/ReducedMotionProvider";
import { FrameRateController } from "../components/FrameRateController";
import { PerformanceMonitor } from "../components/PerformanceMonitor";
import { LazyLoader } from "../components/LazyLoader";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useReducedMotion: vi.fn(() => false),
}));

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(() => []),
  getEntriesByType: vi.fn(() => []),
};

Object.defineProperty(window, "performance", {
  value: mockPerformance,
  writable: true,
});

// Mock Intersection Observer
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe("ReducedMotionProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <ReducedMotionProvider>
        <div>Test Content</div>
      </ReducedMotionProvider>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <ReducedMotionProvider className="custom-class">
        <div>Test</div>
      </ReducedMotionProvider>
    );
    const container = screen
      .getByText("Test")
      .closest(".reduced-motion-provider");
    expect(container).toHaveClass("custom-class");
  });

  it("detects reduced motion preference", () => {
    // Mock prefers-reduced-motion: reduce
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <ReducedMotionProvider>
        <div>Test</div>
      </ReducedMotionProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("provides reduced motion context", () => {
    const TestComponent = () => {
      return <div>Context Test</div>;
    };

    render(
      <ReducedMotionProvider>
        <TestComponent />
      </ReducedMotionProvider>
    );
    expect(screen.getByText("Context Test")).toBeInTheDocument();
  });

  it("handles custom fallback content", () => {
    const fallback = <div>Fallback Content</div>;
    render(
      <ReducedMotionProvider fallback={fallback}>
        <div>Test</div>
      </ReducedMotionProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

describe("FrameRateController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <FrameRateController>
        <div>Test Content</div>
      </FrameRateController>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <FrameRateController className="custom-class">
        <div>Test</div>
      </FrameRateController>
    );
    const container = screen
      .getByText("Test")
      .closest(".frame-rate-controller");
    expect(container).toHaveClass("custom-class");
  });

  it("sets custom target FPS", () => {
    render(
      <FrameRateController targetFPS={30}>
        <div>Test</div>
      </FrameRateController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles adaptive frame rate", () => {
    render(
      <FrameRateController adaptive>
        <div>Test</div>
      </FrameRateController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies performance mode", () => {
    render(
      <FrameRateController performanceMode="high">
        <div>Test</div>
      </FrameRateController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles frame rate callbacks", () => {
    const onFrameRateChange = vi.fn();
    render(
      <FrameRateController onFrameRateChange={onFrameRateChange}>
        <div>Test</div>
      </FrameRateController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("respects disabled state", () => {
    render(
      <FrameRateController disabled>
        <div>Test</div>
      </FrameRateController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

describe("PerformanceMonitor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <PerformanceMonitor>
        <div>Test Content</div>
      </PerformanceMonitor>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <PerformanceMonitor className="custom-class">
        <div>Test</div>
      </PerformanceMonitor>
    );
    const container = screen.getByText("Test").closest(".performance-monitor");
    expect(container).toHaveClass("custom-class");
  });

  it("monitors performance metrics", () => {
    render(
      <PerformanceMonitor>
        <div>Test</div>
      </PerformanceMonitor>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles custom thresholds", () => {
    const thresholds = {
      fps: 30,
      memory: 100,
      renderTime: 16,
    };

    render(
      <PerformanceMonitor thresholds={thresholds}>
        <div>Test</div>
      </PerformanceMonitor>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("calls performance callbacks", () => {
    const onPerformanceUpdate = vi.fn();
    render(
      <PerformanceMonitor onPerformanceUpdate={onPerformanceUpdate}>
        <div>Test</div>
      </PerformanceMonitor>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles performance warnings", () => {
    const onPerformanceWarning = vi.fn();
    render(
      <PerformanceMonitor onPerformanceWarning={onPerformanceWarning}>
        <div>Test</div>
      </PerformanceMonitor>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("shows performance overlay when enabled", () => {
    render(
      <PerformanceMonitor showOverlay>
        <div>Test</div>
      </PerformanceMonitor>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("respects disabled state", () => {
    render(
      <PerformanceMonitor disabled>
        <div>Test</div>
      </PerformanceMonitor>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

describe("LazyLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <LazyLoader>
        <div>Test Content</div>
      </LazyLoader>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <LazyLoader className="custom-class">
        <div>Test</div>
      </LazyLoader>
    );
    const container = screen.getByText("Test").closest(".lazy-loader");
    expect(container).toHaveClass("custom-class");
  });

  it("shows loading state initially", () => {
    render(
      <LazyLoader loading={<div>Loading...</div>}>
        <div>Test</div>
      </LazyLoader>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles custom loading component", () => {
    const CustomLoader = () => <div>Custom Loading</div>;
    render(
      <LazyLoader loading={<CustomLoader />}>
        <div>Test</div>
      </LazyLoader>
    );
    expect(screen.getByText("Custom Loading")).toBeInTheDocument();
  });

  it("handles error state", () => {
    render(
      <LazyLoader error={<div>Error occurred</div>} hasError>
        <div>Test</div>
      </LazyLoader>
    );
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("handles custom error component", () => {
    const CustomError = () => <div>Custom Error</div>;
    render(
      <LazyLoader error={<CustomError />} hasError>
        <div>Test</div>
      </LazyLoader>
    );
    expect(screen.getByText("Custom Error")).toBeInTheDocument();
  });

  it("handles retry functionality", () => {
    const onRetry = vi.fn();
    render(
      <LazyLoader error={<div>Error</div>} hasError onRetry={onRetry}>
        <div>Test</div>
      </LazyLoader>
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("respects disabled state", () => {
    render(
      <LazyLoader disabled>
        <div>Test</div>
      </LazyLoader>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles custom delay", () => {
    render(
      <LazyLoader delay={1000}>
        <div>Test</div>
      </LazyLoader>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
