"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface FrameControlOptions {
  /** Target FPS (frames per second) */
  targetFPS?: number;
  /** Enable adaptive FPS based on performance */
  adaptive?: boolean;
  /** Minimum FPS when adaptive */
  minFPS?: number;
  /** Maximum FPS when adaptive */
  maxFPS?: number;
  /** Callback when FPS changes */
  onFPSChange?: (fps: number) => void;
}

export interface FrameStats {
  currentFPS: number;
  averageFPS: number;
  frameTime: number;
  dropped: number;
  total: number;
}

/**
 * Advanced frame control and monitoring hook
 * Provides precise animation frame timing and performance monitoring
 */
export function useFrameControl(options: FrameControlOptions = {}) {
  const {
    targetFPS = 60,
    adaptive = true,
    minFPS = 15,
    maxFPS = 120,
    onFPSChange,
  } = options;

  const [stats, setStats] = useState<FrameStats>({
    currentFPS: 0,
    averageFPS: 0,
    frameTime: 0,
    dropped: 0,
    total: 0,
  });

  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const frameTimesRef = useRef<number[]>([]);
  const targetFrameTimeRef = useRef<number>(1000 / targetFPS);
  const callbacksRef = useRef<Set<(deltaTime: number) => void>>(new Set());

  const calculateFPS = useCallback((frameTime: number) => {
    frameTimesRef.current.push(frameTime);

    // Keep only last 60 frames for average calculation
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }

    const currentFPS = 1000 / frameTime;
    const averageFPS =
      frameTimesRef.current.length > 0
        ? 1000 /
          (frameTimesRef.current.reduce((a, b) => a + b) /
            frameTimesRef.current.length)
        : 0;

    return { currentFPS, averageFPS };
  }, []);

  const animate = useCallback(
    (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;

      if (deltaTime >= targetFrameTimeRef.current) {
        const { currentFPS, averageFPS } = calculateFPS(deltaTime);

        setStats((prev) => ({
          currentFPS,
          averageFPS,
          frameTime: deltaTime,
          dropped:
            deltaTime > targetFrameTimeRef.current * 1.5
              ? prev.dropped + 1
              : prev.dropped,
          total: prev.total + 1,
        }));

        // Execute registered callbacks
        callbacksRef.current.forEach((callback) => {
          try {
            callback(deltaTime);
          } catch (error) {
            console.warn("Frame callback error:", error);
          }
        });

        lastTimeRef.current = timestamp;

        // Adaptive FPS adjustment
        if (adaptive) {
          if (
            currentFPS < targetFPS * 0.8 &&
            targetFrameTimeRef.current < 1000 / minFPS
          ) {
            targetFrameTimeRef.current = Math.min(
              targetFrameTimeRef.current * 1.1,
              1000 / minFPS
            );
            onFPSChange?.(1000 / targetFrameTimeRef.current);
          } else if (
            currentFPS > targetFPS * 1.1 &&
            targetFrameTimeRef.current > 1000 / maxFPS
          ) {
            targetFrameTimeRef.current = Math.max(
              targetFrameTimeRef.current * 0.9,
              1000 / maxFPS
            );
            onFPSChange?.(1000 / targetFrameTimeRef.current);
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    },
    [calculateFPS, targetFPS, adaptive, minFPS, maxFPS, onFPSChange]
  );

  const start = useCallback(() => {
    if (frameRef.current) return;

    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stop = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    frameTimesRef.current = [];
    setStats({
      currentFPS: 0,
      averageFPS: 0,
      frameTime: 0,
      dropped: 0,
      total: 0,
    });
  }, [stop]);

  const addCallback = useCallback((callback: (deltaTime: number) => void) => {
    callbacksRef.current.add(callback);

    return () => {
      callbacksRef.current.delete(callback);
    };
  }, []);

  const setTargetFPS = useCallback(
    (fps: number) => {
      targetFrameTimeRef.current =
        1000 / Math.max(minFPS, Math.min(maxFPS, fps));
    },
    [minFPS, maxFPS]
  );

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    stats,
    start,
    stop,
    reset,
    addCallback,
    setTargetFPS,
    isRunning: !!frameRef.current,
  };
}

/**
 * Hook for throttled animation frames
 */
export function useThrottledFrame(
  callback: (deltaTime: number) => void,
  fps: number = 30
) {
  const callbackRef = useRef(callback);
  const lastTimeRef = useRef<number>(0);
  const frameRef = useRef<number | undefined>(undefined);

  callbackRef.current = callback;

  const throttledCallback = useCallback(
    (timestamp: number) => {
      const targetFrameTime = 1000 / fps;
      const deltaTime = timestamp - lastTimeRef.current;

      if (deltaTime >= targetFrameTime) {
        callbackRef.current(deltaTime);
        lastTimeRef.current = timestamp;
      }

      frameRef.current = requestAnimationFrame(throttledCallback);
    },
    [fps]
  );

  const start = useCallback(() => {
    if (frameRef.current) return;
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(throttledCallback);
  }, [throttledCallback]);

  const stop = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { start, stop, isRunning: !!frameRef.current };
}
