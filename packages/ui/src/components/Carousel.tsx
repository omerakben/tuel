import { cn } from "@tuel/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

export interface CarouselSlide {
  id: string;
  content: ReactNode;
  image?: string;
  title?: string;
  description?: string;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  className?: string;
  variant?: "fade" | "slide" | "scale" | "3d" | "stack";
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  showIndicators?: boolean;
  showArrows?: boolean;
  draggable?: boolean;
  direction?: "horizontal" | "vertical";
  onSlideChange?: (index: number) => void;
}

export function Carousel({
  slides,
  className,
  variant = "slide",
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
  showIndicators = true,
  showArrows = true,
  draggable = true,
  direction = "horizontal",
  onSlideChange,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );

  // Handle slide change
  const goToSlide = useCallback(
    (index: number) => {
      let newIndex = index;

      if (loop) {
        if (index < 0) newIndex = slides.length - 1;
        else if (index >= slides.length) newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(slides.length - 1, index));
      }

      setCurrentIndex(newIndex);
      onSlideChange?.(newIndex);
    },
    [loop, slides.length, onSlideChange]
  );

  // Auto play
  useEffect(() => {
    if (autoPlay && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isDragging, currentIndex, goToSlide, autoPlayInterval]);

  // Animation variants based on variant type
  const getVariants = () => {
    const isHorizontal = direction === "horizontal";

    switch (variant) {
      case "fade":
        return {
          enter: { opacity: 1 },
          center: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case "scale":
        return {
          enter: { scale: 0.8, opacity: 0 },
          center: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 },
        };
      case "3d":
        return {
          enter: {
            rotateY: isHorizontal ? 90 : 0,
            rotateX: isHorizontal ? 0 : 90,
            opacity: 0,
          },
          center: {
            rotateY: 0,
            rotateX: 0,
            opacity: 1,
          },
          exit: {
            rotateY: isHorizontal ? -90 : 0,
            rotateX: isHorizontal ? 0 : -90,
            opacity: 0,
          },
        };
      case "stack":
        return {
          enter: { scale: 0.8, y: 50, opacity: 0 },
          center: { scale: 1, y: 0, opacity: 1 },
          exit: { scale: 1.1, y: -50, opacity: 0 },
        };
      default: // slide
        return {
          enter: {
            x: isHorizontal ? 300 : 0,
            y: isHorizontal ? 0 : 300,
            opacity: 0,
          },
          center: {
            x: 0,
            y: 0,
            opacity: 1,
          },
          exit: {
            x: isHorizontal ? -300 : 0,
            y: isHorizontal ? 0 : -300,
            opacity: 0,
          },
        };
    }
  };

  // Handle drag
  const handleDragEnd = (
    _: any,
    info: { offset: { x: number; y: number } }
  ) => {
    const threshold = 50;
    const isHorizontal = direction === "horizontal";
    const offset = isHorizontal ? info.offset.x : info.offset.y;

    if (Math.abs(offset) > threshold) {
      if (offset > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
    }
    setIsDragging(false);
  };

  const variants = getVariants();

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            drag={draggable ? (direction === "horizontal" ? "x" : "y") : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            {slides[currentIndex]?.image && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slides[currentIndex].image})`,
                }}
              />
            )}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
              {slides[currentIndex]?.title && (
                <h2 className="text-4xl font-bold mb-4 text-center">
                  {slides[currentIndex].title}
                </h2>
              )}
              {slides[currentIndex]?.description && (
                <p className="text-lg text-center mb-6">
                  {slides[currentIndex].description}
                </p>
              )}
              {slides[currentIndex]?.content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={() => goToSlide(currentIndex - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => goToSlide(currentIndex + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
