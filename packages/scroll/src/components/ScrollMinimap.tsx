"use client";

import { cn } from "@tuel/utils";
import { useEffect, useRef, useState } from "react";

export interface ScrollMinimapProps {
  images: string[];
  activeOpacity?: number;
  lerpFactor?: number;
  clickLerpFactor?: number;
  breakpoint?: number;
  className?: string;
  onImageChange?: (index: number) => void;
}

interface Dimensions {
  itemSize: number;
  containerSize: number;
  indicatorSize: number;
}

interface TranslateRef {
  current: number;
  target: number;
  max: number;
}

export function ScrollMinimap({
  images,
  activeOpacity = 0.3,
  lerpFactor = 0.075,
  clickLerpFactor = 0.05,
  breakpoint = 900,
  className,
  onImageChange,
}: ScrollMinimapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const translateRef = useRef<TranslateRef>({
    current: 0,
    target: 0,
    max: 0,
  });

  const [isHorizontal, setIsHorizontal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dimensionsRef = useRef<Dimensions>({
    itemSize: 0,
    containerSize: 0,
    indicatorSize: 0,
  });

  const isClickMoveRef = useRef(false);

  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  };

  const updateDimensions = () => {
    const newIsHorizontal = window.innerWidth <= breakpoint;
    const firstItem = itemRefs.current[0];

    if (!firstItem) return;

    const newDimensions: Dimensions = {
      itemSize: newIsHorizontal
        ? firstItem.getBoundingClientRect().width
        : firstItem.getBoundingClientRect().height,
      containerSize: newIsHorizontal
        ? itemsRef.current?.scrollWidth || 0
        : itemsRef.current?.getBoundingClientRect().height || 0,
      indicatorSize: newIsHorizontal
        ? indicatorRef.current?.getBoundingClientRect().width || 0
        : indicatorRef.current?.getBoundingClientRect().height || 0,
    };

    dimensionsRef.current = newDimensions;
    translateRef.current.max =
      newDimensions.containerSize - newDimensions.indicatorSize;

    if (isHorizontal !== newIsHorizontal) {
      setIsHorizontal(newIsHorizontal);
    }
  };

  const getItemInIndicator = (): number => {
    itemRefs.current.forEach((item) => {
      const img = item?.querySelector("img") as HTMLImageElement;
      if (img) {
        img.style.opacity = "1";
      }
    });

    const indicatorStart = -translateRef.current.current;
    const indicatorEnd = indicatorStart + dimensionsRef.current.indicatorSize;

    let maxOverlap = 0;
    let selectedIndex = 0;

    itemRefs.current.forEach((item, index) => {
      const itemStart = index * dimensionsRef.current.itemSize;
      const itemEnd = itemStart + dimensionsRef.current.itemSize;

      const overlapStart = Math.max(indicatorStart, itemStart);
      const overlapEnd = Math.min(indicatorEnd, itemEnd);
      const overlap = Math.max(0, overlapEnd - overlapStart);

      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        selectedIndex = index;
      }
    });

    const selectedImg = itemRefs.current[selectedIndex]?.querySelector(
      "img"
    ) as HTMLImageElement;
    if (selectedImg) {
      selectedImg.style.opacity = activeOpacity.toString();
    }
    return selectedIndex;
  };

  const updatePreviewImage = (index: number) => {
    if (currentImageIndex !== index) {
      setCurrentImageIndex(index);
      if (previewImageRef.current) {
        previewImageRef.current.src = images[index];
      }
      onImageChange?.(index);
    }
  };

  const animate = () => {
    const currentLerpFactor = isClickMoveRef.current
      ? clickLerpFactor
      : lerpFactor;
    translateRef.current.current = lerp(
      translateRef.current.current,
      translateRef.current.target,
      currentLerpFactor
    );

    if (
      Math.abs(translateRef.current.current - translateRef.current.target) >
      0.01
    ) {
      const transform = isHorizontal
        ? `translateX(${translateRef.current.current}px)`
        : `translateY(${translateRef.current.current}px)`;

      if (itemsRef.current) {
        itemsRef.current.style.transform = transform;
      }

      const activeIndex = getItemInIndicator();
      updatePreviewImage(activeIndex);
    } else {
      isClickMoveRef.current = false;
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      isClickMoveRef.current = false;

      const delta = e.deltaY;
      const scrollVelocity = Math.min(Math.max(delta * 0.5, -20), 20);

      translateRef.current.target = Math.min(
        Math.max(
          translateRef.current.target - scrollVelocity,
          -translateRef.current.max
        ),
        0
      );
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (isHorizontal) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isHorizontal) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;

        const scrollVelocity = Math.min(Math.max(deltaY * 0.5, -20), 20);

        translateRef.current.target = Math.min(
          Math.max(
            translateRef.current.target - scrollVelocity,
            -translateRef.current.max
          ),
          0
        );

        touchStartY = touchY;
        e.preventDefault();
      }
    };

    const handleResize = () => {
      updateDimensions();

      translateRef.current.target = Math.min(
        Math.max(translateRef.current.target, -translateRef.current.max),
        0
      );
      translateRef.current.current = translateRef.current.target;

      const transform = isHorizontal
        ? `translateX(${translateRef.current.current}px)`
        : `translateY(${translateRef.current.current}px)`;

      if (itemsRef.current) {
        itemsRef.current.style.transform = transform;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    window.addEventListener("resize", handleResize);

    updateDimensions();
    const firstImg = itemRefs.current[0]?.querySelector(
      "img"
    ) as HTMLImageElement;
    if (firstImg) {
      firstImg.style.opacity = activeOpacity.toString();
    }
    updatePreviewImage(0);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isHorizontal,
    activeOpacity,
    lerpFactor,
    clickLerpFactor,
    breakpoint,
    onImageChange,
  ]);

  const handleItemClick = (index: number) => {
    isClickMoveRef.current = true;
    const newTranslate =
      -index * dimensionsRef.current.itemSize +
      (dimensionsRef.current.indicatorSize - dimensionsRef.current.itemSize) /
        2;

    translateRef.current.target = Math.max(
      Math.min(newTranslate, 0),
      -translateRef.current.max
    );
  };

  return (
    <div
      className={cn("scroll-minimap-container", className)}
      ref={containerRef}
    >
      <div className="minimap" style={{ position: "relative" }}>
        <div
          className="indicator"
          ref={indicatorRef}
          style={{
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
        <div
          className="items"
          ref={itemsRef}
          style={{
            display: "flex",
            flexDirection: isHorizontal ? "row" : "column",
          }}
        >
          {images.map((src, index) => (
            <div
              key={src}
              className="item"
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onClick={() => handleItemClick(index)}
              style={{
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <img
                src={src}
                alt={`Minimap item ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 0.3s ease",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="img-preview" style={{ position: "fixed" }}>
        <img
          ref={previewImageRef}
          src={images[0]}
          alt="Preview"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}
