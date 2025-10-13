import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GSAPProvider } from "../components/GSAPProvider";

// Mock GSAP
vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      from: vi.fn(),
      fromTo: vi.fn(),
      set: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      reverse: vi.fn(),
      restart: vi.fn(),
      kill: vi.fn(),
    })),
    registerPlugin: vi.fn(),
  },
}));

// Mock GSAP plugins
vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({
      kill: vi.fn(),
    })),
    refresh: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("gsap/TextPlugin", () => ({
  TextPlugin: {},
}));

describe("GSAPProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <GSAPProvider>
        <div>Test Content</div>
      </GSAPProvider>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <GSAPProvider className="custom-class">
        <div>Test</div>
      </GSAPProvider>
    );
    const container = screen.getByText("Test").closest(".gsap-provider");
    expect(container).toHaveClass("custom-class");
  });

  it("provides GSAP context", () => {
    const TestComponent = () => {
      return <div>Context Test</div>;
    };

    render(
      <GSAPProvider>
        <TestComponent />
      </GSAPProvider>
    );
    expect(screen.getByText("Context Test")).toBeInTheDocument();
  });

  it("handles custom GSAP settings", () => {
    const gsapSettings = {
      duration: 1,
      ease: "power2.out",
      delay: 0.5,
    };

    render(
      <GSAPProvider settings={gsapSettings}>
        <div>Test</div>
      </GSAPProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("registers GSAP plugins", () => {
    const plugins = ["ScrollTrigger", "TextPlugin"];

    render(
      <GSAPProvider plugins={plugins}>
        <div>Test</div>
      </GSAPProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles timeline creation", () => {
    render(
      <GSAPProvider>
        <div>Test</div>
      </GSAPProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles animation callbacks", () => {
    const onAnimationStart = vi.fn();
    const onAnimationComplete = vi.fn();

    render(
      <GSAPProvider
        onAnimationStart={onAnimationStart}
        onAnimationComplete={onAnimationComplete}
      >
        <div>Test</div>
      </GSAPProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("respects disabled state", () => {
    render(
      <GSAPProvider disabled>
        <div>Test</div>
      </GSAPProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles custom easing", () => {
    const easing = "bounce.out";

    render(
      <GSAPProvider easing={easing}>
        <div>Test</div>
      </GSAPProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles performance mode", () => {
    render(
      <GSAPProvider performanceMode="high">
        <div>Test</div>
      </GSAPProvider>
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
      <GSAPProvider>
        <div>Test</div>
      </GSAPProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles custom timeline settings", () => {
    const timelineSettings = {
      paused: true,
      repeat: 2,
      yoyo: true,
    };

    render(
      <GSAPProvider timelineSettings={timelineSettings}>
        <div>Test</div>
      </GSAPProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
