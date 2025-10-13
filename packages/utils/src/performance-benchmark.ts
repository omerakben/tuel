/**
 * Performance Monitoring and Benchmarking Utilities
 *
 * This module provides comprehensive performance monitoring, benchmarking,
 * and optimization tools for TUEL components.
 */

// Performance monitoring configuration
export interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number; // 0-1, percentage of sessions to monitor
  thresholds: {
    fps: { warning: number; critical: number };
    memory: { warning: number; critical: number };
    loadTime: { warning: number; critical: number };
    renderTime: { warning: number; critical: number };
  };
  reporting: {
    enabled: boolean;
    endpoint?: string;
    batchSize: number;
    flushInterval: number;
  };
}

// Performance metrics interface
export interface PerformanceMetrics {
  timestamp: number;
  component: string;
  browser: string;
  device: string;
  metrics: {
    fps: number;
    avgFrameTime: number;
    frameDrops: number;
    memoryUsage: number;
    loadTime: number;
    renderTime: number;
    jank: number;
  };
  context: {
    viewport: { width: number; height: number };
    devicePixelRatio: number;
    connectionType?: string;
    hardwareConcurrency?: number;
  };
}

// Performance benchmark result
export interface BenchmarkResult {
  component: string;
  scenario: string;
  duration: number;
  metrics: {
    fps: { min: number; max: number; avg: number; median: number };
    memory: { min: number; max: number; avg: number; peak: number };
    renderTime: { min: number; max: number; avg: number; p95: number };
    jank: number;
    frameDrops: number;
  };
  score: number; // 0-100
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  recommendations: string[];
}

// Default performance configuration
const DEFAULT_CONFIG: PerformanceConfig = {
  enabled: true,
  sampleRate: 0.1, // Monitor 10% of sessions
  thresholds: {
    fps: { warning: 45, critical: 30 },
    memory: { warning: 80, critical: 120 },
    loadTime: { warning: 2000, critical: 3000 },
    renderTime: { warning: 16, critical: 33 },
  },
  reporting: {
    enabled: false,
    batchSize: 50,
    flushInterval: 30000, // 30 seconds
  },
};

