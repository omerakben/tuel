import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  usePerformanceMonitor,
  useRenderPerformance,
  useAnimationPerformance,
  PerformanceBudget,
  performanceBudget,
} from "../performance";

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024, // 50MB
  },
};

Object.defineProperty(window, "performance", {
  value: mockPerformance,
  writable: true,
});

// Mock requestAnimationFrame
const mockRAF = vi.fn((callback: FrameRequestCallback) => {
  setTimeout(() => callback(performance.now()), 16);
  return 1;
});

Object.defineProperty(window, "requestAnimationFrame", {
  value: mockRAF,
  writable: true,
});

// Mock cancelAnimationFrame
const mockCancelRAF = vi.fn();

Object.defineProperty(window, "cancelAnimationFrame", {
  value: mockCancelRAF,
  writable: true,
});

// Mock console methods
const consoleSpy = {
  warn: vi.fn(),
  log: vi.fn(),
};

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(consoleSpy.warn);
  vi.spyOn(console, "log").mockImplementation(consoleSpy.log);
  mockPerformance.now.mockReturnValue(Date.now());
});

afterEach(() => {
  vi.clearAllMocks();
  performanceBudget.clearViolations();
});

describe("usePerformanceMonitor", () => {
  it("initializes with empty metrics", () => {
    const { result } = renderHook(() => usePerformanceMonitor());

    expect(result.current.metrics).toEqual([]);
    expect(result.current.alerts).toEqual([]);
    expect(result.current.isMonitoring).toBe(false);
    expect(result.current.report).toBeNull();
  });

  it("starts and stops monitoring", () => {
    const { result } = renderHook(() => usePerformanceMonitor());

    act(() => {
      result.current.startMonitoring();
    });

    expect(result.current.isMonitoring).toBe(true);

    act(() => {
      result.current.stopMonitoring();
    });

    expect(result.current.isMonitoring).toBe(false);
  });

  it("collects performance metrics", async () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({ sampleRate: 100 })
    );

    act(() => {
      result.current.startMonitoring();
    });

    // Wait for metrics collection
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.metrics.length).toBeGreaterThan(0);

    const latestMetric =
      result.current.metrics[result.current.metrics.length - 1];
    expect(latestMetric).toHaveProperty("fps");
    expect(latestMetric).toHaveProperty("frameTime");
    expect(latestMetric).toHaveProperty("memoryUsage");
    expect(latestMetric).toHaveProperty("timestamp");
  });

  it("generates alerts for low FPS", async () => {
    // Mock low FPS
    mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(2000); // 1 second frame time = 1 FPS

    const { result } = renderHook(() =>
      usePerformanceMonitor({ fpsThreshold: 30, sampleRate: 100 })
    );

    act(() => {
      result.current.startMonitoring();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.alerts.length).toBeGreaterThan(0);
    expect(result.current.alerts[0].type).toBe("fps");
    expect(result.current.alerts[0].severity).toBe("error");
  });

  it("generates alerts for high memory usage", async () => {
    // Mock high memory usage
    mockPerformance.memory.usedJSHeapSize = 200 * 1024 * 1024; // 200MB

    const { result } = renderHook(() =>
      usePerformanceMonitor({ memoryThreshold: 100, sampleRate: 100 })
    );

    act(() => {
      result.current.startMonitoring();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.alerts.length).toBeGreaterThan(0);
    expect(result.current.alerts[0].type).toBe("memory");
  });

  it("clears metrics", () => {
    const { result } = renderHook(() => usePerformanceMonitor());

    act(() => {
      result.current.startMonitoring();
    });

    act(() => {
      result.current.clearMetrics();
    });

    expect(result.current.metrics).toEqual([]);
    expect(result.current.alerts).toEqual([]);
    expect(result.current.report).toBeNull();
  });

  it("generates performance report on stop", () => {
    const { result } = renderHook(() => usePerformanceMonitor());

    act(() => {
      result.current.startMonitoring();
    });

    act(() => {
      result.current.stopMonitoring();
    });

    expect(result.current.report).not.toBeNull();
    expect(result.current.report).toHaveProperty("averageFps");
    expect(result.current.report).toHaveProperty("peakMemoryUsage");
    expect(result.current.report).toHaveProperty("duration");
    expect(result.current.report).toHaveProperty("totalSamples");
  });

  it("respects max samples limit", () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({ maxSamples: 5, sampleRate: 10 })
    );

    act(() => {
      result.current.startMonitoring();
    });

    // Generate more than max samples
    for (let i = 0; i < 10; i++) {
      act(() => {
        mockPerformance.now.mockReturnValue(Date.now() + i * 1000);
      });
    }

    act(() => {
      result.current.stopMonitoring();
    });

    expect(result.current.metrics.length).toBeLessThanOrEqual(5);
  });

  it("disables monitoring when config disabled", () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({ enabled: false })
    );

    act(() => {
      result.current.startMonitoring();
    });

    expect(result.current.metrics).toEqual([]);
  });
});

