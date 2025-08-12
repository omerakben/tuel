"use client";

import { useCallback, useMemo, useRef } from "react";

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  timestamp: number;
}

export interface OptimizationOptions {
  /** Enable memory monitoring */
  trackMemory?: boolean;
  /** Enable render time tracking */
  trackRenderTime?: boolean;
  /** Enable frame rate monitoring */
  trackFrameRate?: boolean;
  /** Sample rate for metrics collection (0-1) */
  sampleRate?: number;
  /** Maximum number of metrics to store */
  maxSamples?: number;
}

/**
 * Performance monitoring and optimization utilities
 */
export function usePerformanceMonitor(options: OptimizationOptions = {}) {
  const {
    trackMemory = true,
    trackRenderTime = true,
    trackFrameRate = true,
    sampleRate = 0.1,
    maxSamples = 100,
  } = options;

  const metricsRef = useRef<PerformanceMetrics[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);

  const shouldSample = useCallback(() => {
    return Math.random() < sampleRate;
  }, [sampleRate]);

  const startRenderTracking = useCallback(() => {
    if (trackRenderTime && shouldSample()) {
      renderStartRef.current = performance.now();
    }
  }, [trackRenderTime, shouldSample]);

  const endRenderTracking = useCallback(() => {
    if (!trackRenderTime || renderStartRef.current === 0) return;

    const renderTime = performance.now() - renderStartRef.current;
    renderStartRef.current = 0;

    const metrics: PerformanceMetrics = {
      renderTime,
      memoryUsage: trackMemory ? getMemoryUsage() : 0,
      frameRate: trackFrameRate ? calculateFrameRate() : 0,
      timestamp: Date.now(),
    };

    metricsRef.current.push(metrics);

    // Keep only the latest samples
    if (metricsRef.current.length > maxSamples) {
      metricsRef.current.shift();
    }

    return metrics;
  }, [trackRenderTime, trackMemory, trackFrameRate, maxSamples]);

  const getMemoryUsage = useCallback((): number => {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }, []);

  const calculateFrameRate = useCallback((): number => {
    const now = performance.now();
    if (lastFrameTimeRef.current === 0) {
      lastFrameTimeRef.current = now;
      return 0;
    }

    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;
    return frameTime > 0 ? 1000 / frameTime : 0;
  }, []);

  const getAverageMetrics = useCallback(() => {
    if (metricsRef.current.length === 0) return null;

    const totals = metricsRef.current.reduce(
      (acc, metric) => ({
        renderTime: acc.renderTime + metric.renderTime,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
        frameRate: acc.frameRate + metric.frameRate,
      }),
      { renderTime: 0, memoryUsage: 0, frameRate: 0 }
    );

    const count = metricsRef.current.length;
    return {
      renderTime: totals.renderTime / count,
      memoryUsage: totals.memoryUsage / count,
      frameRate: totals.frameRate / count,
      sampleCount: count,
    };
  }, []);

  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
  }, []);

  const getLatestMetrics = useCallback(() => {
    return metricsRef.current[metricsRef.current.length - 1] || null;
  }, []);

  return {
    startRenderTracking,
    endRenderTracking,
    getAverageMetrics,
    getLatestMetrics,
    clearMetrics,
    metrics: metricsRef.current,
    getMemoryUsage,
  };
}

/**
 * Memoization helper with performance tracking
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  debugLabel?: string
): T {
  const startTime = useRef<number>(0);

  const result = useMemo(() => {
    startTime.current = performance.now();
    const computed = factory();
    const duration = performance.now() - startTime.current;

    if (debugLabel && duration > 10) {
      console.warn(
        `Slow memo computation: ${debugLabel} took ${duration.toFixed(2)}ms`
      );
    }

    return computed;
  }, deps);

  return result;
}

/**
 * Debounced callback with performance optimization
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 16,
  deps: React.DependencyList = []
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay, ...deps]
  ) as T;

  return debouncedCallback;
}

/**
 * Intersection observer with performance optimization
 */
export function useOptimizedIntersection(
  threshold: number = 0.1,
  rootMargin: string = "0px"
) {
  const observerRef = useRef<IntersectionObserver | undefined>(undefined);
  const elementsRef = useRef<Map<Element, (isIntersecting: boolean) => void>>(
    new Map()
  );

  const observe = useCallback(
    (element: Element, callback: (isIntersecting: boolean) => void) => {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const callback = elementsRef.current.get(entry.target);
              if (callback) {
                callback(entry.isIntersecting);
              }
            });
          },
          { threshold, rootMargin }
        );
      }

      elementsRef.current.set(element, callback);
      observerRef.current.observe(element);

      return () => {
        if (observerRef.current) {
          observerRef.current.unobserve(element);
          elementsRef.current.delete(element);
        }
      };
    },
    [threshold, rootMargin]
  );

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      elementsRef.current.clear();
    }
  }, []);

  return { observe, disconnect };
}
