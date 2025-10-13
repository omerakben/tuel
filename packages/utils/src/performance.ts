/**
 * Performance monitoring and metrics system for TUEL components
 * Provides FPS monitoring, memory tracking, and performance budgets
 */

import { useEffect, useRef, useState, useCallback } from "react";

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderTime: number;
  animationTime: number;
  timestamp: number;
}

export interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number; // How often to sample (ms)
  fpsThreshold: number; // Alert if FPS drops below this
  memoryThreshold: number; // Alert if memory exceeds this (MB)
  renderTimeThreshold: number; // Alert if render time exceeds this (ms)
  maxSamples: number; // Maximum samples to keep in memory
}

export interface PerformanceAlert {
  type: "fps" | "memory" | "render" | "animation";
  severity: "warning" | "error";
  message: string;
  value: number;
  threshold: number;
  timestamp: number;
}

export interface PerformanceReport {
  metrics: PerformanceMetrics[];
  alerts: PerformanceAlert[];
  averageFps: number;
  peakMemoryUsage: number;
  averageRenderTime: number;
  totalSamples: number;
  duration: number; // Total monitoring duration in ms
}

const DEFAULT_CONFIG: PerformanceConfig = {
  enabled: true,
  sampleRate: 1000, // Sample every second
  fpsThreshold: 30, // Alert if FPS drops below 30
  memoryThreshold: 100, // Alert if memory exceeds 100MB
  renderTimeThreshold: 16, // Alert if render time exceeds 16ms (60fps)
  maxSamples: 1000, // Keep last 1000 samples
};

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(
  config: Partial<PerformanceConfig> = {}
): {
  metrics: PerformanceMetrics[];
  alerts: PerformanceAlert[];
  report: PerformanceReport | null;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  clearMetrics: () => void;
  isMonitoring: boolean;
} {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [report, setReport] = useState<PerformanceReport | null>(null);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const startTimeRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const addAlert = useCallback((alert: PerformanceAlert) => {
    setAlerts((prev) => [...prev.slice(-99), alert]); // Keep last 100 alerts
    console.warn(`[TUEL Performance] ${alert.message}`);
  }, []);

  const collectMetrics = useCallback(() => {
    if (!finalConfig.enabled) return;

    const now = performance.now();
    const frameTime = now - lastTimeRef.current;
    const fps = frameTime > 0 ? 1000 / frameTime : 0;

    // Get memory usage (if available)
    const memoryUsage = (performance as any).memory
      ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
      : 0;

    const newMetric: PerformanceMetrics = {
      fps,
      frameTime,
      memoryUsage,
      renderTime: 0, // Will be set by components
      animationTime: 0, // Will be set by components
      timestamp: now,
    };

    setMetrics((prev) => {
      const updated = [...prev, newMetric];
      return updated.slice(-finalConfig.maxSamples); // Keep only recent samples
    });

    // Check for alerts
    if (fps < finalConfig.fpsThreshold && fps > 0) {
      addAlert({
        type: "fps",
        severity: fps < 15 ? "error" : "warning",
        message: `Low FPS detected: ${fps.toFixed(1)}fps (threshold: ${
          finalConfig.fpsThreshold
        }fps)`,
        value: fps,
        threshold: finalConfig.fpsThreshold,
        timestamp: now,
      });
    }

    if (memoryUsage > finalConfig.memoryThreshold) {
      addAlert({
        type: "memory",
        severity:
          memoryUsage > finalConfig.memoryThreshold * 2 ? "error" : "warning",
        message: `High memory usage: ${memoryUsage.toFixed(1)}MB (threshold: ${
          finalConfig.memoryThreshold
        }MB)`,
        value: memoryUsage,
        threshold: finalConfig.memoryThreshold,
        timestamp: now,
      });
    }

    lastTimeRef.current = now;
    frameCountRef.current++;
  }, [finalConfig, addAlert]);

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);
    startTimeRef.current = performance.now();
    lastTimeRef.current = performance.now();
    frameCountRef.current = 0;

    // Start FPS monitoring with requestAnimationFrame
    const monitorFPS = () => {
      collectMetrics();
      rafRef.current = requestAnimationFrame(monitorFPS);
    };
    rafRef.current = requestAnimationFrame(monitorFPS);

    // Start periodic sampling
    intervalRef.current = window.setInterval(
      collectMetrics,
      finalConfig.sampleRate
    );
  }, [isMonitoring, collectMetrics, finalConfig.sampleRate]);

  const stopMonitoring = useCallback(() => {
    if (!isMonitoring) return;

    setIsMonitoring(false);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Generate final report
    const duration = performance.now() - startTimeRef.current;
    const averageFps =
      metrics.length > 0
        ? metrics.reduce((sum, m) => sum + m.fps, 0) / metrics.length
        : 0;
    const peakMemoryUsage =
      metrics.length > 0 ? Math.max(...metrics.map((m) => m.memoryUsage)) : 0;
    const averageRenderTime =
      metrics.length > 0
        ? metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length
        : 0;

    setReport({
      metrics: [...metrics],
      alerts: [...alerts],
      averageFps,
      peakMemoryUsage,
      averageRenderTime,
      totalSamples: metrics.length,
      duration,
    });
  }, [isMonitoring, metrics, alerts]);

  const clearMetrics = useCallback(() => {
    setMetrics([]);
    setAlerts([]);
    setReport(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    metrics,
    alerts,
    report,
    startMonitoring,
    stopMonitoring,
    clearMetrics,
    isMonitoring,
  };
}

/**
 * Hook for measuring render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderStartRef = useRef<number>(0);
  const renderCountRef = useRef(0);

  const startRender = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    const renderTime = performance.now() - renderStartRef.current;
    renderCountRef.current++;

    if (renderTime > 16) {
      // Alert if render takes longer than 16ms
      console.warn(
        `[TUEL Performance] Slow render in ${componentName}: ${renderTime.toFixed(
          2
        )}ms`
      );
    }

    return renderTime;
  }, [componentName]);

  return { startRender, endRender, renderCount: renderCountRef.current };
}

/**
 * Hook for measuring animation performance
 */
export function useAnimationPerformance(animationName: string) {
  const animationStartRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef<number>(0);

  const startAnimation = useCallback(() => {
    animationStartRef.current = performance.now();
    lastFrameTimeRef.current = performance.now();
    frameCountRef.current = 0;
  }, []);

  const recordFrame = useCallback(() => {
    const now = performance.now();
    const frameTime = now - lastFrameTimeRef.current;
    frameCountRef.current++;
    lastFrameTimeRef.current = now;

    if (frameTime > 16) {
      // Alert if frame takes longer than 16ms
      console.warn(
        `[TUEL Performance] Slow frame in ${animationName}: ${frameTime.toFixed(
          2
        )}ms`
      );
    }

    return frameTime;
  }, [animationName]);

  const endAnimation = useCallback(() => {
    const totalTime = performance.now() - animationStartRef.current;
    const averageFrameTime = totalTime / frameCountRef.current;
    const fps = frameCountRef.current / (totalTime / 1000);

    console.log(
      `[TUEL Performance] ${animationName} completed: ${totalTime.toFixed(
        2
      )}ms, ${fps.toFixed(1)}fps average`
    );

    return {
      totalTime,
      frameCount: frameCountRef.current,
      averageFrameTime,
      fps,
    };
  }, [animationName]);

  return { startAnimation, recordFrame, endAnimation };
}

/**
 * Performance budget checker
 */
export class PerformanceBudget {
  private budgets: Map<string, number> = new Map();
  private violations: Array<{
    component: string;
    budget: number;
    actual: number;
    timestamp: number;
  }> = [];

  constructor() {
    // Set default budgets
    this.setBudget("render", 16); // 60fps
    this.setBudget("animation", 16); // 60fps
    this.setBudget("memory", 50); // 50MB
    this.setBudget("fps", 30); // Minimum 30fps
  }

  setBudget(component: string, budget: number): void {
    this.budgets.set(component, budget);
  }

  checkBudget(component: string, actual: number): boolean {
    const budget = this.budgets.get(component);
    if (!budget) return true;

    const isViolation = actual > budget;
    if (isViolation) {
      this.violations.push({
        component,
        budget,
        actual,
        timestamp: performance.now(),
      });

      console.warn(
        `[TUEL Performance] Budget violation in ${component}: ${actual.toFixed(
          2
        )}ms > ${budget}ms budget`
      );
    }

    return !isViolation;
  }

  getViolations(): Array<{
    component: string;
    budget: number;
    actual: number;
    timestamp: number;
  }> {
    return [...this.violations];
  }

  clearViolations(): void {
    this.violations = [];
  }
}

/**
 * Global performance budget instance
 */
export const performanceBudget = new PerformanceBudget();

/**
 * Performance dashboard component (for development)
 */
export function PerformanceDashboard({
  metrics,
  alerts,
  report,
  isMonitoring,
  onStart,
  onStop,
  onClear,
}: {
  metrics: PerformanceMetrics[];
  alerts: PerformanceAlert[];
  report: PerformanceReport | null;
  isMonitoring: boolean;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
}) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const latestMetric = metrics[metrics.length - 1];
  const recentAlerts = alerts.slice(-5);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        width: "300px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "1rem",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
        fontFamily: "monospace",
        zIndex: 9999,
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem" }}>TUEL Performance</h3>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button
            onClick={isMonitoring ? onStop : onStart}
            style={{
              padding: "0.25rem 0.5rem",
              backgroundColor: isMonitoring ? "#e53e3e" : "#38a169",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontSize: "0.75rem",
            }}
          >
            {isMonitoring ? "Stop" : "Start"}
          </button>
          <button
            onClick={onClear}
            style={{
              padding: "0.25rem 0.5rem",
              backgroundColor: "#718096",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontSize: "0.75rem",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {latestMetric && (
        <div style={{ marginBottom: "1rem" }}>
          <div>FPS: {latestMetric.fps.toFixed(1)}</div>
          <div>Memory: {latestMetric.memoryUsage.toFixed(1)}MB</div>
          <div>Frame Time: {latestMetric.frameTime.toFixed(2)}ms</div>
          <div>Samples: {metrics.length}</div>
        </div>
      )}

      {recentAlerts.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
            Recent Alerts:
          </div>
          {recentAlerts.map((alert, index) => (
            <div
              key={index}
              style={{
                fontSize: "0.75rem",
                color: alert.severity === "error" ? "#fc8181" : "#f6ad55",
                marginBottom: "0.25rem",
              }}
            >
              {alert.type}: {alert.value.toFixed(1)}
            </div>
          ))}
        </div>
      )}

      {report && (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
            Report:
          </div>
          <div style={{ fontSize: "0.75rem" }}>
            <div>Avg FPS: {report.averageFps.toFixed(1)}</div>
            <div>Peak Memory: {report.peakMemoryUsage.toFixed(1)}MB</div>
            <div>Duration: {(report.duration / 1000).toFixed(1)}s</div>
          </div>
        </div>
      )}
    </div>
  );
}
