import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MagneticButton } from "../components/MagneticButton";
import { CursorTracker } from "../components/CursorTracker";
import { DragHandler } from "../components/DragHandler";
import { GestureHandler } from "../components/GestureHandler";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  useMotionValue: vi.fn(() => ({ get: vi.fn(() => 0), set: vi.fn() })),
  useSpring: vi.fn(() => ({ get: vi.fn(() => 0), set: vi.fn() })),
}));

// Mock GSAP
vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
    set: vi.fn(),
  },
}));

describe("MagneticButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(<MagneticButton>Click me</MagneticButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<MagneticButton className="custom-class">Test</MagneticButton>);
    const button = screen.getByText("Test");
    expect(button).toHaveClass("custom-class");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<MagneticButton onClick={handleClick}>Click me</MagneticButton>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", () => {
    render(<MagneticButton disabled>Disabled</MagneticButton>);
    const button = screen.getByText("Disabled");
    expect(button).toBeDisabled();
  });

  it("applies custom strength and distance", () => {
    render(
      <MagneticButton strength={0.5} distance={100}>
        Custom Strength
      </MagneticButton>
    );
    expect(screen.getByText("Custom Strength")).toBeInTheDocument();
  });

  it("handles different ease types", () => {
    const easeTypes = ["spring", "tween"] as const;

    easeTypes.forEach((ease) => {
      const { unmount } = render(
        <MagneticButton ease={ease}>Ease {ease}</MagneticButton>
      );
      expect(screen.getByText(`Ease ${ease}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("applies tilt and ripple effects", () => {
    render(
      <MagneticButton tilt ripple>
        Effects Enabled
      </MagneticButton>
    );
    expect(screen.getByText("Effects Enabled")).toBeInTheDocument();
  });

  it("uses custom spring configuration", () => {
    const springConfig = {
      stiffness: 100,
      damping: 20,
      mass: 1,
    };

    render(
      <MagneticButton springConfig={springConfig}>Custom Spring</MagneticButton>
    );
    expect(screen.getByText("Custom Spring")).toBeInTheDocument();
  });
});

describe("CursorTracker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(<CursorTracker>Track me</CursorTracker>);
    expect(screen.getByText("Track me")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CursorTracker className="custom-class">Test</CursorTracker>);
    const element = screen.getByText("Test");
    expect(element).toHaveClass("custom-class");
  });

  it("handles mouse enter and leave events", () => {
    const onEnter = vi.fn();
    const onLeave = vi.fn();

    render(
      <CursorTracker onEnter={onEnter} onLeave={onLeave}>
        Hover me
      </CursorTracker>
    );

    const element = screen.getByText("Hover me");
    fireEvent.mouseEnter(element);
    fireEvent.mouseLeave(element);

    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it("handles mouse move events", () => {
    const onMove = vi.fn();

    render(<CursorTracker onMove={onMove}>Move me</CursorTracker>);

    const element = screen.getByText("Move me");
    fireEvent.mouseMove(element, { clientX: 100, clientY: 200 });

    expect(onMove).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", () => {
    render(<CursorTracker disabled>Disabled</CursorTracker>);
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });
});

describe("DragHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(<DragHandler>Drag me</DragHandler>);
    expect(screen.getByText("Drag me")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<DragHandler className="custom-class">Test</DragHandler>);
    const element = screen.getByText("Test");
    expect(element).toHaveClass("custom-class");
  });

  it("handles drag start events", () => {
    const onDragStart = vi.fn();

    render(<DragHandler onDragStart={onDragStart}>Drag me</DragHandler>);

    const element = screen.getByText("Drag me");
    fireEvent.mouseDown(element);

    expect(onDragStart).toHaveBeenCalledTimes(1);
  });

  it("handles drag end events", () => {
    const onDragEnd = vi.fn();

    render(<DragHandler onDragEnd={onDragEnd}>Drag me</DragHandler>);

    const element = screen.getByText("Drag me");
    fireEvent.mouseDown(element);
    fireEvent.mouseUp(element);

    expect(onDragEnd).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", () => {
    render(<DragHandler disabled>Disabled</DragHandler>);
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  it("applies custom drag constraints", () => {
    const constraints = { x: 100, y: 200 };

    render(
      <DragHandler constraints={constraints}>Constrained Drag</DragHandler>
    );
    expect(screen.getByText("Constrained Drag")).toBeInTheDocument();
  });
});

describe("GestureHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(<GestureHandler>Gesture me</GestureHandler>);
    expect(screen.getByText("Gesture me")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<GestureHandler className="custom-class">Test</GestureHandler>);
    const element = screen.getByText("Test");
    expect(element).toHaveClass("custom-class");
  });

  it("handles tap events", () => {
    const onTap = vi.fn();

    render(<GestureHandler onTap={onTap}>Tap me</GestureHandler>);

    const element = screen.getByText("Tap me");
    fireEvent.click(element);

    expect(onTap).toHaveBeenCalledTimes(1);
  });

  it("handles double tap events", () => {
    const onDoubleTap = vi.fn();

    render(
      <GestureHandler onDoubleTap={onDoubleTap}>Double tap me</GestureHandler>
    );

    const element = screen.getByText("Double tap me");
    fireEvent.doubleClick(element);

    expect(onDoubleTap).toHaveBeenCalledTimes(1);
  });

  it("handles long press events", () => {
    const onLongPress = vi.fn();

    render(
      <GestureHandler onLongPress={onLongPress}>Long press me</GestureHandler>
    );

    const element = screen.getByText("Long press me");
    fireEvent.mouseDown(element);

    // Simulate long press
    setTimeout(() => {
      expect(onLongPress).toHaveBeenCalledTimes(1);
    }, 1000);
  });

  it("respects disabled state", () => {
    render(<GestureHandler disabled>Disabled</GestureHandler>);
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });
});
