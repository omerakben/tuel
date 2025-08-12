"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useCallback, useRef } from "react";

export interface TrailImageOptions {
  /** Images to use in the trail */
  images: string[];
  /** Lifespan of each trail image in milliseconds */
  imageLifespan?: number;
  /** Mouse movement threshold to trigger new trail image */
  mouseThreshold?: number;
  /** Animation duration for image entrance */
  inDuration?: number;
  /** Animation duration for image exit */
  outDuration?: number;
  /** Stagger delay for entrance animation */
  staggerIn?: number;
  /** Stagger delay for exit animation */
  staggerOut?: number;
  /** Slide animation duration */
  slideDuration?: number;
  /** Custom easing function */
  easing?: string;
  /** Number of mask layers for reveal effect */
  maskLayers?: number;
}

export interface TrailImageComponent {
  element: HTMLDivElement;
  removeTime: number;
  maskLayers: HTMLDivElement[];
  imageLayers: HTMLDivElement[];
}

/**
 * Advanced image trail effect component
 * Creates trailing images that follow mouse movement with sophisticated animations
 * Based on the TrailContainer pattern from CodeGrid projects
 */
export function useImageTrail(options: TrailImageOptions) {
  const {
    images = [],
    imageLifespan = 1000,
    mouseThreshold = 150,
    inDuration = 750,
    outDuration = 1000,
    staggerIn = 100,
    staggerOut = 25,
    slideDuration = 1000,
    easing = "cubic-bezier(0.87, 0, 0.13, 1)",
    maskLayers = 10,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<TrailImageComponent[]>([]);
  const currentImageIndexRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Motion values for smooth mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 400 });

  // Previous mouse position for distance calculation
  const previousMouse = useRef({ x: 0, y: 0 });

  const calculateDistance = useCallback(
    (x1: number, y1: number, x2: number, y2: number): number => {
      return Math.hypot(x2 - x1, y2 - y1);
    },
    []
  );

  const isInContainer = useCallback((x: number, y: number): boolean => {
    if (!containerRef.current) return false;
    const rect = containerRef.current.getBoundingClientRect();
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  }, []);

  const createTrailImage = useCallback(() => {
    if (!containerRef.current || images.length === 0) return;

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("trail-img");
    imgContainer.style.cssText = `
      position: absolute;
      width: 175px;
      height: 175px;
      pointer-events: none;
      z-index: 10;
    `;

    const imgSrc = images[currentImageIndexRef.current];
    currentImageIndexRef.current =
      (currentImageIndexRef.current + 1) % images.length;

    const rect = containerRef.current.getBoundingClientRect();
    const startX = smoothX.get() - rect.left - 87.5;
    const startY = smoothY.get() - rect.top - 87.5;
    const targetX = mouseX.get() - rect.left - 87.5;
    const targetY = mouseY.get() - rect.top - 87.5;

    imgContainer.style.left = `${startX}px`;
    imgContainer.style.top = `${startY}px`;
    imgContainer.style.transition = `left ${slideDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), top ${slideDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

    const layers: HTMLDivElement[] = [];
    const imageLayers: HTMLDivElement[] = [];

    // Create mask layers for sophisticated reveal animation
    for (let i = 0; i < maskLayers; i++) {
      const layer = document.createElement("div");
      layer.classList.add("mask-layer");
      layer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transform: translateZ(0);
        backface-visibility: hidden;
      `;

      const imageLayer = document.createElement("div");
      imageLayer.classList.add("image-layer");
      imageLayer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(${imgSrc});
        background-size: cover;
        background-position: center;
      `;

      const startY = i * (100 / maskLayers);
      const endY = (i + 1) * (100 / maskLayers);

      layer.style.clipPath = `polygon(50% ${startY}%, 50% ${startY}%, 50% ${endY}%, 50% ${endY}%)`;
      layer.style.transition = `clip-path ${inDuration}ms ${easing}`;

      layer.appendChild(imageLayer);
      imgContainer.appendChild(layer);
      layers.push(layer);
      imageLayers.push(imageLayer);
    }

    containerRef.current.appendChild(imgContainer);

    // Animate to target position and reveal
    requestAnimationFrame(() => {
      imgContainer.style.left = `${targetX}px`;
      imgContainer.style.top = `${targetY}px`;

      layers.forEach((layer, i) => {
        const startY = i * (100 / maskLayers);
        const endY = (i + 1) * (100 / maskLayers);
        const distanceFromMiddle = Math.abs(i - (maskLayers - 1) / 2);
        const delay = distanceFromMiddle * staggerIn;

        setTimeout(() => {
          layer.style.clipPath = `polygon(0% ${startY}%, 100% ${startY}%, 100% ${endY}%, 0% ${endY}%)`;
        }, delay);
      });
    });

    trailRef.current.push({
      element: imgContainer,
      maskLayers: layers,
      imageLayers,
      removeTime: Date.now() + imageLifespan,
    });
  }, [
    images,
    smoothX,
    smoothY,
    mouseX,
    mouseY,
    slideDuration,
    maskLayers,
    inDuration,
    easing,
    staggerIn,
    imageLifespan,
  ]);

  const removeOldImages = useCallback(() => {
    const now = Date.now();

    while (
      trailRef.current.length > 0 &&
      now >= trailRef.current[0].removeTime
    ) {
      const imgToRemove = trailRef.current.shift()!;

      // Animate out with staggered mask animation
      imgToRemove.maskLayers.forEach((layer, i) => {
        const startY = i * (100 / maskLayers);
        const endY = (i + 1) * (100 / maskLayers);
        const distanceFromEdge =
          (maskLayers - 1) / 2 - Math.abs(i - (maskLayers - 1) / 2);
        const delay = distanceFromEdge * staggerOut;

        layer.style.transition = `clip-path ${outDuration}ms ${easing}`;

        setTimeout(() => {
          layer.style.clipPath = `polygon(50% ${startY}%, 50% ${startY}%, 50% ${endY}%, 50% ${endY}%)`;
        }, delay);
      });

      // Fade out image layers
      imgToRemove.imageLayers.forEach((imageLayer) => {
        imageLayer.style.transition = `opacity ${outDuration}ms ${easing}`;
        imageLayer.style.opacity = "0.25";
      });

      // Remove element after animation
      setTimeout(() => {
        if (imgToRemove.element.parentNode) {
          imgToRemove.element.parentNode.removeChild(imgToRemove.element);
        }
      }, outDuration + 112);
    }
  }, [maskLayers, staggerOut, outDuration, easing]);

  const animate = useCallback(() => {
    const currentX = mouseX.get();
    const currentY = mouseY.get();
    const distance = calculateDistance(
      currentX,
      currentY,
      previousMouse.current.x,
      previousMouse.current.y
    );

    if (distance > mouseThreshold && isInContainer(currentX, currentY)) {
      createTrailImage();
      previousMouse.current = { x: currentX, y: currentY };
    }

    removeOldImages();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [
    mouseX,
    mouseY,
    calculateDistance,
    mouseThreshold,
    isInContainer,
    createTrailImage,
    removeOldImages,
  ]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    },
    [mouseX, mouseY]
  );

  const startAnimation = useCallback(() => {
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [handleMouseMove, animate]);

  const stopAnimation = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Clean up trail images
    trailRef.current.forEach((item) => {
      if (item.element.parentNode) {
        item.element.parentNode.removeChild(item.element);
      }
    });
    trailRef.current.length = 0;
  }, [handleMouseMove]);

  return {
    containerRef,
    startAnimation,
    stopAnimation,
    trailCount: trailRef.current.length,
  };
}
