"use client";
var __defProp = Object.defineProperty;
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

// src/useReducedMotion.ts
import React, { useCallback, useEffect, useRef, useState } from "react";
function useReducedMotion(options = {}) {
  const {
    forceReduced = false,
    onPreferenceChange,
    fallback = false
  } = options;
  const [state, setState] = useState({
    reducedMotion: fallback,
    isSupported: false,
    preference: "unknown"
  });
  const callbackRef = useRef(onPreferenceChange);
  callbackRef.current = onPreferenceChange;
  const updatePreference = useCallback(
    (matches) => {
      const newState = {
        reducedMotion: forceReduced || matches,
        isSupported: true,
        preference: matches ? "reduce" : "no-preference"
      };
      setState((prevState) => {
        var _a;
        if (prevState.reducedMotion !== newState.reducedMotion) {
          (_a = callbackRef.current) == null ? void 0 : _a.call(callbackRef, newState.reducedMotion);
        }
        return newState;
      });
    },
    [forceReduced]
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    updatePreference(mediaQuery.matches);
    const handleChange = (event) => {
      updatePreference(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [updatePreference]);
  return state;
}
function useSafeDuration(duration, reducedDuration = 0) {
  const { reducedMotion } = useReducedMotion();
  return reducedMotion ? reducedDuration : duration;
}
function useSafeAnimation(normalValue, reducedValue) {
  const { reducedMotion } = useReducedMotion();
  return reducedMotion ? reducedValue : normalValue;
}
function withReducedMotion(normalAnimation, reducedAnimation) {
  return (reducedMotion) => {
    if (reducedMotion) {
      return __spreadValues(__spreadValues({}, normalAnimation), reducedAnimation);
    }
    return normalAnimation;
  };
}
function isReducedMotionPreferred() {
  if (typeof window === "undefined") return false;
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mediaQuery.matches;
}
function ReducedMotionWrapper({
  children,
  fallback = null,
  className
}) {
  const { reducedMotion } = useReducedMotion();
  if (reducedMotion && fallback) {
    return React.createElement("div", { className }, fallback);
  }
  return React.createElement("div", { className }, children);
}

// src/useFrameControl.ts
import { useCallback as useCallback2, useEffect as useEffect2, useRef as useRef2, useState as useState2 } from "react";
function useFrameControl(options = {}) {
  const {
    targetFPS = 60,
    adaptive = true,
    minFPS = 15,
    maxFPS = 120,
    onFPSChange
  } = options;
  const [stats, setStats] = useState2({
    currentFPS: 0,
    averageFPS: 0,
    frameTime: 0,
    dropped: 0,
    total: 0
  });
  const frameRef = useRef2(void 0);
  const lastTimeRef = useRef2(0);
  const frameTimesRef = useRef2([]);
  const targetFrameTimeRef = useRef2(1e3 / targetFPS);
  const callbacksRef = useRef2(/* @__PURE__ */ new Set());
  const calculateFPS = useCallback2((frameTime) => {
    frameTimesRef.current.push(frameTime);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }
    const currentFPS = 1e3 / frameTime;
    const averageFPS = frameTimesRef.current.length > 0 ? 1e3 / (frameTimesRef.current.reduce((a, b) => a + b) / frameTimesRef.current.length) : 0;
    return { currentFPS, averageFPS };
  }, []);
  const animate = useCallback2(
    (timestamp) => {
      const deltaTime = timestamp - lastTimeRef.current;
      if (deltaTime >= targetFrameTimeRef.current) {
        const { currentFPS, averageFPS } = calculateFPS(deltaTime);
        setStats((prev) => ({
          currentFPS,
          averageFPS,
          frameTime: deltaTime,
          dropped: deltaTime > targetFrameTimeRef.current * 1.5 ? prev.dropped + 1 : prev.dropped,
          total: prev.total + 1
        }));
        callbacksRef.current.forEach((callback) => {
          try {
            callback(deltaTime);
          } catch (error) {
            console.warn("Frame callback error:", error);
          }
        });
        lastTimeRef.current = timestamp;
        if (adaptive) {
          if (currentFPS < targetFPS * 0.8 && targetFrameTimeRef.current < 1e3 / minFPS) {
            targetFrameTimeRef.current = Math.min(
              targetFrameTimeRef.current * 1.1,
              1e3 / minFPS
            );
            onFPSChange == null ? void 0 : onFPSChange(1e3 / targetFrameTimeRef.current);
          } else if (currentFPS > targetFPS * 1.1 && targetFrameTimeRef.current > 1e3 / maxFPS) {
            targetFrameTimeRef.current = Math.max(
              targetFrameTimeRef.current * 0.9,
              1e3 / maxFPS
            );
            onFPSChange == null ? void 0 : onFPSChange(1e3 / targetFrameTimeRef.current);
          }
        }
      }
      frameRef.current = requestAnimationFrame(animate);
    },
    [calculateFPS, targetFPS, adaptive, minFPS, maxFPS, onFPSChange]
  );
  const start = useCallback2(() => {
    if (frameRef.current) return;
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(animate);
  }, [animate]);
  const stop = useCallback2(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = void 0;
    }
  }, []);
  const reset = useCallback2(() => {
    stop();
    frameTimesRef.current = [];
    setStats({
      currentFPS: 0,
      averageFPS: 0,
      frameTime: 0,
      dropped: 0,
      total: 0
    });
  }, [stop]);
  const addCallback = useCallback2((callback) => {
    callbacksRef.current.add(callback);
    return () => {
      callbacksRef.current.delete(callback);
    };
  }, []);
  const setTargetFPS = useCallback2(
    (fps) => {
      targetFrameTimeRef.current = 1e3 / Math.max(minFPS, Math.min(maxFPS, fps));
    },
    [minFPS, maxFPS]
  );
  useEffect2(() => {
    return () => stop();
  }, [stop]);
  return {
    stats,
    start,
    stop,
    reset,
    addCallback,
    setTargetFPS,
    isRunning: !!frameRef.current
  };
}
function useThrottledFrame(callback, fps = 30) {
  const callbackRef = useRef2(callback);
  const lastTimeRef = useRef2(0);
  const frameRef = useRef2(void 0);
  callbackRef.current = callback;
  const throttledCallback = useCallback2(
    (timestamp) => {
      const targetFrameTime = 1e3 / fps;
      const deltaTime = timestamp - lastTimeRef.current;
      if (deltaTime >= targetFrameTime) {
        callbackRef.current(deltaTime);
        lastTimeRef.current = timestamp;
      }
      frameRef.current = requestAnimationFrame(throttledCallback);
    },
    [fps]
  );
  const start = useCallback2(() => {
    if (frameRef.current) return;
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(throttledCallback);
  }, [throttledCallback]);
  const stop = useCallback2(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = void 0;
    }
  }, []);
  useEffect2(() => {
    return () => stop();
  }, [stop]);
  return { start, stop, isRunning: !!frameRef.current };
}

