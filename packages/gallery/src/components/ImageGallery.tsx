import { cn, isClient } from "@tuel/utils";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { CSSProperties, useEffect, useRef, useState } from "react";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  layout?: "grid" | "masonry" | "carousel" | "stack" | "justified";
  columns?: number;
  gap?: number;
  animationType?: "fade" | "slide" | "scale" | "flip" | "reveal";
  hoverEffect?: "zoom" | "tilt" | "overlay" | "parallax" | "lift" | "blur";
  lightbox?: boolean;
  lazy?: boolean;
  aspectRatio?: "auto" | "square" | "4/3" | "16/9" | "21/9";
  onClick?: (image: GalleryImage, index: number) => void;
  onImageLoad?: (image: GalleryImage, index: number) => void;
  infinite?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ImageGallery({
  images,
  className,
  layout = "grid",
  columns = 3,
  gap = 16,
  animationType = "fade",
  hoverEffect = "zoom",
  lightbox = true,
  lazy = true,
  aspectRatio = "auto",
  onClick,
  onImageLoad,
  infinite = false,
  autoPlay = false,
  autoPlayInterval = 3000,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const galleryRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  // Auto play functionality for carousel
  useEffect(() => {
    if (!autoPlay || layout !== "carousel") return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length, layout]);

  // Animation variants
  const getAnimationVariants = () => {
    switch (animationType) {
      case "slide":
        return {
          hidden: { x: -100, opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: 100, opacity: 0 },
        };
      case "scale":
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
        };
      case "flip":
        return {
          hidden: { rotateY: 90, opacity: 0 },
          visible: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 },
        };
      case "reveal":
        return {
          hidden: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          visible: { clipPath: "inset(0% 0 0 0)", opacity: 1 },
          exit: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  // Layout styles
  const getLayoutStyles = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      gap: `${gap}px`,
    };

    switch (layout) {
      case "grid":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${Math.floor(
            300 / columns
          )}px, 1fr))`,
        };
      case "masonry":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridAutoRows: "auto",
        };
      case "carousel":
        return {
          ...baseStyles,
          display: "flex",
          overflowX: "auto" as const,
          scrollSnapType: "x mandatory" as const,
        };
      case "stack":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: "1fr",
        };
      case "justified":
        return {
          ...baseStyles,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        };
      default:
        return baseStyles;
    }
  };

  // Hover effect handlers
  const handleMouseEnter = (index: number) => {
    if (!isClient) return;
    const item = itemsRef.current[index];
    if (!item) return;

    switch (hoverEffect) {
      case "zoom":
        gsap.to(item.querySelector("img"), {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
        });
        break;
      case "tilt":
        gsap.to(item, {
          rotationY: 5,
          rotationX: 5,
          duration: 0.3,
          ease: "power2.out",
        });
        break;
      case "parallax":
        gsap.to(item.querySelector("img"), {
          y: -10,
          duration: 0.3,
          ease: "power2.out",
        });
        break;
      case "lift":
        gsap.to(item, {
          y: -10,
          rotationX: 15,
          duration: 0.3,
          ease: "power2.out",
        });
        break;
      case "blur":
        gsap.to(item.querySelector("img"), {
          filter: "blur(2px)",
          duration: 0.3,
        });
        break;
    }
  };

  const handleMouseLeave = (index: number) => {
    if (!isClient) return;
    const item = itemsRef.current[index];
    if (!item) return;

    gsap.to(item.querySelector("img"), {
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(item, {
      rotationY: 0,
      rotationX: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Image load handler
  const handleImageLoad = (image: GalleryImage, index: number) => {
    setLoadedImages((prev) => new Set(prev).add(image.id));
    onImageLoad?.(image, index);
  };

  // Click handler
  const handleImageClick = (image: GalleryImage, index: number) => {
    if (lightbox) {
      setSelectedImage(image);
    }
    onClick?.(image, index);
  };

  // Aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "4/3":
        return "aspect-[4/3]";
      case "16/9":
        return "aspect-video";
      case "21/9":
        return "aspect-[21/9]";
      default:
        return "";
    }
  };

  const variants = getAnimationVariants();

  return (
    <>
      <div
        ref={galleryRef}
        className={cn("gallery-container", className)}
        style={getLayoutStyles()}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "gallery-item cursor-pointer relative overflow-hidden rounded-lg",
              "transform-gpu will-change-transform",
              layout === "stack" && "absolute inset-0",
              getAspectRatioClass(),
              hoverEffect === "overlay" && "group"
            )}
            style={layout === "stack" ? { zIndex: images.length - index } : {}}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onClick={() => handleImageClick(image, index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                !loadedImages.has(image.id) && lazy && "opacity-0"
              )}
              loading={lazy ? "lazy" : "eager"}
              onLoad={() => handleImageLoad(image, index)}
            />

            {/* Title and description overlay */}
            {(image.title || image.description) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white">
                  {image.title && (
                    <h3 className="text-lg font-semibold mb-1">
                      {image.title}
                    </h3>
                  )}
                  {image.description && (
                    <p className="text-sm opacity-90">{image.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Hover overlay effect */}
            {hoverEffect === "overlay" && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-8"
              onClick={() => setSelectedImage(null)}
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>

              {/* Image info */}
              {(selectedImage.title || selectedImage.description) && (
                <div className="absolute bottom-4 left-4 text-white">
                  {selectedImage.title && (
                    <h3 className="text-xl font-bold mb-2">
                      {selectedImage.title}
                    </h3>
                  )}
                  {selectedImage.description && (
                    <p className="text-gray-300">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
