import { cn } from "@tuel/utils";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

export interface CarouselSlide {
  id: string;
  content: ReactNode;
  image?: string;
  title?: string;
  description?: string;
  href?: string;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  className?: string;
  variant?: "fade" | "slide" | "scale" | "3d" | "stack" | "coverflow";
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  showIndicators?: boolean;
  showArrows?: boolean;
  draggable?: boolean;
  direction?: "horizontal" | "vertical";
  slidesPerView?: number;
  spacing?: number;
  pauseOnHover?: boolean;
  effect?: "slide" | "fade" | "cube" | "flip" | "cards";
  onSlideChange?: (index: number) => void;
  onSlideClick?: (slide: CarouselSlide, index: number) => void;
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
  slidesPerView = 1,
  spacing = 0,
  pauseOnHover = true,
  effect = "slide",
  onSlideChange,
  onSlideClick,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Auto play functionality
  const startAutoPlay = useCallback(() => {
    if (!autoPlay || slides.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return loop ? next % slides.length : Math.min(next, slides.length - 1);
      });
    }, autoPlayInterval);
  }, [autoPlay, autoPlayInterval, slides.length, loop]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  // Effect for auto play
  useEffect(() => {
    if (isPlaying && !isDragging) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return stopAutoPlay;
  }, [isPlaying, isDragging, startAutoPlay, stopAutoPlay]);

  // Navigation functions
  const goToSlide = useCallback(
    (index: number) => {
      let targetIndex = index;

      if (loop) {
        if (targetIndex < 0) {
          targetIndex = slides.length - 1;
        } else if (targetIndex >= slides.length) {
          targetIndex = 0;
        }
      } else {
        targetIndex = Math.max(0, Math.min(targetIndex, slides.length - 1));
      }

      setCurrentIndex(targetIndex);
      onSlideChange?.(targetIndex);
    },
    [slides.length, loop, onSlideChange]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (direction === "horizontal") prevSlide();
          break;
        case "ArrowRight":
          if (direction === "horizontal") nextSlide();
          break;
        case "ArrowUp":
          if (direction === "vertical") prevSlide();
          break;
        case "ArrowDown":
          if (direction === "vertical") nextSlide();
          break;
        case " ":
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, nextSlide, prevSlide]);

  // Drag handlers
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    const isHorizontal = direction === "horizontal";
    const velocity = isHorizontal ? info.velocity.x : info.velocity.y;
    const offset = isHorizontal ? info.offset.x : info.offset.y;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }

    setIsDragging(false);
  };

  // Animation variants
  const getSlideVariants = () => {
    const isHorizontal = direction === "horizontal";

    switch (variant) {
      case "fade":
        return {
          enter: { opacity: 0 },
          center: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case "scale":
        return {
          enter: { opacity: 0, scale: 0.8 },
          center: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 },
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
      case "coverflow":
        return {
          enter: {
            x: isHorizontal ? 300 : 0,
            rotateY: 45,
            scale: 0.8,
            opacity: 0.5,
          },
          center: { x: 0, rotateY: 0, scale: 1, opacity: 1 },
          exit: {
            x: isHorizontal ? -300 : 0,
            rotateY: -45,
            scale: 0.8,
            opacity: 0.5,
          },
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

  const slideVariants = getSlideVariants();

  // Hover handlers
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && autoPlay) {
      setIsPlaying(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      style={{
        perspective:
          variant === "3d" || variant === "coverflow" ? 1000 : undefined,
      }}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-full h-full"
            drag={draggable ? (direction === "horizontal" ? "x" : "y") : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            onClick={() => onSlideClick?.(slides[currentIndex], currentIndex)}
            style={{
              transformStyle:
                variant === "3d" || variant === "coverflow"
                  ? "preserve-3d"
                  : undefined,
            }}
          >
            {/* Background Image */}
            {slides[currentIndex]?.image && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slides[currentIndex].image})`,
                }}
              />
            )}

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
              <div className="text-center">
                {slides[currentIndex]?.title && (
                  <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
                    {slides[currentIndex].title}
                  </h2>
                )}
                {slides[currentIndex]?.description && (
                  <p className="text-lg text-white/90 mb-6 drop-shadow-md">
                    {slides[currentIndex].description}
                  </p>
                )}
                {slides[currentIndex]?.content}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={cn(
              "absolute top-1/2 left-4 transform -translate-y-1/2",
              "bg-black/50 text-white p-3 rounded-full",
              "hover:bg-black/75 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-white/50",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={!loop && currentIndex === 0}
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
            onClick={nextSlide}
            className={cn(
              "absolute top-1/2 right-4 transform -translate-y-1/2",
              "bg-black/50 text-white p-3 rounded-full",
              "hover:bg-black/75 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-white/50",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={!loop && currentIndex === slides.length - 1}
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
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-white/50",
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {autoPlay && (
        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          className={cn(
            "absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full",
            "hover:bg-black/75 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-white/50"
          )}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* Progress Bar */}
      {autoPlay && isPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: autoPlayInterval / 1000,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </div>
      )}
    </div>
  );
}