// Performance monitoring class
export class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceMetrics[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private isMonitoring = false;
  private frameCount = 0;
  private lastFrameTime = 0;
  private frameTimes: number[] = [];
  private memorySnapshots: number[] = [];

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    if (!this.config.enabled || typeof window === "undefined") return;

    // Only monitor a percentage of sessions
    if (Math.random() > this.config.sampleRate) return;

    this.startFrameMonitoring();
    this.startMemoryMonitoring();
    this.startLoadTimeMonitoring();
    this.setupReporting();
  }

  private startFrameMonitoring(): void {
    let lastTime = performance.now();

    const measureFrame = () => {
      const now = performance.now();
      const frameTime = now - lastTime;

      this.frameCount++;
      this.frameTimes.push(frameTime);

      // Keep only last 60 frames for rolling average
      if (this.frameTimes.length > 60) {
        this.frameTimes.shift();
      }

      lastTime = now;

      if (this.isMonitoring) {
        requestAnimationFrame(measureFrame);
      }
    };

    requestAnimationFrame(measureFrame);
  }

  private startMemoryMonitoring(): void {
    if (!(performance as any).memory) return;

    const measureMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        this.memorySnapshots.push(memory.usedJSHeapSize / 1024 / 1024);

        // Keep only last 100 snapshots
        if (this.memorySnapshots.length > 100) {
          this.memorySnapshots.shift();
        }
      }

      if (this.isMonitoring) {
        setTimeout(measureMemory, 1000); // Check every second
      }
    };

    measureMemory();
  }

  private startLoadTimeMonitoring(): void {
    if (document.readyState === "loading") {
      window.addEventListener("load", () => {
        this.recordLoadMetrics();
      });
    } else {
      this.recordLoadMetrics();
    }
  }

  private recordLoadMetrics(): void {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType("paint");

    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    const firstPaint =
      paintEntries.find((entry) => entry.name === "first-paint")?.startTime ||
      0;
    const firstContentfulPaint =
      paintEntries.find((entry) => entry.name === "first-contentful-paint")
        ?.startTime || 0;

    // Check if load time exceeds thresholds
    if (loadTime > this.config.thresholds.loadTime.critical) {
      this.reportPerformanceIssue("loadTime", loadTime, "critical");
    } else if (loadTime > this.config.thresholds.loadTime.warning) {
      this.reportPerformanceIssue("loadTime", loadTime, "warning");
    }
  }

  private setupReporting(): void {
    if (!this.config.reporting.enabled) return;

    // Flush metrics periodically
    setInterval(() => {
      this.flushMetrics();
    }, this.config.reporting.flushInterval);

    // Flush metrics before page unload
    window.addEventListener("beforeunload", () => {
      this.flushMetrics();
    });
  }

  startMonitoring(component: string): void {
    this.isMonitoring = true;
    this.frameCount = 0;
    this.frameTimes = [];
    this.memorySnapshots = [];
    this.lastFrameTime = performance.now();
  }

  stopMonitoring(component: string): PerformanceMetrics | null {
    if (!this.isMonitoring) return null;

    this.isMonitoring = false;

    const now = performance.now();
    const duration = now - this.lastFrameTime;

    // Calculate FPS
    const fps = this.frameCount / (duration / 1000);

    // Calculate average frame time
    const avgFrameTime =
      this.frameTimes.length > 0
        ? this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
        : 0;

    // Calculate frame drops (frames taking longer than 16ms)
    const frameDrops = this.frameTimes.filter((time) => time > 16).length;

    // Calculate jank (frames taking longer than 33ms)
    const jank =
      this.frameTimes.filter((time) => time > 33).length /
      this.frameTimes.length;

    // Get current memory usage
    const memoryUsage =
      (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;

    // Get load time
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

    const metrics: PerformanceMetrics = {
      timestamp: now,
      component,
      browser: navigator.userAgent,
      device: this.getDeviceInfo(),
      metrics: {
        fps: Math.round(fps),
        avgFrameTime: Math.round(avgFrameTime * 100) / 100,
        frameDrops,
        memoryUsage: Math.round(memoryUsage * 100) / 100,
        loadTime: Math.round(loadTime),
        renderTime: Math.round(avgFrameTime * 100) / 100,
        jank: Math.round(jank * 100) / 100,
      },
      context: {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        devicePixelRatio: window.devicePixelRatio,
        connectionType: (navigator as any).connection?.effectiveType,
        hardwareConcurrency: navigator.hardwareConcurrency,
      },
    };

    this.metrics.push(metrics);

    // Check thresholds and report issues
    this.checkPerformanceThresholds(metrics);

    return metrics;
  }

  private getDeviceInfo(): string {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
    if (/Windows/i.test(ua)) return "Windows";
    if (/Mac/i.test(ua)) return "macOS";
    if (/Linux/i.test(ua)) return "Linux";
    return "Unknown";
  }

  private checkPerformanceThresholds(metrics: PerformanceMetrics): void {
    const { fps, memoryUsage, loadTime, renderTime } = metrics.metrics;

    // Check FPS
    if (fps < this.config.thresholds.fps.critical) {
      this.reportPerformanceIssue("fps", fps, "critical");
    } else if (fps < this.config.thresholds.fps.warning) {
      this.reportPerformanceIssue("fps", fps, "warning");
    }

    // Check memory usage
    if (memoryUsage > this.config.thresholds.memory.critical) {
      this.reportPerformanceIssue("memory", memoryUsage, "critical");
    } else if (memoryUsage > this.config.thresholds.memory.warning) {
      this.reportPerformanceIssue("memory", memoryUsage, "warning");
    }

    // Check load time
    if (loadTime > this.config.thresholds.loadTime.critical) {
      this.reportPerformanceIssue("loadTime", loadTime, "critical");
    } else if (loadTime > this.config.thresholds.loadTime.warning) {
      this.reportPerformanceIssue("loadTime", loadTime, "warning");
    }

    // Check render time
    if (renderTime > this.config.thresholds.renderTime.critical) {
      this.reportPerformanceIssue("renderTime", renderTime, "critical");
    } else if (renderTime > this.config.thresholds.renderTime.warning) {
      this.reportPerformanceIssue("renderTime", renderTime, "warning");
    }
  }

  private reportPerformanceIssue(
    metric: string,
    value: number,
    severity: "warning" | "critical"
  ): void {
    const message = `TUEL Performance ${severity.toUpperCase()}: ${metric} = ${value}`;

    if (severity === "critical") {
      console.error(message);
    } else {
      console.warn(message);
    }

    // Could send to external monitoring service here
    if (this.config.reporting.enabled && this.config.reporting.endpoint) {
      this.sendToReportingService({
        type: "performance_issue",
        metric,
        value,
        severity,
        timestamp: performance.now(),
        component: "unknown",
        browser: navigator.userAgent,
      });
    }
  }

  private async sendToReportingService(data: any): Promise<void> {
    try {
      await fetch(this.config.reporting.endpoint!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Failed to send performance data:", error);
    }
  }

  private flushMetrics(): void {
    if (this.metrics.length === 0) return;

    if (this.config.reporting.enabled && this.config.reporting.endpoint) {
      const batch = this.metrics.splice(0, this.config.reporting.batchSize);
      this.sendToReportingService({
        type: "performance_metrics",
        metrics: batch,
        timestamp: performance.now(),
      });
    }

    // Clear metrics after reporting
    this.metrics = [];
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

// Performance benchmarking class
export class PerformanceBenchmark {
  private results: BenchmarkResult[] = [];

  async runBenchmark(
    component: string,
    scenario: string,
    duration: number,
    testFunction: () => Promise<void>
  ): Promise<BenchmarkResult> {
    const startTime = performance.now();
    const frameTimes: number[] = [];
    const memorySnapshots: number[] = [];
    let frameCount = 0;
    let frameDrops = 0;
    let jankFrames = 0;

    // Start monitoring
    const monitor = new PerformanceMonitor({ enabled: true, sampleRate: 1 });
    monitor.startMonitoring(component);

    // Run the test function
    await testFunction();

    // Collect metrics during the test
    const measureFrame = () => {
      const now = performance.now();
      const frameTime = now - (frameTimes[frameTimes.length - 1] || startTime);

      frameTimes.push(frameTime);
      frameCount++;

      if (frameTime > 16) frameDrops++;
      if (frameTime > 33) jankFrames++;

      if (now - startTime < duration) {
        requestAnimationFrame(measureFrame);
      }
    };

    requestAnimationFrame(measureFrame);

    // Wait for the duration
    await new Promise((resolve) => setTimeout(resolve, duration));

    // Stop monitoring
    const metrics = monitor.stopMonitoring(component);

    // Calculate results
    const fpsValues = frameTimes.map((time) => 1000 / time);
    const memoryValues = memorySnapshots;
    const renderTimeValues = frameTimes;

    const result: BenchmarkResult = {
      component,
      scenario,
      duration,
      metrics: {
        fps: {
          min: Math.min(...fpsValues),
          max: Math.max(...fpsValues),
          avg: fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length,
          median: this.calculateMedian(fpsValues),
        },
        memory: {
          min: Math.min(...memoryValues),
          max: Math.max(...memoryValues),
          avg: memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length,
          peak: Math.max(...memoryValues),
        },
        renderTime: {
          min: Math.min(...renderTimeValues),
          max: Math.max(...renderTimeValues),
          avg:
            renderTimeValues.reduce((a, b) => a + b, 0) /
            renderTimeValues.length,
          p95: this.calculatePercentile(renderTimeValues, 95),
        },
        jank: jankFrames / frameCount,
        frameDrops,
      },
      score: this.calculateScore(fpsValues, memoryValues, renderTimeValues),
      grade: this.calculateGrade(fpsValues, memoryValues, renderTimeValues),
      recommendations: this.generateRecommendations(
        fpsValues,
        memoryValues,
        renderTimeValues
      ),
    };

    this.results.push(result);
    return result;
  }

  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  private calculateScore(
    fps: number[],
    memory: number[],
    renderTime: number[]
  ): number {
    let score = 100;

    const avgFPS = fps.reduce((a, b) => a + b, 0) / fps.length;
    const avgMemory = memory.reduce((a, b) => a + b, 0) / memory.length;
    const avgRenderTime =
      renderTime.reduce((a, b) => a + b, 0) / renderTime.length;

    // Deduct points for poor performance
    if (avgFPS < 30) score -= 30;
    else if (avgFPS < 45) score -= 15;
    else if (avgFPS < 60) score -= 5;

    if (avgMemory > 100) score -= 20;
    else if (avgMemory > 80) score -= 10;

    if (avgRenderTime > 33) score -= 20;
    else if (avgRenderTime > 16) score -= 10;

    return Math.max(0, score);
  }

  private calculateGrade(
    fps: number[],
    memory: number[],
    renderTime: number[]
  ): BenchmarkResult["grade"] {
    const score = this.calculateScore(fps, memory, renderTime);

    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  private generateRecommendations(
    fps: number[],
    memory: number[],
    renderTime: number[]
  ): string[] {
    const recommendations: string[] = [];

    const avgFPS = fps.reduce((a, b) => a + b, 0) / fps.length;
    const avgMemory = memory.reduce((a, b) => a + b, 0) / memory.length;
    const avgRenderTime =
      renderTime.reduce((a, b) => a + b, 0) / renderTime.length;

    if (avgFPS < 30) {
      recommendations.push(
        "Consider reducing animation complexity or using CSS transforms instead of JavaScript animations"
      );
    }

    if (avgMemory > 100) {
      recommendations.push(
        "Review memory usage and implement proper cleanup for animations and event listeners"
      );
    }

    if (avgRenderTime > 33) {
      recommendations.push(
        "Optimize rendering performance by using requestAnimationFrame and avoiding synchronous DOM operations"
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("Performance is within acceptable ranges");
    }

    return recommendations;
  }

  getResults(): BenchmarkResult[] {
    return [...this.results];
  }

  clearResults(): void {
    this.results = [];
  }

  generateReport(): string {
    const results = this.getResults();
    if (results.length === 0) return "No benchmark results available";

    let report = "# TUEL Performance Benchmark Report\n\n";

    results.forEach((result) => {
      report += `## ${result.component} - ${result.scenario}\n\n`;
      report += `**Score:** ${result.score}/100 (${result.grade})\n\n`;
      report += `**Metrics:**\n`;
      report += `- FPS: ${result.metrics.fps.avg.toFixed(
        1
      )} (min: ${result.metrics.fps.min.toFixed(
        1
      )}, max: ${result.metrics.fps.max.toFixed(1)})\n`;
      report += `- Memory: ${result.metrics.memory.avg.toFixed(
        1
      )}MB (peak: ${result.metrics.memory.peak.toFixed(1)}MB)\n`;
      report += `- Render Time: ${result.metrics.renderTime.avg.toFixed(
        1
      )}ms (p95: ${result.metrics.renderTime.p95.toFixed(1)}ms)\n`;
      report += `- Jank: ${(result.metrics.jank * 100).toFixed(1)}%\n`;
      report += `- Frame Drops: ${result.metrics.frameDrops}\n\n`;
      report += `**Recommendations:**\n`;
      result.recommendations.forEach((rec) => {
        report += `- ${rec}\n`;
      });
      report += "\n";
    });

    return report;
  }
}

// Utility functions
export const performanceUtils = {
  // Get current FPS
  getCurrentFPS(): Promise<number> {
    return new Promise((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();

      const measureFrame = () => {
        frameCount++;
        if (frameCount < 60) {
          requestAnimationFrame(measureFrame);
        } else {
          const fps = frameCount / ((performance.now() - startTime) / 1000);
          resolve(Math.round(fps));
        }
      };

      requestAnimationFrame(measureFrame);
    });
  },

  // Get memory usage
  getMemoryUsage(): { used: number; total: number; limit: number } | null {
    const memory = (performance as any).memory;
    if (!memory) return null;

    return {
      used: Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
      total: Math.round((memory.totalJSHeapSize / 1024 / 1024) * 100) / 100,
      limit: Math.round((memory.jsHeapSizeLimit / 1024 / 1024) * 100) / 100,
    };
  },

  // Check if performance is acceptable
  isPerformanceAcceptable(
    fps: number,
    memoryUsage: number,
    renderTime: number
  ): boolean {
    return fps >= 30 && memoryUsage <= 100 && renderTime <= 33;
  },

  // Get performance grade
  getPerformanceGrade(
    fps: number,
    memoryUsage: number,
    renderTime: number
  ): string {
    let score = 100;

    if (fps < 30) score -= 30;
    else if (fps < 45) score -= 15;
    else if (fps < 60) score -= 5;

    if (memoryUsage > 100) score -= 20;
    else if (memoryUsage > 80) score -= 10;

    if (renderTime > 33) score -= 20;
    else if (renderTime > 16) score -= 10;

    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  },
};

// Export default instances
export const performanceMonitor = new PerformanceMonitor();
export const performanceBenchmark = new PerformanceBenchmark();

// Auto-initialize monitoring
if (typeof window !== "undefined") {
  performanceMonitor.startMonitoring("global");
}
