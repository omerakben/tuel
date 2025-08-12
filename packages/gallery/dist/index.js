"use client";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/components/ImageGallery.tsx
import { cn, isClient } from "@tuel/utils";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ImageGallery({
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
  autoPlayInterval = 3e3
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(/* @__PURE__ */ new Set());
  const galleryRef = useRef(null);
  const itemsRef = useRef([]);
  useEffect(() => {
    if (!autoPlay || layout !== "carousel") return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length, layout]);
  const getAnimationVariants = () => {
    switch (animationType) {
      case "slide":
        return {
          hidden: { x: -100, opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: 100, opacity: 0 }
        };
      case "scale":
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 }
        };
      case "flip":
        return {
          hidden: { rotateY: 90, opacity: 0 },
          visible: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 }
        };
      case "reveal":
        return {
          hidden: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          visible: { clipPath: "inset(0% 0 0 0)", opacity: 1 },
          exit: { clipPath: "inset(0 0 100% 0)", opacity: 0 }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };
  const getLayoutStyles = () => {
    const baseStyles = {
      gap: `${gap}px`
    };
    switch (layout) {
      case "grid":
        return __spreadProps(__spreadValues({}, baseStyles), {
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${Math.floor(
            300 / columns
          )}px, 1fr))`
        });
      case "masonry":
        return __spreadProps(__spreadValues({}, baseStyles), {
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridAutoRows: "auto"
        });
      case "carousel":
        return __spreadProps(__spreadValues({}, baseStyles), {
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory"
        });
      case "stack":
        return __spreadProps(__spreadValues({}, baseStyles), {
          display: "grid",
          gridTemplateColumns: "1fr"
        });
      case "justified":
        return __spreadProps(__spreadValues({}, baseStyles), {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between"
        });
      default:
        return baseStyles;
    }
  };
  const handleMouseEnter = (index) => {
    if (!isClient) return;
    const item = itemsRef.current[index];
    if (!item) return;
    switch (hoverEffect) {
      case "zoom":
        gsap.to(item.querySelector("img"), {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
        break;
      case "tilt":
        gsap.to(item, {
          rotationY: 5,
          rotationX: 5,
          duration: 0.3,
          ease: "power2.out"
        });
        break;
      case "parallax":
        gsap.to(item.querySelector("img"), {
          y: -10,
          duration: 0.3,
          ease: "power2.out"
        });
        break;
      case "lift":
        gsap.to(item, {
          y: -10,
          rotationX: 15,
          duration: 0.3,
          ease: "power2.out"
        });
        break;
      case "blur":
        gsap.to(item.querySelector("img"), {
          filter: "blur(2px)",
          duration: 0.3
        });
        break;
    }
  };
  const handleMouseLeave = (index) => {
    if (!isClient) return;
    const item = itemsRef.current[index];
    if (!item) return;
    gsap.to(item.querySelector("img"), {
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to(item, {
      rotationY: 0,
      rotationX: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };
  const handleImageLoad = (image, index) => {
    setLoadedImages((prev) => new Set(prev).add(image.id));
    onImageLoad == null ? void 0 : onImageLoad(image, index);
  };
  const handleImageClick = (image, index) => {
    if (lightbox) {
      setSelectedImage(image);
    }
    onClick == null ? void 0 : onClick(image, index);
  };
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: galleryRef,
        className: cn("gallery-container", className),
        style: getLayoutStyles(),
        children: images.map((image, index) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            ref: (el) => {
              if (el) itemsRef.current[index] = el;
            },
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            variants,
            transition: { delay: index * 0.1 },
            className: cn(
              "gallery-item cursor-pointer relative overflow-hidden rounded-lg",
              "transform-gpu will-change-transform",
              layout === "stack" && "absolute inset-0",
              getAspectRatioClass(),
              hoverEffect === "overlay" && "group"
            ),
            style: layout === "stack" ? { zIndex: images.length - index } : {},
            onMouseEnter: () => handleMouseEnter(index),
            onMouseLeave: () => handleMouseLeave(index),
            onClick: () => handleImageClick(image, index),
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: image.src,
                  alt: image.alt,
                  className: cn(
                    "w-full h-full object-cover transition-all duration-300",
                    !loadedImages.has(image.id) && lazy && "opacity-0"
                  ),
                  loading: lazy ? "lazy" : "eager",
                  onLoad: () => handleImageLoad(image, index)
                }
              ),
              (image.title || image.description) && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4", children: /* @__PURE__ */ jsxs("div", { className: "text-white", children: [
                image.title && /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: image.title }),
                image.description && /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: image.description })
              ] }) }),
              hoverEffect === "overlay" && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-white opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "w-8 h-8",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    }
                  )
                }
              ) }) })
            ]
          },
          image.id
        ))
      }
    ),
    lightbox && /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImage && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-8",
        onClick: () => setSelectedImage(null),
        children: [
          /* @__PURE__ */ jsx(
            motion.img,
            {
              initial: { scale: 0.8 },
              animate: { scale: 1 },
              exit: { scale: 0.8 },
              src: selectedImage.src,
              alt: selectedImage.alt,
              className: "max-w-full max-h-full object-contain",
              onClick: (e) => e.stopPropagation()
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors",
              onClick: () => setSelectedImage(null),
              children: "\xD7"
            }
          ),
          (selectedImage.title || selectedImage.description) && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-4 text-white", children: [
            selectedImage.title && /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-2", children: selectedImage.title }),
            selectedImage.description && /* @__PURE__ */ jsx("p", { className: "text-gray-300", children: selectedImage.description })
          ] })
        ]
      }
    ) })
  ] });
}

// src/components/Carousel.tsx
import { cn as cn2 } from "@tuel/utils";
import { AnimatePresence as AnimatePresence2, motion as motion2 } from "framer-motion";
import { useCallback, useEffect as useEffect2, useRef as useRef2, useState as useState2 } from "react";
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function Carousel({
  slides,
  className,
  variant = "slide",
  autoPlay = false,
  autoPlayInterval = 5e3,
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
  onSlideClick
}) {
  var _a, _b, _c, _d;
  const [currentIndex, setCurrentIndex] = useState2(0);
  const [isDragging, setIsDragging] = useState2(false);
  const [isPlaying, setIsPlaying] = useState2(autoPlay);
  const containerRef = useRef2(null);
  const intervalRef = useRef2();
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
      intervalRef.current = void 0;
    }
  }, []);
  useEffect2(() => {
    if (isPlaying && !isDragging) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return stopAutoPlay;
  }, [isPlaying, isDragging, startAutoPlay, stopAutoPlay]);
  const goToSlide = useCallback(
    (index) => {
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
      onSlideChange == null ? void 0 : onSlideChange(targetIndex);
    },
    [slides.length, loop, onSlideChange]
  );
  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);
  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);
  useEffect2(() => {
    const handleKeyDown = (e) => {
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
  const handleDragEnd = (event, info) => {
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
  const getSlideVariants = () => {
    const isHorizontal = direction === "horizontal";
    switch (variant) {
      case "fade":
        return {
          enter: { opacity: 0 },
          center: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case "scale":
        return {
          enter: { opacity: 0, scale: 0.8 },
          center: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 }
        };
      case "3d":
        return {
          enter: {
            rotateY: isHorizontal ? 90 : 0,
            rotateX: isHorizontal ? 0 : 90,
            opacity: 0
          },
          center: {
            rotateY: 0,
            rotateX: 0,
            opacity: 1
          },
          exit: {
            rotateY: isHorizontal ? -90 : 0,
            rotateX: isHorizontal ? 0 : -90,
            opacity: 0
          }
        };
      case "stack":
        return {
          enter: { scale: 0.8, y: 50, opacity: 0 },
          center: { scale: 1, y: 0, opacity: 1 },
          exit: { scale: 1.1, y: -50, opacity: 0 }
        };
      case "coverflow":
        return {
          enter: {
            x: isHorizontal ? 300 : 0,
            rotateY: 45,
            scale: 0.8,
            opacity: 0.5
          },
          center: { x: 0, rotateY: 0, scale: 1, opacity: 1 },
          exit: {
            x: isHorizontal ? -300 : 0,
            rotateY: -45,
            scale: 0.8,
            opacity: 0.5
          }
        };
      default:
        return {
          enter: {
            x: isHorizontal ? 300 : 0,
            y: isHorizontal ? 0 : 300,
            opacity: 0
          },
          center: {
            x: 0,
            y: 0,
            opacity: 1
          },
          exit: {
            x: isHorizontal ? -300 : 0,
            y: isHorizontal ? 0 : -300,
            opacity: 0
          }
        };
    }
  };
  const slideVariants = getSlideVariants();
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
  return /* @__PURE__ */ jsxs2(
    "div",
    {
      ref: containerRef,
      className: cn2(
        "relative w-full h-full overflow-hidden",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      ),
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      tabIndex: 0,
      style: {
        perspective: variant === "3d" || variant === "coverflow" ? 1e3 : void 0
      },
      children: [
        /* @__PURE__ */ jsx2("div", { className: "relative w-full h-full", children: /* @__PURE__ */ jsx2(AnimatePresence2, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxs2(
          motion2.div,
          {
            variants: slideVariants,
            initial: "enter",
            animate: "center",
            exit: "exit",
            transition: {
              duration: 0.5,
              ease: "easeInOut"
            },
            className: "absolute inset-0 w-full h-full",
            drag: draggable ? direction === "horizontal" ? "x" : "y" : false,
            dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
            dragElastic: 0.2,
            onDragStart: () => setIsDragging(true),
            onDragEnd: handleDragEnd,
            onClick: () => onSlideClick == null ? void 0 : onSlideClick(slides[currentIndex], currentIndex),
            style: {
              transformStyle: variant === "3d" || variant === "coverflow" ? "preserve-3d" : void 0
            },
            children: [
              ((_a = slides[currentIndex]) == null ? void 0 : _a.image) && /* @__PURE__ */ jsx2(
                "div",
                {
                  className: "absolute inset-0 bg-cover bg-center",
                  style: {
                    backgroundImage: `url(${slides[currentIndex].image})`
                  }
                }
              ),
              /* @__PURE__ */ jsx2("div", { className: "relative z-10 w-full h-full flex items-center justify-center p-8", children: /* @__PURE__ */ jsxs2("div", { className: "text-center", children: [
                ((_b = slides[currentIndex]) == null ? void 0 : _b.title) && /* @__PURE__ */ jsx2("h2", { className: "text-4xl font-bold mb-4 text-white drop-shadow-lg", children: slides[currentIndex].title }),
                ((_c = slides[currentIndex]) == null ? void 0 : _c.description) && /* @__PURE__ */ jsx2("p", { className: "text-lg text-white/90 mb-6 drop-shadow-md", children: slides[currentIndex].description }),
                (_d = slides[currentIndex]) == null ? void 0 : _d.content
              ] }) })
            ]
          },
          currentIndex
        ) }) }),
        showArrows && slides.length > 1 && /* @__PURE__ */ jsxs2(Fragment2, { children: [
          /* @__PURE__ */ jsx2(
            "button",
            {
              onClick: prevSlide,
              className: cn2(
                "absolute top-1/2 left-4 transform -translate-y-1/2",
                "bg-black/50 text-white p-3 rounded-full",
                "hover:bg-black/75 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-white/50",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              ),
              disabled: !loop && currentIndex === 0,
              "aria-label": "Previous slide",
              children: /* @__PURE__ */ jsx2(
                "svg",
                {
                  className: "w-6 h-6",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsx2(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M15 19l-7-7 7-7"
                    }
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ jsx2(
            "button",
            {
              onClick: nextSlide,
              className: cn2(
                "absolute top-1/2 right-4 transform -translate-y-1/2",
                "bg-black/50 text-white p-3 rounded-full",
                "hover:bg-black/75 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-white/50",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              ),
              disabled: !loop && currentIndex === slides.length - 1,
              "aria-label": "Next slide",
              children: /* @__PURE__ */ jsx2(
                "svg",
                {
                  className: "w-6 h-6",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsx2(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M9 5l7 7-7 7"
                    }
                  )
                }
              )
            }
          )
        ] }),
        showIndicators && slides.length > 1 && /* @__PURE__ */ jsx2("div", { className: "absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2", children: slides.map((_, index) => /* @__PURE__ */ jsx2(
          "button",
          {
            onClick: () => goToSlide(index),
            className: cn2(
              "w-3 h-3 rounded-full transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-white/50",
              index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            ),
            "aria-label": `Go to slide ${index + 1}`
          },
          index
        )) }),
        autoPlay && /* @__PURE__ */ jsx2(
          "button",
          {
            onClick: () => setIsPlaying((prev) => !prev),
            className: cn2(
              "absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full",
              "hover:bg-black/75 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-white/50"
            ),
            "aria-label": isPlaying ? "Pause slideshow" : "Play slideshow",
            children: isPlaying ? /* @__PURE__ */ jsx2("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx2("path", { d: "M6 4h4v16H6V4zm8 0h4v16h-4V4z" }) }) : /* @__PURE__ */ jsx2("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx2("path", { d: "M8 5v14l11-7z" }) })
          }
        ),
        autoPlay && isPlaying && /* @__PURE__ */ jsx2("div", { className: "absolute bottom-0 left-0 w-full h-1 bg-white/20", children: /* @__PURE__ */ jsx2(
          motion2.div,
          {
            className: "h-full bg-white",
            initial: { width: "0%" },
            animate: { width: "100%" },
            transition: {
              duration: autoPlayInterval / 1e3,
              ease: "linear",
              repeat: Infinity
            }
          }
        ) })
      ]
    }
  );
}

// src/components/VideoGallery.tsx
import { cn as cn3 } from "@tuel/utils";
import { AnimatePresence as AnimatePresence3, motion as motion3 } from "framer-motion";
import { useRef as useRef3, useState as useState3 } from "react";
import { Fragment as Fragment3, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function VideoGallery({
  videos,
  className,
  layout = "grid",
  columns = 3,
  gap = 16,
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  preload = "metadata",
  aspectRatio = "16/9",
  showThumbnails = true,
  lightbox = true,
  onVideoSelect,
  onVideoPlay,
  onVideoEnd
}) {
  const [selectedVideo, setSelectedVideo] = useState3(null);
  const [playingVideo, setPlayingVideo] = useState3(null);
  const [loadedVideos, setLoadedVideos] = useState3(/* @__PURE__ */ new Set());
  const videoRefs = useRef3(/* @__PURE__ */ new Map());
  const getLayoutStyles = () => {
    switch (layout) {
      case "grid":
        return {
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${Math.floor(
            300 / columns
          )}px, 1fr))`,
          gap: `${gap}px`
        };
      case "list":
        return {
          display: "flex",
          flexDirection: "column",
          gap: `${gap}px`
        };
      case "carousel":
        return {
          display: "flex",
          gap: `${gap}px`,
          overflowX: "auto",
          scrollSnapType: "x mandatory"
        };
      default:
        return {};
    }
  };
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "16/9":
        return "aspect-video";
      case "4/3":
        return "aspect-[4/3]";
      case "1/1":
        return "aspect-square";
      default:
        return "";
    }
  };
  const getVideoType = (video) => {
    if (video.type) return video.type;
    const url = video.src.toLowerCase();
    if (url.includes("youtube.com") || url.includes("youtu.be"))
      return "youtube";
    if (url.includes("vimeo.com")) return "vimeo";
    if (url.endsWith(".webm")) return "webm";
    if (url.endsWith(".ogg")) return "ogg";
    return "mp4";
  };
  const getVideoId = (video) => {
    const type = getVideoType(video);
    const url = video.src;
    if (type === "youtube") {
      const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
      );
      return match ? match[1] : null;
    }
    if (type === "vimeo") {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  };
  const handleVideoClick = (video, index) => {
    if (lightbox) {
      setSelectedVideo(video);
    }
    onVideoSelect == null ? void 0 : onVideoSelect(video, index);
  };
  const handleVideoPlay = (video, index) => {
    setPlayingVideo(video.id);
    onVideoPlay == null ? void 0 : onVideoPlay(video, index);
  };
  const handleVideoEnd = (video, index) => {
    setPlayingVideo(null);
    onVideoEnd == null ? void 0 : onVideoEnd(video, index);
  };
  const handleVideoLoad = (videoId) => {
    setLoadedVideos((prev) => new Set(prev).add(videoId));
  };
  const pauseOtherVideos = (currentVideoId) => {
    videoRefs.current.forEach((video, videoId) => {
      if (videoId !== currentVideoId && !video.paused) {
        video.pause();
      }
    });
  };
  const renderVideo = (video, index) => {
    const videoType = getVideoType(video);
    const videoId = getVideoId(video);
    if (videoType === "youtube" && videoId) {
      return /* @__PURE__ */ jsx3(
        "iframe",
        {
          src: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${autoPlay ? "&autoplay=1" : ""}${muted ? "&mute=1" : ""}`,
          className: "w-full h-full",
          frameBorder: "0",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowFullScreen: true,
          title: video.title || `Video ${index + 1}`
        }
      );
    }
    if (videoType === "vimeo" && videoId) {
      return /* @__PURE__ */ jsx3(
        "iframe",
        {
          src: `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479${autoPlay ? "&autoplay=1" : ""}${muted ? "&muted=1" : ""}`,
          className: "w-full h-full",
          frameBorder: "0",
          allow: "autoplay; fullscreen; picture-in-picture",
          allowFullScreen: true,
          title: video.title || `Video ${index + 1}`
        }
      );
    }
    return /* @__PURE__ */ jsxs3(
      "video",
      {
        ref: (el) => {
          if (el) videoRefs.current.set(video.id, el);
        },
        className: "w-full h-full object-cover",
        poster: video.poster || video.thumbnail,
        controls,
        autoPlay,
        muted,
        loop,
        preload,
        onPlay: () => {
          handleVideoPlay(video, index);
          pauseOtherVideos(video.id);
        },
        onEnded: () => handleVideoEnd(video, index),
        onLoadedMetadata: () => handleVideoLoad(video.id),
        children: [
          /* @__PURE__ */ jsx3("source", { src: video.src, type: `video/${videoType}` }),
          "Your browser does not support the video tag."
        ]
      }
    );
  };
  return /* @__PURE__ */ jsxs3(Fragment3, { children: [
    /* @__PURE__ */ jsx3("div", { className: cn3("video-gallery", className), style: getLayoutStyles(), children: videos.map((video, index) => /* @__PURE__ */ jsxs3(
      motion3.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { delay: index * 0.1 },
        className: cn3(
          "video-item relative cursor-pointer group",
          "rounded-lg overflow-hidden bg-black",
          getAspectRatioClass(),
          layout === "carousel" && "flex-shrink-0 w-80"
        ),
        onClick: () => handleVideoClick(video, index),
        children: [
          /* @__PURE__ */ jsx3("div", { className: "w-full h-full", children: renderVideo(video, index) }),
          showThumbnails && !loadedVideos.has(video.id) && /* @__PURE__ */ jsx3("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors", children: /* @__PURE__ */ jsx3("div", { className: "w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx3(
            "svg",
            {
              className: "w-6 h-6 text-black ml-1",
              fill: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx3("path", { d: "M8 5v14l11-7z" })
            }
          ) }) }),
          (video.title || video.description || video.duration) && /* @__PURE__ */ jsx3("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxs3("div", { className: "text-white", children: [
            video.title && /* @__PURE__ */ jsx3("h3", { className: "font-semibold text-lg mb-1 line-clamp-1", children: video.title }),
            video.description && /* @__PURE__ */ jsx3("p", { className: "text-sm text-gray-300 mb-2 line-clamp-2", children: video.description }),
            video.duration && /* @__PURE__ */ jsx3("span", { className: "text-xs bg-black/50 px-2 py-1 rounded", children: video.duration })
          ] }) }),
          playingVideo === video.id && /* @__PURE__ */ jsx3("div", { className: "absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium", children: "PLAYING" })
        ]
      },
      video.id
    )) }),
    lightbox && /* @__PURE__ */ jsx3(AnimatePresence3, { children: selectedVideo && /* @__PURE__ */ jsx3(
      motion3.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8",
        onClick: () => setSelectedVideo(null),
        children: /* @__PURE__ */ jsxs3(
          motion3.div,
          {
            initial: { scale: 0.8 },
            animate: { scale: 1 },
            exit: { scale: 0.8 },
            className: "relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden",
            onClick: (e) => e.stopPropagation(),
            children: [
              renderVideo(
                selectedVideo,
                videos.findIndex((v) => v.id === selectedVideo.id)
              ),
              /* @__PURE__ */ jsx3(
                "button",
                {
                  className: "absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors z-10",
                  onClick: () => setSelectedVideo(null),
                  children: "\xD7"
                }
              ),
              (selectedVideo.title || selectedVideo.description) && /* @__PURE__ */ jsxs3("div", { className: "absolute bottom-4 left-4 text-white z-10", children: [
                selectedVideo.title && /* @__PURE__ */ jsx3("h3", { className: "text-xl font-bold mb-2", children: selectedVideo.title }),
                selectedVideo.description && /* @__PURE__ */ jsx3("p", { className: "text-gray-300", children: selectedVideo.description })
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}

// src/components/MediaGrid.tsx
import { cn as cn4 } from "@tuel/utils";
import { AnimatePresence as AnimatePresence4, motion as motion4 } from "framer-motion";
import { useRef as useRef4, useState as useState4 } from "react";
import { Fragment as Fragment4, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function MediaGrid({
  media,
  className,
  layout = "grid",
  columns = 3,
  gap = 16,
  aspectRatio = "auto",
  lightbox = true,
  autoPlay = false,
  lazy = true,
  showOverlay = true,
  filterType = "all",
  sortBy = "none",
  onMediaClick,
  onFilterChange
}) {
  const [selectedMedia, setSelectedMedia] = useState4(null);
  const [currentFilter, setCurrentFilter] = useState4(filterType);
  const [loadedItems, setLoadedItems] = useState4(/* @__PURE__ */ new Set());
  const gridRef = useRef4(null);
  const filteredMedia = media.filter((item) => currentFilter === "all" || item.type === currentFilter).sort((a, b) => {
    switch (sortBy) {
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });
  const getLayoutStyles = () => {
    switch (layout) {
      case "grid":
        return {
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${Math.floor(
            300 / columns
          )}px, 1fr))`,
          gap: `${gap}px`
        };
      case "masonry":
        return {
          columnCount: columns,
          columnGap: `${gap}px`
        };
      case "justified":
        return {
          display: "flex",
          flexWrap: "wrap",
          gap: `${gap}px`
        };
      case "pinterest":
        return {
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
          gridAutoRows: "10px",
          gap: `${gap}px`
        };
      default:
        return {};
    }
  };
  const getAspectRatioClass = () => {
    if (aspectRatio === "auto") return "";
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "4/3":
        return "aspect-[4/3]";
      case "16/9":
        return "aspect-video";
      default:
        return "";
    }
  };
  const getMediaTypeIcon = (type) => {
    switch (type) {
      case "video":
        return /* @__PURE__ */ jsx4("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx4("path", { d: "M8 5v14l11-7z" }) });
      case "audio":
        return /* @__PURE__ */ jsx4("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx4("path", { d: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" }) });
      default:
        return /* @__PURE__ */ jsx4("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx4("path", { d: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" }) });
    }
  };
  const handleMediaClick = (item, index) => {
    if (lightbox) {
      setSelectedMedia(item);
    }
    onMediaClick == null ? void 0 : onMediaClick(item, index);
  };
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    onFilterChange == null ? void 0 : onFilterChange(filter);
  };
  const handleItemLoad = (itemId) => {
    setLoadedItems((prev) => new Set(prev).add(itemId));
  };
  const renderMediaItem = (item, index) => {
    switch (item.type) {
      case "video":
        return /* @__PURE__ */ jsx4(
          "video",
          {
            className: "w-full h-full object-cover",
            poster: item.poster || item.thumbnail,
            controls: !lightbox,
            autoPlay,
            muted: true,
            loop: true,
            preload: "metadata",
            onLoadedMetadata: () => handleItemLoad(item.id),
            children: /* @__PURE__ */ jsx4("source", { src: item.src, type: "video/mp4" })
          }
        );
      case "audio":
        return /* @__PURE__ */ jsxs4("div", { className: "w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center", children: [
          /* @__PURE__ */ jsxs4("div", { className: "text-center text-white p-4", children: [
            /* @__PURE__ */ jsx4("div", { className: "w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4", children: getMediaTypeIcon("audio") }),
            item.title && /* @__PURE__ */ jsx4("h4", { className: "font-semibold mb-2", children: item.title }),
            item.duration && /* @__PURE__ */ jsx4("p", { className: "text-sm opacity-75", children: item.duration })
          ] }),
          /* @__PURE__ */ jsx4(
            "audio",
            {
              className: "absolute bottom-2 left-2 right-2 opacity-75",
              controls: true,
              preload: "metadata",
              onLoadedMetadata: () => handleItemLoad(item.id),
              children: /* @__PURE__ */ jsx4("source", { src: item.src, type: "audio/mpeg" })
            }
          )
        ] });
      default:
        return /* @__PURE__ */ jsx4(
          "img",
          {
            src: item.src,
            alt: item.alt || item.title || `Media item ${index + 1}`,
            className: cn4(
              "w-full h-full object-cover transition-all duration-300",
              !loadedItems.has(item.id) && lazy && "opacity-0"
            ),
            loading: lazy ? "lazy" : "eager",
            onLoad: () => handleItemLoad(item.id)
          }
        );
    }
  };
  const mediaTypes = [...new Set(media.map((item) => item.type))];
  return /* @__PURE__ */ jsxs4(Fragment4, { children: [
    mediaTypes.length > 1 && /* @__PURE__ */ jsxs4("div", { className: "flex gap-2 mb-6 flex-wrap", children: [
      /* @__PURE__ */ jsxs4(
        "button",
        {
          onClick: () => handleFilterChange("all"),
          className: cn4(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            currentFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          ),
          children: [
            "All (",
            media.length,
            ")"
          ]
        }
      ),
      mediaTypes.map((type) => {
        const count = media.filter((item) => item.type === type).length;
        return /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: () => handleFilterChange(type),
            className: cn4(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
              currentFilter === type ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            ),
            children: [
              type,
              " (",
              count,
              ")"
            ]
          },
          type
        );
      })
    ] }),
    /* @__PURE__ */ jsx4(
      "div",
      {
        ref: gridRef,
        className: cn4("media-grid", className),
        style: getLayoutStyles(),
        children: filteredMedia.map((item, index) => /* @__PURE__ */ jsxs4(
          motion4.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            transition: { delay: index * 0.05 },
            className: cn4(
              "media-item relative cursor-pointer group",
              "rounded-lg overflow-hidden bg-gray-100",
              getAspectRatioClass(),
              layout === "masonry" && "break-inside-avoid mb-4"
            ),
            onClick: () => handleMediaClick(item, index),
            style: layout === "pinterest" && item.size ? { gridRowEnd: `span ${Math.ceil(item.size.height / 10)}` } : void 0,
            children: [
              /* @__PURE__ */ jsx4("div", { className: "w-full h-full", children: renderMediaItem(item, index) }),
              /* @__PURE__ */ jsxs4("div", { className: "absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1", children: [
                /* @__PURE__ */ jsx4("span", { className: "w-3 h-3", children: getMediaTypeIcon(item.type) }),
                item.type.toUpperCase()
              ] }),
              item.duration && /* @__PURE__ */ jsx4("div", { className: "absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs", children: item.duration }),
              showOverlay && (item.title || item.description) && /* @__PURE__ */ jsx4("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4", children: /* @__PURE__ */ jsxs4("div", { className: "text-white", children: [
                item.title && /* @__PURE__ */ jsx4("h3", { className: "font-semibold text-lg mb-1 line-clamp-1", children: item.title }),
                item.description && /* @__PURE__ */ jsx4("p", { className: "text-sm text-gray-300 line-clamp-2", children: item.description })
              ] }) }),
              /* @__PURE__ */ jsx4("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center", children: /* @__PURE__ */ jsx4("div", { className: "opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx4("div", { className: "w-12 h-12 bg-white/90 rounded-full flex items-center justify-center", children: getMediaTypeIcon(item.type) }) }) })
            ]
          },
          item.id
        ))
      }
    ),
    lightbox && /* @__PURE__ */ jsx4(AnimatePresence4, { children: selectedMedia && /* @__PURE__ */ jsx4(
      motion4.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8",
        onClick: () => setSelectedMedia(null),
        children: /* @__PURE__ */ jsxs4(
          motion4.div,
          {
            initial: { scale: 0.8 },
            animate: { scale: 1 },
            exit: { scale: 0.8 },
            className: "relative max-w-4xl max-h-full bg-black rounded-lg overflow-hidden",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs4("div", { className: "w-full h-full", children: [
                selectedMedia.type === "video" && /* @__PURE__ */ jsx4(
                  "video",
                  {
                    className: "w-full h-full",
                    controls: true,
                    autoPlay: true,
                    poster: selectedMedia.poster,
                    children: /* @__PURE__ */ jsx4("source", { src: selectedMedia.src, type: "video/mp4" })
                  }
                ),
                selectedMedia.type === "image" && /* @__PURE__ */ jsx4(
                  "img",
                  {
                    src: selectedMedia.src,
                    alt: selectedMedia.alt || selectedMedia.title || "Media item",
                    className: "w-full h-full object-contain"
                  }
                ),
                selectedMedia.type === "audio" && /* @__PURE__ */ jsxs4("div", { className: "p-8 text-center", children: [
                  /* @__PURE__ */ jsx4("div", { className: "w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx4("div", { className: "w-16 h-16 text-white", children: getMediaTypeIcon("audio") }) }),
                  selectedMedia.title && /* @__PURE__ */ jsx4("h3", { className: "text-2xl font-bold text-white mb-4", children: selectedMedia.title }),
                  /* @__PURE__ */ jsx4("audio", { className: "w-full", controls: true, autoPlay: true, children: /* @__PURE__ */ jsx4("source", { src: selectedMedia.src, type: "audio/mpeg" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsx4(
                "button",
                {
                  className: "absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors z-10",
                  onClick: () => setSelectedMedia(null),
                  children: "\xD7"
                }
              ),
              (selectedMedia.title || selectedMedia.description) && selectedMedia.type !== "audio" && /* @__PURE__ */ jsxs4("div", { className: "absolute bottom-4 left-4 text-white z-10", children: [
                selectedMedia.title && /* @__PURE__ */ jsx4("h3", { className: "text-xl font-bold mb-2", children: selectedMedia.title }),
                selectedMedia.description && /* @__PURE__ */ jsx4("p", { className: "text-gray-300", children: selectedMedia.description })
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}
export {
  Carousel,
  ImageGallery,
  MediaGrid,
  VideoGallery
};
//# sourceMappingURL=index.js.map