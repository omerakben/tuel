"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

export interface MouseTrackingOptions {
  /** Enable smooth interpolation between mouse positions */
  smooth?: boolean;
  /** Smoothing factor (0-1, higher = smoother but more lag) */
  smoothFactor?: number;
  /** Threshold distance for movement detection */
  threshold?: number;
  /** Enable velocity tracking */
  trackVelocity?: boolean;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface MouseTracking {
  /** Current mouse position */
  position: MousePosition;
  /** Previous mouse position */
  previousPosition: MousePosition;
  /** Interpolated/smooth position */
  smoothPosition: MousePosition;
  /** Mouse velocity */
  velocity: MousePosition;
  /** Distance moved since last frame */
  distance: number;
  /** Whether mouse is moving */
  isMoving: boolean;
}

/**
 * Advanced mouse tracking hook with smooth interpolation and velocity
 * Based on Motion.dev patterns for high-performance cursor interactions
 */
export function useMouseTracking(
  options: MouseTrackingOptions = {}
): MouseTracking {
  const {
    smooth = true,
    smoothFactor = 0.1,
    threshold = 1,
    trackVelocity = true,
  } = options;

  // Motion values for smooth animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-based smooth position
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 400 });

  // Tracking state
  const positionRef = useRef<MousePosition>({ x: 0, y: 0 });
  const previousPositionRef = useRef<MousePosition>({ x: 0, y: 0 });
  const velocityRef = useRef<MousePosition>({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(0);
  const isMovingRef = useRef<boolean>(false);

  // Calculate distance between two points
  const calculateDistance = useCallback(
    (p1: MousePosition, p2: MousePosition): number => {
      return Math.hypot(p2.x - p1.x, p2.y - p1.y);
    },
    []
  );

  // Update mouse position
  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;

      // Store previous position
      previousPositionRef.current = { ...positionRef.current };

      // Update current position
      positionRef.current = { x: clientX, y: clientY };

      // Update motion values
      mouseX.set(clientX);
      mouseY.set(clientY);

      // Calculate velocity if enabled and enough time has passed
      if (trackVelocity && deltaTime > 0) {
        const deltaX = clientX - previousPositionRef.current.x;
        const deltaY = clientY - previousPositionRef.current.y;

        velocityRef.current = {
          x: deltaX / deltaTime,
          y: deltaY / deltaTime,
        };
      }

      // Check if mouse is moving based on threshold
      const distance = calculateDistance(
        previousPositionRef.current,
        positionRef.current
      );
      isMovingRef.current = distance > threshold;

      lastTimeRef.current = now;
    },
    [mouseX, mouseY, trackVelocity, threshold, calculateDistance]
  );

  // Mouse move handler
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    },
    [updatePosition]
  );

  // Set up event listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  // Return tracking data
  return {
    position: positionRef.current,
    previousPosition: previousPositionRef.current,
    smoothPosition: {
      x: smoothX.get(),
      y: smoothY.get(),
    },
    velocity: velocityRef.current,
    distance: calculateDistance(
      previousPositionRef.current,
      positionRef.current
    ),
    isMoving: isMovingRef.current,
  };
}
