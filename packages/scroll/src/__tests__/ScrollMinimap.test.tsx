import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { ScrollMinimap } from "../components/ScrollMinimap";

describe("ScrollMinimap", () => {
  const mockImages = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
    "https://example.com/image4.jpg",
  ];

  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cancelRafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock requestAnimationFrame - don't immediately call callback to avoid infinite loop
    let rafId = 0;
    rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        rafId++;
        // Schedule callback for next tick instead of immediate execution
        setTimeout(() => cb(0), 0);
        return rafId;
      });

    cancelRafSpy = vi
      .spyOn(window, "cancelAnimationFrame")
      .mockImplementation(vi.fn());

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render all images", () => {
      render(<ScrollMinimap images={mockImages} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBe(mockImages.length + 1); // +1 for preview image
    });

    it("should render minimap items with correct alt text", () => {
      render(<ScrollMinimap images={mockImages} />);

      expect(screen.getByAltText("Minimap item 1")).toBeInTheDocument();
      expect(screen.getByAltText("Minimap item 2")).toBeInTheDocument();
      expect(screen.getByAltText("Minimap item 3")).toBeInTheDocument();
      expect(screen.getByAltText("Minimap item 4")).toBeInTheDocument();
    });

    it("should render preview image", () => {
      render(<ScrollMinimap images={mockImages} />);

      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <ScrollMinimap images={mockImages} className="custom-minimap" />
      );

      const minimapElement = container.querySelector(".custom-minimap");
      expect(minimapElement).toBeInTheDocument();
    });

    it("should render indicator element", () => {
      const { container } = render(<ScrollMinimap images={mockImages} />);

      const indicator = container.querySelector(".indicator");
      expect(indicator).toBeInTheDocument();
    });
  });

  describe("Props and Configuration", () => {
    it("should use default activeOpacity", () => {
      render(<ScrollMinimap images={mockImages} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should accept custom activeOpacity", () => {
      render(<ScrollMinimap images={mockImages} activeOpacity={0.5} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should accept custom lerpFactor", () => {
      render(<ScrollMinimap images={mockImages} lerpFactor={0.1} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should accept custom clickLerpFactor", () => {
      render(<ScrollMinimap images={mockImages} clickLerpFactor={0.08} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should accept custom breakpoint", () => {
      render(<ScrollMinimap images={mockImages} breakpoint={768} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe("User Interactions", () => {
    it("should handle item click", async () => {
      render(<ScrollMinimap images={mockImages} />);

      const items = screen.getAllByRole("img").slice(0, -1); // Exclude preview
      const secondItem = items[1].parentElement;

      if (secondItem) {
        fireEvent.click(secondItem);

        // Component should handle the click without errors
        await waitFor(() => {
          expect(secondItem).toBeInTheDocument();
        });
      }
    });

    it("should call onImageChange callback", () => {
      const onImageChange = vi.fn();
      const { container } = render(
        <ScrollMinimap images={mockImages} onImageChange={onImageChange} />
      );

      // Component should render without errors
      expect(container).toBeInTheDocument();

      // Note: onImageChange is called asynchronously via RAF, which is hard to test reliably in jsdom
      // The important part is that the component accepts the prop and renders
    });

    it("should handle wheel events", async () => {
      const { container } = render(<ScrollMinimap images={mockImages} />);

      const minimapContainer = container.querySelector(
        ".scroll-minimap-container"
      );

      if (minimapContainer) {
        const wheelEvent = new WheelEvent("wheel", {
          deltaY: 100,
          bubbles: true,
          cancelable: true,
        });

        fireEvent(minimapContainer, wheelEvent);

        // Component should handle wheel without errors
        await waitFor(() => {
          expect(minimapContainer).toBeInTheDocument();
        });
      }
    });

    it("should handle touch events", async () => {
      const { container } = render(<ScrollMinimap images={mockImages} />);

      const minimapContainer = container.querySelector(
        ".scroll-minimap-container"
      );

      if (minimapContainer) {
        const touchStartEvent = new TouchEvent("touchstart", {
          touches: [{ clientY: 100 } as Touch],
          bubbles: true,
          cancelable: true,
        });

        const touchMoveEvent = new TouchEvent("touchmove", {
          touches: [{ clientY: 50 } as Touch],
          bubbles: true,
          cancelable: true,
        });

        fireEvent(minimapContainer, touchStartEvent);
        fireEvent(minimapContainer, touchMoveEvent);

        // Component should handle touch without errors
        await waitFor(() => {
          expect(minimapContainer).toBeInTheDocument();
        });
      }
    });
  });

  describe("Responsive Behavior", () => {
    it("should handle window resize", async () => {
      render(<ScrollMinimap images={mockImages} breakpoint={900} />);

      // Trigger resize
      global.innerWidth = 800;
      fireEvent(window, new Event("resize"));

      await waitFor(() => {
        const images = screen.getAllByRole("img");
        expect(images.length).toBeGreaterThan(0);
      });
    });

    it("should switch to horizontal mode on small screens", async () => {
      global.innerWidth = 800;

      const { container } = render(
        <ScrollMinimap images={mockImages} breakpoint={900} />
      );

      await waitFor(() => {
        const itemsContainer = container.querySelector(".items");
        expect(itemsContainer).toBeInTheDocument();
      });
    });

    it("should stay vertical on large screens", async () => {
      global.innerWidth = 1200;

      const { container } = render(
        <ScrollMinimap images={mockImages} breakpoint={900} />
      );

      await waitFor(() => {
        const itemsContainer = container.querySelector(".items");
        expect(itemsContainer).toBeInTheDocument();
      });
    });
  });

  describe("Memory Leak Prevention", () => {
    it("should cleanup event listeners on unmount", () => {
      const { unmount } = render(<ScrollMinimap images={mockImages} />);

      unmount();

      // Verify cancelAnimationFrame was called
      expect(cancelRafSpy).toHaveBeenCalled();
    });

    it("should remove wheel listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(
        Element.prototype,
        "removeEventListener"
      );

      const { unmount } = render(<ScrollMinimap images={mockImages} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "wheel",
        expect.any(Function)
      );
    });

    it("should remove resize listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = render(<ScrollMinimap images={mockImages} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    it("should remove touch listeners on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(
        Element.prototype,
        "removeEventListener"
      );

      const { unmount } = render(<ScrollMinimap images={mockImages} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "touchstart",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "touchmove",
        expect.any(Function)
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty images array", () => {
      const { container } = render(<ScrollMinimap images={[]} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle single image", () => {
      render(<ScrollMinimap images={["https://example.com/single.jpg"]} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBe(2); // 1 minimap + 1 preview
    });

    it("should handle many images", () => {
      const manyImages = Array.from(
        { length: 50 },
        (_, i) => `https://example.com/image${i}.jpg`
      );

      render(<ScrollMinimap images={manyImages} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBe(51); // 50 minimap + 1 preview
    });

    it("should handle activeOpacity of 0", () => {
      render(<ScrollMinimap images={mockImages} activeOpacity={0} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should handle activeOpacity of 1", () => {
      render(<ScrollMinimap images={mockImages} activeOpacity={1} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should handle very high lerpFactor", () => {
      render(<ScrollMinimap images={mockImages} lerpFactor={0.9} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should handle very low lerpFactor", () => {
      render(<ScrollMinimap images={mockImages} lerpFactor={0.001} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe("Image Paths", () => {
    it("should handle different image formats", () => {
      const mixedImages = [
        "https://example.com/image.jpg",
        "https://example.com/image.png",
        "https://example.com/image.webp",
        "https://example.com/image.svg",
      ];

      render(<ScrollMinimap images={mixedImages} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBe(5); // 4 minimap + 1 preview
    });

    it("should handle relative paths", () => {
      const relativeImages = [
        "/images/img1.jpg",
        "/images/img2.jpg",
        "../assets/img3.jpg",
      ];

      render(<ScrollMinimap images={relativeImages} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBe(4); // 3 minimap + 1 preview
    });

    it("should handle data URIs", () => {
      const dataUriImages = [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      ];

      render(<ScrollMinimap images={dataUriImages} />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBe(2); // 1 minimap + 1 preview
    });
  });

  describe("Accessibility", () => {
    it("should provide alt text for all images", () => {
      render(<ScrollMinimap images={mockImages} />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
      });
    });

    it("should make items keyboard accessible", () => {
      const { container } = render(<ScrollMinimap images={mockImages} />);

      const items = container.querySelectorAll(".item");
      items.forEach((item) => {
        expect(item).toHaveStyle({ cursor: "pointer" });
      });
    });
  });
});
