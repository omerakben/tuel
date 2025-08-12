"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ReducedMotionWrapper: () => ReducedMotionWrapper,
  isReducedMotionPreferred: () => isReducedMotionPreferred,
  useFrameControl: () => useFrameControl,
  useOptimizedCallback: () => useOptimizedCallback,
  useOptimizedIntersection: () => useOptimizedIntersection,
  useOptimizedMemo: () => useOptimizedMemo,
  usePerformanceMonitor: () => usePerformanceMonitor,
  useReducedMotion: () => useReducedMotion,
  useSafeAnimation: () => useSafeAnimation,
  useSafeDuration: () => useSafeDuration,
  useThrottledFrame: () => useThrottledFrame,
  withReducedMotion: () => withReducedMotion
});
module.exports = __toCommonJS(index_exports);

// src/useReducedMotion.ts
var import_react = __toESM(require("react"));
function useReducedMotion(options = {}) {
  const {
    forceReduced = false,
    onPreferenceChange,
    fallback = false
  } = options;
  const [state, setState] = (0, import_react.useState)({
    reducedMotion: fallback,
    isSupported: false,
    preference: "unknown"
  });
  const callbackRef = (0, import_react.useRef)(onPreferenceChange);
  callbackRef.current = onPreferenceChange;
  const updatePreference = (0, import_react.useCallback)(
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
  (0, import_react.useEffect)(() => {
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
    return import_react.default.createElement("div", { className }, fallback);
  }
  return import_react.default.createElement("div", { className }, children);
}

// src/useFrameControl.ts
var import_react2 = require("react");
function useFrameControl(options = {}) {
  const {
    targetFPS = 60,
    adaptive = true,
    minFPS = 15,
    maxFPS = 120,
    onFPSChange
  } = options;
  const [stats, setStats] = (0, import_react2.useState)({
    currentFPS: 0,
    averageFPS: 0,
    frameTime: 0,
    dropped: 0,
    total: 0
  });
  const frameRef = (0, import_react2.useRef)(void 0);
  const lastTimeRef = (0, import_react2.useRef)(0);
  const frameTimesRef = (0, import_react2.useRef)([]);
  const targetFrameTimeRef = (0, import_react2.useRef)(1e3 / targetFPS);
  const callbacksRef = (0, import_react2.useRef)(/* @__PURE__ */ new Set());
  const calculateFPS = (0, import_react2.useCallback)((frameTime) => {
    frameTimesRef.current.push(frameTime);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }
    const currentFPS = 1e3 / frameTime;
    const averageFPS = frameTimesRef.current.length > 0 ? 1e3 / (frameTimesRef.current.reduce((a, b) => a + b) / frameTimesRef.current.length) : 0;
    return { currentFPS, averageFPS };
  }, []);
  const animate = (0, import_react2.useCallback)(
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
  const start = (0, import_react2.useCallback)(() => {
    if (frameRef.current) return;
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(animate);
  }, [animate]);
  const stop = (0, import_react2.useCallback)(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = void 0;
    }
  }, []);
  const reset = (0, import_react2.useCallback)(() => {
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
  const addCallback = (0, import_react2.useCallback)((callback) => {
    callbacksRef.current.add(callback);
    return () => {
      callbacksRef.current.delete(callback);
    };
  }, []);
  const setTargetFPS = (0, import_react2.useCallback)(
    (fps) => {
      targetFrameTimeRef.current = 1e3 / Math.max(minFPS, Math.min(maxFPS, fps));
    },
    [minFPS, maxFPS]
  );
  (0, import_react2.useEffect)(() => {
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
  const callbackRef = (0, import_react2.useRef)(callback);
  const lastTimeRef = (0, import_react2.useRef)(0);
  const frameRef = (0, import_react2.useRef)(void 0);
  callbackRef.current = callback;
  const throttledCallback = (0, import_react2.useCallback)(
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
  const start = (0, import_react2.useCallback)(() => {
    if (frameRef.current) return;
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(throttledCallback);
  }, [throttledCallback]);
  const stop = (0, import_react2.useCallback)(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = void 0;
    }
  }, []);
  (0, import_react2.useEffect)(() => {
    return () => stop();
  }, [stop]);
  return { start, stop, isRunning: !!frameRef.current };
}

// src/useOptimization.ts
var import_react3 = require("react");
function usePerformanceMonitor(options = {}) {
  const {
    trackMemory = true,
    trackRenderTime = true,
    trackFrameRate = true,
    sampleRate = 0.1,
    maxSamples = 100
  } = options;
  const metricsRef = (0, import_react3.useRef)([]);
  const lastFrameTimeRef = (0, import_react3.useRef)(0);
  const renderStartRef = (0, import_react3.useRef)(0);
  const shouldSample = (0, import_react3.useCallback)(() => {
    return Math.random() < sampleRate;
  }, [sampleRate]);
  const startRenderTracking = (0, import_react3.useCallback)(() => {
    if (trackRenderTime && shouldSample()) {
      renderStartRef.current = performance.now();
    }
  }, [trackRenderTime, shouldSample]);
  const endRenderTracking = (0, import_react3.useCallback)(() => {
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
  const getMemoryUsage = (0, import_react3.useCallback)(() => {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = performance.memory;
      return memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }, []);
  const calculateFrameRate = (0, import_react3.useCallback)(() => {
    const now = performance.now();
    if (lastFrameTimeRef.current === 0) {
      lastFrameTimeRef.current = now;
      return 0;
    }
    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;
    return frameTime > 0 ? 1e3 / frameTime : 0;
  }, []);
  const getAverageMetrics = (0, import_react3.useCallback)(() => {
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
  const clearMetrics = (0, import_react3.useCallback)(() => {
    metricsRef.current = [];
  }, []);
  const getLatestMetrics = (0, import_react3.useCallback)(() => {
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
  const startTime = (0, import_react3.useRef)(0);
  const result = (0, import_react3.useMemo)(() => {
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
  const timeoutRef = (0, import_react3.useRef)(void 0);
  const callbackRef = (0, import_react3.useRef)(callback);
  callbackRef.current = callback;
  const debouncedCallback = (0, import_react3.useCallback)(
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
  const observerRef = (0, import_react3.useRef)(void 0);
  const elementsRef = (0, import_react3.useRef)(
    /* @__PURE__ */ new Map()
  );
  const observe = (0, import_react3.useCallback)(
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
  const disconnect = (0, import_react3.useCallback)(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      elementsRef.current.clear();
    }
  }, []);
  return { observe, disconnect };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
