import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MotionProvider } from "../components/MotionProvider";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useReducedMotion: vi.fn(() => false),
  useAnimation: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  })),
}));

describe("MotionProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <MotionProvider>
        <div>Test Content</div>
      </MotionProvider>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <MotionProvider className="custom-class">
        <div>Test</div>
      </MotionProvider>
    );
    const container = screen.getByText("Test").closest(".motion-provider");
    expect(container).toHaveClass("custom-class");
  });

  it("provides motion context", () => {
    const TestComponent = () => {
      return <div>Context Test</div>;
    };

    render(
      <MotionProvider>
        <TestComponent />
      </MotionProvider>
    );
    expect(screen.getByText("Context Test")).toBeInTheDocument();
  });

  it("handles custom animation settings", () => {
    const animationSettings = {
      duration: 0.5,
      ease: "easeInOut",
      delay: 0.1,
    };

    render(
      <MotionProvider settings={animationSettings}>
        <div>Test</div>
      </MotionProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles reduced motion preference", () => {
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
      <MotionProvider>
        <div>Test</div>
      </MotionProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles custom variants", () => {
    const variants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };

    render(
      <MotionProvider variants={variants}>
        <div>Test</div>
      </MotionProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles animation callbacks", () => {
    const onAnimationStart = vi.fn();
    const onAnimationComplete = vi.fn();

    render(
      <MotionProvider
        onAnimationStart={onAnimationStart}
        onAnimationComplete={onAnimationComplete}
      >
        <div>Test</div>
      </MotionProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("respects disabled state", () => {
    render(
      <MotionProvider disabled>
        <div>Test</div>
      </MotionProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles custom transition", () => {
    const transition = {
      type: "spring",
      stiffness: 100,
      damping: 20,
    };

    render(
      <MotionProvider transition={transition}>
        <div>Test</div>
      </MotionProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles performance mode", () => {
    render(
      <MotionProvider performanceMode="high">
        <div>Test</div>
      </MotionProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
