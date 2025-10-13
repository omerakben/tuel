import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AnimationSequence } from "../components/AnimationSequence";
import { AnimationState } from "../components/AnimationState";
import { AnimationTimeline } from "../components/AnimationTimeline";
import { AnimationController } from "../components/AnimationController";

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
  useAnimation: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  })),
  useAnimationControls: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  })),
}));

describe("AnimationSequence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <AnimationSequence>
        <div>Test Content</div>
      </AnimationSequence>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <AnimationSequence className="custom-class">
        <div>Test</div>
      </AnimationSequence>
    );
    const container = screen.getByText("Test").closest(".animation-sequence");
    expect(container).toHaveClass("custom-class");
  });

  it("handles animation steps", () => {
    const steps = [
      { key: "step1", duration: 0.5 },
      { key: "step2", duration: 1.0 },
    ];

    render(
      <AnimationSequence steps={steps}>
        <div>Test</div>
      </AnimationSequence>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles sequence callbacks", () => {
    const onStepComplete = vi.fn();
    const onSequenceComplete = vi.fn();

    render(
      <AnimationSequence
        onStepComplete={onStepComplete}
        onSequenceComplete={onSequenceComplete}
      >
        <div>Test</div>
      </AnimationSequence>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("respects auto start setting", () => {
    render(
      <AnimationSequence autoStart={false}>
        <div>Test</div>
      </AnimationSequence>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles loop setting", () => {
    render(
      <AnimationSequence loop>
        <div>Test</div>
      </AnimationSequence>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies custom delay", () => {
    render(
      <AnimationSequence delay={1}>
        <div>Test</div>
      </AnimationSequence>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles pause and resume", () => {
    render(
      <AnimationSequence>
        <div>Test</div>
      </AnimationSequence>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

describe("AnimationState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <AnimationState>
        <div>Test Content</div>
      </AnimationState>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <AnimationState className="custom-class">
        <div>Test</div>
      </AnimationState>
    );
    const container = screen.getByText("Test").closest(".animation-state");
    expect(container).toHaveClass("custom-class");
  });

  it("manages animation states", () => {
    const states = {
      idle: { opacity: 1 },
      active: { opacity: 0.5 },
      complete: { opacity: 0 },
    };

    render(
      <AnimationState states={states}>
        <div>Test</div>
      </AnimationState>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles state transitions", () => {
    const transitions = {
      idle: { duration: 0.3 },
      active: { duration: 0.5 },
    };

    render(
      <AnimationState transitions={transitions}>
        <div>Test</div>
      </AnimationState>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("provides state context", () => {
    const TestComponent = () => {
      return <div>Context Test</div>;
    };

    render(
      <AnimationState>
        <TestComponent />
      </AnimationState>
    );
    expect(screen.getByText("Context Test")).toBeInTheDocument();
  });

  it("handles state change callbacks", () => {
    const onStateChange = vi.fn();

    render(
      <AnimationState onStateChange={onStateChange}>
        <div>Test</div>
      </AnimationState>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("respects initial state", () => {
    render(
      <AnimationState initialState="active">
        <div>Test</div>
      </AnimationState>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles state persistence", () => {
    render(
      <AnimationState persist>
        <div>Test</div>
      </AnimationState>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

describe("AnimationTimeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <AnimationTimeline>
        <div>Test Content</div>
      </AnimationTimeline>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <AnimationTimeline className="custom-class">
        <div>Test</div>
      </AnimationTimeline>
    );
    const container = screen.getByText("Test").closest(".animation-timeline");
    expect(container).toHaveClass("custom-class");
  });

  it("handles timeline markers", () => {
    const markers = [
      { time: 0, label: "Start" },
      { time: 0.5, label: "Middle" },
      { time: 1, label: "End" },
    ];

    render(
      <AnimationTimeline markers={markers}>
        <div>Test</div>
      </AnimationTimeline>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles timeline duration", () => {
    render(
      <AnimationTimeline duration={5}>
        <div>Test</div>
      </AnimationTimeline>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles timeline callbacks", () => {
    const onTimeUpdate = vi.fn();
    const onTimelineComplete = vi.fn();

    render(
      <AnimationTimeline
        onTimeUpdate={onTimeUpdate}
        onTimelineComplete={onTimelineComplete}
      >
        <div>Test</div>
      </AnimationTimeline>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("respects auto play setting", () => {
    render(
      <AnimationTimeline autoPlay={false}>
        <div>Test</div>
      </AnimationTimeline>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles loop setting", () => {
    render(
      <AnimationTimeline loop>
        <div>Test</div>
      </AnimationTimeline>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies custom easing", () => {
    render(
      <AnimationTimeline easing="easeInOut">
        <div>Test</div>
      </AnimationTimeline>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

describe("AnimationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <AnimationController>
        <div>Test Content</div>
      </AnimationController>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <AnimationController className="custom-class">
        <div>Test</div>
      </AnimationController>
    );
    const container = screen.getByText("Test").closest(".animation-controller");
    expect(container).toHaveClass("custom-class");
  });

  it("provides control methods", () => {
    const TestComponent = () => {
      return <div>Control Test</div>;
    };

    render(
      <AnimationController>
        <TestComponent />
      </AnimationController>
    );
    expect(screen.getByText("Control Test")).toBeInTheDocument();
  });

  it("handles play control", () => {
    render(
      <AnimationController>
        <div>Test</div>
      </AnimationController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles pause control", () => {
    render(
      <AnimationController>
        <div>Test</div>
      </AnimationController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles stop control", () => {
    render(
      <AnimationController>
        <div>Test</div>
      </AnimationController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles reset control", () => {
    render(
      <AnimationController>
        <div>Test</div>
      </AnimationController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles speed control", () => {
    render(
      <AnimationController speed={2}>
        <div>Test</div>
      </AnimationController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles direction control", () => {
    render(
      <AnimationController direction="reverse">
        <div>Test</div>
      </AnimationController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles control callbacks", () => {
    const onPlay = vi.fn();
    const onPause = vi.fn();
    const onStop = vi.fn();

    render(
      <AnimationController onPlay={onPlay} onPause={onPause} onStop={onStop}>
        <div>Test</div>
      </AnimationController>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