// src/useOptimization.ts
import { useCallback as useCallback3, useMemo, useRef as useRef3 } from "react";
function usePerformanceMonitor(options = {}) {
  const {
    trackMemory = true,
    trackRenderTime = true,
    trackFrameRate = true,
    sampleRate = 0.1,
    maxSamples = 100
  } = options;
  const metricsRef = useRef3([]);
  const lastFrameTimeRef = useRef3(0);
  const renderStartRef = useRef3(0);
  const shouldSample = useCallback3(() => {
    return Math.random() < sampleRate;
  }, [sampleRate]);
  const startRenderTracking = useCallback3(() => {
    if (trackRenderTime && shouldSample()) {
      renderStartRef.current = performance.now();
    }
  }, [trackRenderTime, shouldSample]);
  const endRenderTracking = useCallback3(() => {
    if (!trackRenderTime || renderStartRef.current === 0) return;
    const renderTime = performance.now() - renderStartRef.current;
    renderStartRef.current = 0;
    const metrics = {
      renderTime,
      memoryUsage: trackMemory ? getMemoryUsage() : 0,
      frameRate: trackFrameRate ? calculateFrameRate() : 0,
      timestamp: Date.now()
    };
    metricsRef.current.push(metrics);
    if (metricsRef.current.length > maxSamples) {
      metricsRef.current.shift();
    }
    return metrics;
  }, [trackRenderTime, trackMemory, trackFrameRate, maxSamples]);
  const getMemoryUsage = useCallback3(() => {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = performance.memory;
      return memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }, []);
  const calculateFrameRate = useCallback3(() => {
    const now = performance.now();
    if (lastFrameTimeRef.current === 0) {
      lastFrameTimeRef.current = now;
      return 0;
    }
    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;
    return frameTime > 0 ? 1e3 / frameTime : 0;
  }, []);
  const getAverageMetrics = useCallback3(() => {
    if (metricsRef.current.length === 0) return null;
    const totals = metricsRef.current.reduce(
      (acc, metric) => ({
        renderTime: acc.renderTime + metric.renderTime,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
        frameRate: acc.frameRate + metric.frameRate
      }),
      { renderTime: 0, memoryUsage: 0, frameRate: 0 }
    );
    const count = metricsRef.current.length;
    return {
      renderTime: totals.renderTime / count,
      memoryUsage: totals.memoryUsage / count,
      frameRate: totals.frameRate / count,
      sampleCount: count
    };
  }, []);
  const clearMetrics = useCallback3(() => {
    metricsRef.current = [];
  }, []);
  const getLatestMetrics = useCallback3(() => {
    return metricsRef.current[metricsRef.current.length - 1] || null;
  }, []);
  return {
    startRenderTracking,
    endRenderTracking,
    getAverageMetrics,
    getLatestMetrics,
    clearMetrics,
    metrics: metricsRef.current,
    getMemoryUsage
  };
}
function useOptimizedMemo(factory, deps, debugLabel) {
  const startTime = useRef3(0);
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
function useOptimizedCallback(callback, delay = 16, deps = []) {
  const timeoutRef = useRef3(void 0);
  const callbackRef = useRef3(callback);
  callbackRef.current = callback;
  const debouncedCallback = useCallback3(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay, ...deps]
  );
  return debouncedCallback;
}
function useOptimizedIntersection(threshold = 0.1, rootMargin = "0px") {
  const observerRef = useRef3(void 0);
  const elementsRef = useRef3(
    /* @__PURE__ */ new Map()
  );
  const observe = useCallback3(
    (element, callback) => {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const callback2 = elementsRef.current.get(entry.target);
              if (callback2) {
                callback2(entry.isIntersecting);
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
  const disconnect = useCallback3(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      elementsRef.current.clear();
    }
  }, []);
  return { observe, disconnect };
}
export {
  ReducedMotionWrapper,
  isReducedMotionPreferred,
  useFrameControl,
  useOptimizedCallback,
  useOptimizedIntersection,
  useOptimizedMemo,
  usePerformanceMonitor,
  useReducedMotion,
  useSafeAnimation,
  useSafeDuration,
  useThrottledFrame,
  withReducedMotion
};
