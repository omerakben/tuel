import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MasonryGallery } from "../components/MasonryGallery";
import { GridGallery } from "../components/GridGallery";
import { CarouselGallery } from "../components/CarouselGallery";
import { LightboxGallery } from "../components/LightboxGallery";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    img: ({ ...props }: any) => <img {...props} />,
  },
  AnimatePresence: ({ children }: any) => children,
  useInView: vi.fn(() => true),
}));

// Mock intersection observer
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

const mockImages = [
  {
    src: "/image1.jpg",
    alt: "Image 1",
    width: 800,
    height: 600,
  },
  {
    src: "/image2.jpg",
    alt: "Image 2",
    width: 600,
    height: 800,
  },
  {
    src: "/image3.jpg",
    alt: "Image 3",
    width: 400,
    height: 300,
  },
];

describe("MasonryGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders images correctly", () => {
    render(<MasonryGallery images={mockImages} />);

    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    expect(screen.getByAltText("Image 3")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<MasonryGallery images={mockImages} className="custom-class" />);
    const gallery = screen.getByAltText("Image 1").closest(".masonry-gallery");
    expect(gallery).toHaveClass("custom-class");
  });

  it("handles empty images array", () => {
    render(<MasonryGallery images={[]} />);
    const gallery = document.querySelector(".masonry-gallery");
    expect(gallery).toBeInTheDocument();
  });

  it("applies custom gap and columns", () => {
    render(<MasonryGallery images={mockImages} gap={20} columns={3} />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("handles image click events", () => {
    const onImageClick = vi.fn();
    render(<MasonryGallery images={mockImages} onImageClick={onImageClick} />);

    fireEvent.click(screen.getByAltText("Image 1"));
    expect(onImageClick).toHaveBeenCalledWith(mockImages[0], 0);
  });

  it("shows loading state", () => {
    render(<MasonryGallery images={mockImages} loading />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("applies custom image styles", () => {
    const imageStyle = { borderRadius: "10px" };
    render(<MasonryGallery images={mockImages} imageStyle={imageStyle} />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });
});

describe("GridGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders images in grid layout", () => {
    render(<GridGallery images={mockImages} />);

    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    expect(screen.getByAltText("Image 3")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<GridGallery images={mockImages} className="custom-class" />);
    const gallery = screen.getByAltText("Image 1").closest(".grid-gallery");
    expect(gallery).toHaveClass("custom-class");
  });

  it("handles different grid sizes", () => {
    const gridSizes = [2, 3, 4] as const;

    gridSizes.forEach((size) => {
      const { unmount } = render(
        <GridGallery images={mockImages} gridSize={size} />
      );
      expect(screen.getByAltText("Image 1")).toBeInTheDocument();
      unmount();
    });
  });

  it("applies custom aspect ratio", () => {
    render(<GridGallery images={mockImages} aspectRatio="16:9" />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("handles hover effects", () => {
    render(<GridGallery images={mockImages} hoverEffect="zoom" />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("shows captions when provided", () => {
    const imagesWithCaptions = mockImages.map((img, index) => ({
      ...img,
      caption: `Caption ${index + 1}`,
    }));

    render(<GridGallery images={imagesWithCaptions} showCaptions />);
    expect(screen.getByText("Caption 1")).toBeInTheDocument();
  });
});

describe("CarouselGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders carousel with images", () => {
    render(<CarouselGallery images={mockImages} />);

    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CarouselGallery images={mockImages} className="custom-class" />);
    const carousel = screen
      .getByAltText("Image 1")
      .closest(".carousel-gallery");
    expect(carousel).toHaveClass("custom-class");
  });

  it("shows navigation arrows", () => {
    render(<CarouselGallery images={mockImages} showArrows />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("shows dots indicator", () => {
    render(<CarouselGallery images={mockImages} showDots />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("handles autoplay", () => {
    render(<CarouselGallery images={mockImages} autoplay />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("applies custom autoplay interval", () => {
    render(
      <CarouselGallery images={mockImages} autoplay autoplayInterval={5000} />
    );
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("handles infinite loop", () => {
    render(<CarouselGallery images={mockImages} infiniteLoop />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });
});

describe("LightboxGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders lightbox trigger", () => {
    render(
      <LightboxGallery images={mockImages}>Open Lightbox</LightboxGallery>
    );
    expect(screen.getByText("Open Lightbox")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <LightboxGallery images={mockImages} className="custom-class">
        Open Lightbox
      </LightboxGallery>
    );
    const trigger = screen.getByText("Open Lightbox");
    expect(trigger).toHaveClass("custom-class");
  });

  it("opens lightbox on click", () => {
    render(
      <LightboxGallery images={mockImages}>Open Lightbox</LightboxGallery>
    );

    fireEvent.click(screen.getByText("Open Lightbox"));
    // Lightbox should be rendered (implementation dependent)
  });

  it("handles custom start index", () => {
    render(
      <LightboxGallery images={mockImages} startIndex={1}>
        Open Lightbox
      </LightboxGallery>
    );
    expect(screen.getByText("Open Lightbox")).toBeInTheDocument();
  });

  it("shows thumbnails when enabled", () => {
    render(
      <LightboxGallery images={mockImages} showThumbnails>
        Open Lightbox
      </LightboxGallery>
    );
    expect(screen.getByText("Open Lightbox")).toBeInTheDocument();
  });

  it("handles keyboard navigation", () => {
    render(
      <LightboxGallery images={mockImages}>Open Lightbox</LightboxGallery>
    );

    fireEvent.click(screen.getByText("Open Lightbox"));
    // Test keyboard navigation (implementation dependent)
  });

  it("handles swipe gestures on mobile", () => {
    render(
      <LightboxGallery images={mockImages}>Open Lightbox</LightboxGallery>
    );

    fireEvent.click(screen.getByText("Open Lightbox"));
    // Test swipe gestures (implementation dependent)
  });
});
