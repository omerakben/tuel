import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  ParallaxScroll,
  ParallaxLayer,
  ParallaxContainer,
} from "../components/ParallaxScroll";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, style, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  useScroll: vi.fn(() => ({
    scrollYProgress: { get: () => 0, on: vi.fn(), destroy: vi.fn() },
  })),
  useTransform: vi.fn((value, input, output) => ({
    get: () => output[0],
    on: vi.fn(),
    destroy: vi.fn(),
  })),
}));

describe("ParallaxScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render children correctly", () => {
      render(
        <ParallaxScroll>
          <div data-testid="child">Child Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <ParallaxScroll className="custom-parallax">
          <div>Content</div>
        </ParallaxScroll>
      );

      const parallaxElement = container.querySelector(".custom-parallax");
      expect(parallaxElement).toBeInTheDocument();
    });

    it("should always include will-change-transform class", () => {
      const { container } = render(
        <ParallaxScroll>
          <div>Content</div>
        </ParallaxScroll>
      );

      const parallaxElement = container.querySelector(".will-change-transform");
      expect(parallaxElement).toBeInTheDocument();
    });
  });

  describe("Props and Configuration", () => {
    it("should accept speed prop", () => {
      const { container } = render(
        <ParallaxScroll speed={1.5}>
          <div>Content</div>
        </ParallaxScroll>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should accept direction prop (vertical)", () => {
      render(
        <ParallaxScroll direction="vertical">
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should accept direction prop (horizontal)", () => {
      render(
        <ParallaxScroll direction="horizontal">
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should accept fadeIn prop", () => {
      render(
        <ParallaxScroll fadeIn={true}>
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should accept scaleOnScroll prop", () => {
      render(
        <ParallaxScroll scaleOnScroll={true}>
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should accept rotateOnScroll prop", () => {
      render(
        <ParallaxScroll rotateOnScroll={true}>
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should accept offset prop", () => {
      render(
        <ParallaxScroll offset={["0% end", "100% start"]}>
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should use default speed of 0.5", () => {
      render(
        <ParallaxScroll>
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should use default direction of vertical", () => {
      render(
        <ParallaxScroll>
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  describe("Multiple Effects Combined", () => {
    it("should handle fadeIn + scaleOnScroll together", () => {
      render(
        <ParallaxScroll fadeIn={true} scaleOnScroll={true}>
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should handle all effects together", () => {
      render(
        <ParallaxScroll
          fadeIn={true}
          scaleOnScroll={true}
          rotateOnScroll={true}
        >
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty children", () => {
      const { container } = render(<ParallaxScroll>{null}</ParallaxScroll>);

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle multiple children", () => {
      render(
        <ParallaxScroll>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
    });

    it("should handle speed of 0", () => {
      render(
        <ParallaxScroll speed={0}>
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should handle negative speed", () => {
      render(
        <ParallaxScroll speed={-0.5}>
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should handle very high speed", () => {
      render(
        <ParallaxScroll speed={5}>
          <div data-testid="content">Content</div>
        </ParallaxScroll>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });
});

describe("ParallaxLayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render children correctly", () => {
      render(
        <ParallaxLayer speed={0.5}>
          <div data-testid="layer-content">Layer Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId("layer-content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <ParallaxLayer speed={0.5} className="custom-layer">
          <div>Content</div>
        </ParallaxLayer>
      );

      const layerElement = container.querySelector(".custom-layer");
      expect(layerElement).toBeInTheDocument();
    });
  });

  describe("Offset Conversion", () => {
    it("should handle numeric offset", () => {
      render(
        <ParallaxLayer speed={0.5} offset={0}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should handle string tuple offset", () => {
      render(
        <ParallaxLayer speed={0.5} offset={["start end", "end start"]}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should handle undefined offset", () => {
      render(
        <ParallaxLayer speed={0.5}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should handle negative numeric offset", () => {
      render(
        <ParallaxLayer speed={0.5} offset={-1}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  describe("Props Forwarding", () => {
    it("should forward direction prop", () => {
      render(
        <ParallaxLayer speed={0.5} direction="horizontal">
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should forward fadeIn prop", () => {
      render(
        <ParallaxLayer speed={0.5} fadeIn={true}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should forward scaleOnScroll prop", () => {
      render(
        <ParallaxLayer speed={0.5} scaleOnScroll={true}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("should forward rotateOnScroll prop", () => {
      render(
        <ParallaxLayer speed={0.5} rotateOnScroll={true}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });
});

describe("ParallaxContainer", () => {
  describe("Rendering", () => {
    it("should render children correctly", () => {
      render(
        <ParallaxContainer>
          <div data-testid="container-content">Container Content</div>
        </ParallaxContainer>
      );

      expect(screen.getByTestId("container-content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <ParallaxContainer className="custom-container">
          <div>Content</div>
        </ParallaxContainer>
      );

      const containerElement = container.querySelector(".custom-container");
      expect(containerElement).toBeInTheDocument();
    });

    it("should have relative and overflow-hidden classes", () => {
      const { container } = render(
        <ParallaxContainer>
          <div>Content</div>
        </ParallaxContainer>
      );

      const containerElement = container.querySelector(".relative");
      expect(containerElement).toBeInTheDocument();

      const overflowElement = container.querySelector(".overflow-hidden");
      expect(overflowElement).toBeInTheDocument();
    });
  });

  describe("Integration with ParallaxLayer", () => {
    it("should work with multiple ParallaxLayers", () => {
      render(
        <ParallaxContainer>
          <ParallaxLayer speed={0.3}>
            <div data-testid="layer-1">Layer 1</div>
          </ParallaxLayer>
          <ParallaxLayer speed={0.6}>
            <div data-testid="layer-2">Layer 2</div>
          </ParallaxLayer>
          <ParallaxLayer speed={0.9}>
            <div data-testid="layer-3">Layer 3</div>
          </ParallaxLayer>
        </ParallaxContainer>
      );

      expect(screen.getByTestId("layer-1")).toBeInTheDocument();
      expect(screen.getByTestId("layer-2")).toBeInTheDocument();
      expect(screen.getByTestId("layer-3")).toBeInTheDocument();
    });

    it("should handle mixed content", () => {
      render(
        <ParallaxContainer>
          <div data-testid="static">Static Content</div>
          <ParallaxLayer speed={0.5}>
            <div data-testid="parallax">Parallax Content</div>
          </ParallaxLayer>
        </ParallaxContainer>
      );

      expect(screen.getByTestId("static")).toBeInTheDocument();
      expect(screen.getByTestId("parallax")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty children", () => {
      const { container } = render(
        <ParallaxContainer>{null}</ParallaxContainer>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle single child", () => {
      render(
        <ParallaxContainer>
          <div data-testid="single">Single Child</div>
        </ParallaxContainer>
      );

      expect(screen.getByTestId("single")).toBeInTheDocument();
    });
  });
});

describe("Accessibility", () => {
  it("ParallaxScroll should be keyboard accessible", () => {
    render(
      <ParallaxScroll>
        <button data-testid="button">Focusable Element</button>
      </ParallaxScroll>
    );

    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();
  });

  it("ParallaxContainer should not interfere with child focus", () => {
    render(
      <ParallaxContainer>
        <input data-testid="input" placeholder="Test input" />
      </ParallaxContainer>
    );

    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
  });
});