describe("useRenderPerformance", () => {
  it("measures render performance", () => {
    const { result } = renderHook(() => useRenderPerformance("TestComponent"));

    act(() => {
      result.current.startRender();
    });

    // Simulate render time
    mockPerformance.now.mockReturnValue(Date.now() + 20);

    const renderTime = act(() => {
      return result.current.endRender();
    });

    expect(renderTime).toBeGreaterThan(0);
    expect(result.current.renderCount).toBe(1);
  });

  it("warns about slow renders", () => {
    const { result } = renderHook(() => useRenderPerformance("TestComponent"));

    act(() => {
      result.current.startRender();
    });

    // Simulate slow render (>16ms)
    mockPerformance.now.mockReturnValue(Date.now() + 20);

    act(() => {
      result.current.endRender();
    });

    expect(consoleSpy.warn).toHaveBeenCalledWith(
      expect.stringContaining("Slow render in TestComponent")
    );
  });

  it("tracks render count", () => {
    const { result } = renderHook(() => useRenderPerformance("TestComponent"));

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.startRender();
        result.current.endRender();
      });
    }

    expect(result.current.renderCount).toBe(3);
  });
});

describe("useAnimationPerformance", () => {
  it("measures animation performance", () => {
    const { result } = renderHook(() => useAnimationPerformance("fade"));

    act(() => {
      result.current.startAnimation();
    });

    // Simulate animation frames
    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.recordFrame();
      });
    }

    const animationStats = act(() => {
      return result.current.endAnimation();
    });

    expect(animationStats).toHaveProperty("totalTime");
    expect(animationStats).toHaveProperty("frameCount");
    expect(animationStats).toHaveProperty("averageFrameTime");
    expect(animationStats).toHaveProperty("fps");
    expect(animationStats.frameCount).toBe(3);
  });

  it("warns about slow frames", () => {
    const { result } = renderHook(() => useAnimationPerformance("slide"));

    act(() => {
      result.current.startAnimation();
    });

    // Simulate slow frame (>16ms)
    mockPerformance.now.mockReturnValue(Date.now() + 20);

    act(() => {
      result.current.recordFrame();
    });

    expect(consoleSpy.warn).toHaveBeenCalledWith(
      expect.stringContaining("Slow frame in slide")
    );
  });

  it("logs animation completion", () => {
    const { result } = renderHook(() => useAnimationPerformance("wave"));

    act(() => {
      result.current.startAnimation();
    });

    act(() => {
      result.current.endAnimation();
    });

    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining("wave completed")
    );
  });
});

describe("PerformanceBudget", () => {
  let budget: PerformanceBudget;

  beforeEach(() => {
    budget = new PerformanceBudget();
  });

  it("sets and checks budgets", () => {
    budget.setBudget("render", 16);

    expect(budget.checkBudget("render", 10)).toBe(true);
    expect(budget.checkBudget("render", 20)).toBe(false);
  });

  it("tracks violations", () => {
    budget.setBudget("animation", 16);

    budget.checkBudget("animation", 20);
    budget.checkBudget("animation", 30);

    const violations = budget.getViolations();
    expect(violations).toHaveLength(2);
    expect(violations[0].component).toBe("animation");
    expect(violations[0].actual).toBe(20);
    expect(violations[0].budget).toBe(16);
  });

  it("clears violations", () => {
    budget.setBudget("render", 16);
    budget.checkBudget("render", 20);

    expect(budget.getViolations()).toHaveLength(1);

    budget.clearViolations();
    expect(budget.getViolations()).toHaveLength(0);
  });

  it("has default budgets", () => {
    expect(budget.checkBudget("render", 10)).toBe(true);
    expect(budget.checkBudget("render", 20)).toBe(false);

    expect(budget.checkBudget("animation", 10)).toBe(true);
    expect(budget.checkBudget("animation", 20)).toBe(false);

    expect(budget.checkBudget("memory", 30)).toBe(true);
    expect(budget.checkBudget("memory", 60)).toBe(false);

    expect(budget.checkBudget("fps", 40)).toBe(true);
    expect(budget.checkBudget("fps", 20)).toBe(false);
  });
});

describe("Global performance budget", () => {
  it("works as singleton", () => {
    expect(performanceBudget).toBeInstanceOf(PerformanceBudget);
  });

  it("maintains state across tests", () => {
    performanceBudget.setBudget("test", 10);
    performanceBudget.checkBudget("test", 15);

    expect(performanceBudget.getViolations()).toHaveLength(1);
  });
});

describe("Performance monitoring integration", () => {
  it("integrates with performance budget", async () => {
    const { result } = renderHook(() => usePerformanceMonitor());

    act(() => {
      result.current.startMonitoring();
    });

    // Simulate slow performance
    mockPerformance.now.mockReturnValue(Date.now() + 20);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    // Should generate alerts for budget violations
    expect(result.current.alerts.length).toBeGreaterThan(0);
  });
});
