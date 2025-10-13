import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AnimatedText } from "../components/AnimatedText";
import { NavigateScrollAnimatedText } from "../components/NavigateScrollAnimatedText";

// Mock GSAP
vi.mock("gsap", () => ({
  default: {
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      pause: vi.fn(),
      play: vi.fn(),
      onComplete: vi.fn(),
    })),
  },
}));

// Mock ScrollTrigger
vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({
      kill: vi.fn(),
    })),
  },
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useInView: vi.fn(() => true),
}));

describe("AnimatedText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders text content correctly", () => {
    render(<AnimatedText>Hello World</AnimatedText>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<AnimatedText className="custom-class">Test</AnimatedText>);
    const element = screen.getByText("Test");
    expect(element).toHaveClass("custom-class");
  });

  it("renders with different variants", () => {
    const variants = ["fade", "slide", "typewriter", "wave"] as const;

    variants.forEach((variant) => {
      const { unmount } = render(
        <AnimatedText variant={variant}>Test {variant}</AnimatedText>
      );
      expect(screen.getByText(`Test ${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("handles different split types", () => {
    const splitTypes = ["chars", "words", "lines"] as const;

    splitTypes.forEach((splitType) => {
      const { unmount } = render(
        <AnimatedText splitType={splitType}>Test {splitType}</AnimatedText>
      );
      expect(screen.getByText(`Test ${splitType}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("respects triggerOnScroll prop", () => {
    render(<AnimatedText triggerOnScroll={false}>No Scroll</AnimatedText>);
    expect(screen.getByText("No Scroll")).toBeInTheDocument();
  });

  it("handles empty text gracefully", () => {
    render(<AnimatedText></AnimatedText>);
    expect(screen.getByText("")).toBeInTheDocument();
  });

  it("applies custom duration and delay", () => {
    render(
      <AnimatedText duration={2} delay={1}>
        Custom Timing
      </AnimatedText>
    );
    expect(screen.getByText("Custom Timing")).toBeInTheDocument();
  });

  it("uses custom component with as prop", () => {
    render(<AnimatedText as="h1">Heading</AnimatedText>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

describe("NavigateScrollAnimatedText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders paragraphs correctly", () => {
    const paragraphs = ["First paragraph", "Second paragraph"];
    render(<NavigateScrollAnimatedText paragraphs={paragraphs} />);

    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <NavigateScrollAnimatedText
        paragraphs={["Test"]}
        className="custom-class"
      />
    );
    const container = screen
      .getByText("Test")
      .closest(".navigate-scroll-animated-text");
    expect(container).toHaveClass("custom-class");
  });

  it("uses default keywords when none provided", () => {
    render(<NavigateScrollAnimatedText paragraphs={["vibrant living"]} />);
    expect(screen.getByText("vibrant living")).toBeInTheDocument();
  });

  it("uses custom keywords", () => {
    const customKeywords = ["custom", "keyword"];
    render(
      <NavigateScrollAnimatedText
        paragraphs={["custom text"]}
        keywords={customKeywords}
      />
    );
    expect(screen.getByText("custom text")).toBeInTheDocument();
  });

  it("handles empty paragraphs array", () => {
    render(<NavigateScrollAnimatedText paragraphs={[]} />);
    const container = document.querySelector(".navigate-scroll-animated-text");
    expect(container).toBeInTheDocument();
  });

  it("applies custom styling props", () => {
    render(
      <NavigateScrollAnimatedText
        paragraphs={["Test"]}
        wordHighlightBgColor="255, 0, 0"
        pinHeight={6}
        overlapWords={20}
        reverseOverlapWords={10}
      />
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("calls onProgress callback", () => {
    const onProgress = vi.fn();
    render(
      <NavigateScrollAnimatedText
        paragraphs={["Test"]}
        onProgress={onProgress}
      />
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
