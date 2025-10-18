import { cn } from "@tuel/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  layout?: "grid" | "masonry" | "carousel" | "stack";
  columns?: number;
  gap?: number;
  animationType?: "fade" | "slide" | "scale" | "flip";
  hoverEffect?: "zoom" | "tilt" | "overlay" | "parallax";
  onClick?: (image: GalleryImage, index: number) => void;
}

export function ImageGallery({
  images,
  className,
  layout = "grid",
  columns = 3,
  gap = 16,
  animationType = "fade",
  hoverEffect = "zoom",
  onClick,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

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
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  // Layout styles
  const getLayoutStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: "grid",
      gap: `${gap}px`,
    };

    switch (layout) {
      case "masonry":
        return {
          ...baseStyles,
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridAutoRows: "masonry",
        };
      case "carousel":
        return {
          display: "flex",
          gap: `${gap}px`,
          overflowX: "auto" as const,
          scrollSnapType: "x mandatory" as const,
        };
      case "stack":
        return {
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: `${gap}px`,
        };
      default: // grid
        return {
          ...baseStyles,
          gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
        };
    }
  };

  // Hover effect classes
  const getHoverEffectClass = () => {
    switch (hoverEffect) {
      case "zoom":
        return "hover:scale-105 transition-transform duration-300";
      case "tilt":
        return "hover:rotate-1 transition-transform duration-300";
      case "overlay":
        return "relative group";
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
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ delay: index * 0.1 }}
            className={cn(
              "gallery-item cursor-pointer relative overflow-hidden rounded-lg",
              getHoverEffectClass()
            )}
            onClick={() => {
              setSelectedImage(image);
              onClick?.(image, index);
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {hoverEffect === "overlay" && (
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  {image.title && (
                    <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-sm">{image.description}</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain"
              />

              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white text-2xl hover:opacity-70 transition-opacity"
                aria-label="Close"
              >
                ×
              </button>

              {(selectedImage.title || selectedImage.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
                  {selectedImage.title && (
                    <h3 className="text-xl font-bold mb-2">
                      {selectedImage.title}
                    </h3>
                  )}
                  {selectedImage.description && (
                    <p className="text-sm opacity-90">
                      {selectedImage.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
