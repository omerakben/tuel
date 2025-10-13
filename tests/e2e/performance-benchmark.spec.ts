import { test, expect, Page } from "@playwright/test";

// Performance benchmarking configuration
const BENCHMARK_CONFIG = {
  // Performance thresholds
  thresholds: {
    fps: {
      excellent: 60,
      good: 45,
      acceptable: 30,
      poor: 20,
    },
    memory: {
      excellent: 50, // MB
      good: 80,
      acceptable: 120,
      poor: 200,
    },
    loadTime: {
      excellent: 1000, // ms
      good: 2000,
      acceptable: 3000,
      poor: 5000,
    },
    renderTime: {
      excellent: 8, // ms (120fps)
      good: 16, // ms (60fps)
      acceptable: 33, // ms (30fps)
      poor: 50, // ms (20fps)
    },
  },

  // Test scenarios
  scenarios: {
    idle: { duration: 2000, description: "Idle state performance" },
    hover: { duration: 2000, description: "Hover interaction performance" },
    click: { duration: 2000, description: "Click interaction performance" },
    scroll: { duration: 3000, description: "Scroll animation performance" },
    complex: { duration: 5000, description: "Complex animation performance" },
    stress: { duration: 10000, description: "Stress test performance" },
  },

  // Device profiles
  devices: {
    desktop: {
      name: "Desktop",
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    },
    laptop: {
      name: "Laptop",
      viewport: { width: 1366, height: 768 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    },
    tablet: {
      name: "Tablet",
      viewport: { width: 768, height: 1024 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
    mobile: {
      name: "Mobile",
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
    lowEnd: {
      name: "Low-end Device",
      viewport: { width: 320, height: 568 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
    },
  },
};

// Performance benchmarking utilities
class PerformanceBenchmark {
  constructor(private page: Page) {}

  async measurePageLoadPerformance(): Promise<{
    loadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
  }> {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType("paint");
      const lcpEntries = performance.getEntriesByType(
        "largest-contentful-paint"
      );
      const clsEntries = performance.getEntriesByType("layout-shift");

      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        firstPaint:
          paintEntries.find((entry) => entry.name === "first-paint")
            ?.startTime || 0,
        firstContentfulPaint:
          paintEntries.find((entry) => entry.name === "first-contentful-paint")
            ?.startTime || 0,
        largestContentfulPaint:
          lcpEntries[lcpEntries.length - 1]?.startTime || 0,
        cumulativeLayoutShift: clsEntries.reduce(
          (sum, entry) => sum + (entry as any).value,
          0
        ),
        firstInputDelay: 0, // Would need to be measured with actual user interaction
      };
    });

    return metrics;
  }

  async measureAnimationPerformance(
    selector: string,
    scenario: keyof typeof BENCHMARK_CONFIG.scenarios
  ): Promise<{
    fps: number;
    avgFrameTime: number;
    frameDrops: number;
    memoryUsage: number;
    totalFrames: number;
    jank: number;
    score: "excellent" | "good" | "acceptable" | "poor";
  }> {
    const config = BENCHMARK_CONFIG.scenarios[scenario];

    const metrics = await this.page.evaluate(
      (sel, duration) => {
        return new Promise((resolve) => {
          const element = document.querySelector(sel);
          if (!element) {
            resolve({
              fps: 0,
              avgFrameTime: 0,
              frameDrops: 0,
              memoryUsage: 0,
              totalFrames: 0,
              jank: 0,
              score: "poor",
            });
            return;
          }

          let frameCount = 0;
          let droppedFrames = 0;
          let jankFrames = 0;
          let startTime = performance.now();
          let lastFrameTime = startTime;
          const frameTimes: number[] = [];

          const measureFrame = () => {
            const now = performance.now();
            const frameTime = now - lastFrameTime;
            frameTimes.push(frameTime);
            frameCount++;

            // Count dropped frames (frames taking longer than 16ms)
            if (frameTime > 16) {
              droppedFrames++;
            }

            // Count jank frames (frames taking longer than 33ms)
            if (frameTime > 33) {
              jankFrames++;
            }

            lastFrameTime = now;

            if (now - startTime < duration) {
              requestAnimationFrame(measureFrame);
            } else {
              const fps = frameCount / ((now - startTime) / 1000);
              const avgFrameTime =
                frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
              const memoryUsage =
                (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;
              const jank = jankFrames / frameCount;

              // Calculate performance score
              let score: "excellent" | "good" | "acceptable" | "poor" = "poor";
              if (fps >= 60 && avgFrameTime <= 16) score = "excellent";
              else if (fps >= 45 && avgFrameTime <= 22) score = "good";
              else if (fps >= 30 && avgFrameTime <= 33) score = "acceptable";

              resolve({
                fps: Math.round(fps),
                avgFrameTime: Math.round(avgFrameTime * 100) / 100,
                frameDrops: droppedFrames,
                memoryUsage: Math.round(memoryUsage * 100) / 100,
                totalFrames: frameCount,
                jank: Math.round(jank * 100) / 100,
                score,
              });
            }
          };

          requestAnimationFrame(measureFrame);
        });
      },
      selector,
      config.duration
    );

    return metrics;
  }

  async measureMemoryUsage(): Promise<{
    used: number;
    total: number;
    limit: number;
    heapUsed: number;
    heapTotal: number;
  }> {
    const memoryInfo = await this.page.evaluate(() => {
      const memory = (performance as any).memory;
      if (!memory) return null;

      return {
        used: Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
        total: Math.round((memory.totalJSHeapSize / 1024 / 1024) * 100) / 100,
        limit: Math.round((memory.jsHeapSizeLimit / 1024 / 1024) * 100) / 100,
        heapUsed: Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
        heapTotal:
          Math.round((memory.totalJSHeapSize / 1024 / 1024) * 100) / 100,
      };
    });

    return (
      memoryInfo || { used: 0, total: 0, limit: 0, heapUsed: 0, heapTotal: 0 }
    );
  }

  async measureBundleSize(): Promise<{
    totalJS: number;
    jsCount: number;
    totalResources: number;
    totalSize: number;
    jsFiles: Array<{ name: string; size: number; loadTime: number }>;
  }> {
    const bundleInfo = await this.page.evaluate(() => {
      const resources = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];
      const jsResources = resources.filter((r) => r.name.endsWith(".js"));

      return {
        totalJS: jsResources.reduce((sum, r) => sum + r.transferSize, 0),
        jsCount: jsResources.length,
        totalResources: resources.length,
        totalSize: resources.reduce((sum, r) => sum + r.transferSize, 0),
        jsFiles: jsResources.map((r) => ({
          name: r.name.split("/").pop() || r.name,
          size: r.transferSize,
          loadTime: r.responseEnd - r.requestStart,
        })),
      };
    });

    return bundleInfo;
  }

  async runStressTest(
    selector: string,
    iterations = 100
  ): Promise<{
    avgFPS: number;
    minFPS: number;
    maxFPS: number;
    avgMemory: number;
    maxMemory: number;
    memoryLeaks: boolean;
    performanceDegradation: number;
  }> {
    const results: Array<{ fps: number; memory: number }> = [];

    for (let i = 0; i < iterations; i++) {
      // Trigger interaction
      const element = this.page.locator(selector);
      await element.hover();
      await element.click();
      await this.page.waitForTimeout(50);

      // Measure performance
      const performance = await this.measureAnimationPerformance(
        selector,
        "stress"
      );
      const memory = await this.measureMemoryUsage();

      results.push({
        fps: performance.fps,
        memory: memory.used,
      });
    }

    const fpsValues = results.map((r) => r.fps);
    const memoryValues = results.map((r) => r.memory);

    const avgFPS = fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length;
    const minFPS = Math.min(...fpsValues);
    const maxFPS = Math.max(...fpsValues);
    const avgMemory =
      memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length;
    const maxMemory = Math.max(...memoryValues);

    // Check for memory leaks (increasing memory usage over time)
    const memoryTrend =
      memoryValues.slice(-10).reduce((sum, val, i, arr) => {
        if (i === 0) return 0;
        return sum + (val - arr[i - 1]);
      }, 0) / 9;

    const memoryLeaks = memoryTrend > 1; // More than 1MB increase per iteration

    // Calculate performance degradation
    const earlyFPS = fpsValues.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
    const lateFPS = fpsValues.slice(-10).reduce((a, b) => a + b, 0) / 10;
    const performanceDegradation = ((earlyFPS - lateFPS) / earlyFPS) * 100;

    return {
      avgFPS: Math.round(avgFPS * 100) / 100,
      minFPS,
      maxFPS,
      avgMemory: Math.round(avgMemory * 100) / 100,
      maxMemory: Math.round(maxMemory * 100) / 100,
      memoryLeaks,
      performanceDegradation: Math.round(performanceDegradation * 100) / 100,
    };
  }

  async generatePerformanceReport(component: string): Promise<{
    component: string;
    timestamp: string;
    browser: string;
    device: string;
    loadMetrics: any;
    animationMetrics: any;
    memoryMetrics: any;
    bundleMetrics: any;
    stressTest: any;
    overallScore: number;
    recommendations: string[];
  }> {
    const timestamp = new Date().toISOString();
    const browser = await this.page.evaluate(() => navigator.userAgent);
    const device = await this.page.evaluate(() => ({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      deviceMemory: (navigator as any).deviceMemory || "unknown",
      hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
    }));

    // Measure all metrics
    const loadMetrics = await this.measurePageLoadPerformance();
    const animationMetrics = await this.measureAnimationPerformance(
      `[data-testid="${component}"]`,
      "complex"
    );
    const memoryMetrics = await this.measureMemoryUsage();
    const bundleMetrics = await this.measureBundleSize();
    const stressTest = await this.runStressTest(
      `[data-testid="${component}"]`,
      50
    );

    // Calculate overall score (0-100)
    let score = 100;
    const recommendations: string[] = [];

    // Deduct points for poor performance
    if (animationMetrics.fps < 30) {
      score -= 30;
      recommendations.push(
        "Improve animation FPS - consider optimizing animations or reducing complexity"
      );
    } else if (animationMetrics.fps < 45) {
      score -= 15;
      recommendations.push("Animation FPS could be improved");
    }

    if (memoryMetrics.used > 100) {
      score -= 20;
      recommendations.push(
        "High memory usage detected - consider memory optimization"
      );
    }

    if (loadMetrics.loadTime > 3000) {
      score -= 20;
      recommendations.push("Slow load time - consider bundle optimization");
    }

    if (stressTest.memoryLeaks) {
      score -= 25;
      recommendations.push("Memory leaks detected - review cleanup logic");
    }

    if (stressTest.performanceDegradation > 20) {
      score -= 15;
      recommendations.push(
        "Performance degradation over time - optimize for sustained performance"
      );
    }

    if (bundleMetrics.totalJS > 500000) {
      // 500KB
      score -= 10;
      recommendations.push("Large bundle size - consider code splitting");
    }

    return {
      component,
      timestamp,
      browser,
      device,
      loadMetrics,
      animationMetrics,
      memoryMetrics,
      bundleMetrics,
      stressTest,
      overallScore: Math.max(0, score),
      recommendations,
    };
  }
}

// Performance benchmark test suite
test.describe("Performance Benchmarking", () => {
  let benchmark: PerformanceBenchmark;

  test.beforeEach(async ({ page }) => {
    benchmark = new PerformanceBenchmark(page);
  });

  test("page load performance benchmark", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const loadMetrics = await benchmark.measurePageLoadPerformance();

    // Test against thresholds
    expect(loadMetrics.loadTime).toBeLessThan(
      BENCHMARK_CONFIG.thresholds.loadTime.acceptable
    );
    expect(loadMetrics.firstContentfulPaint).toBeLessThan(
      BENCHMARK_CONFIG.thresholds.loadTime.good
    );
    expect(loadMetrics.domContentLoaded).toBeLessThan(
      BENCHMARK_CONFIG.thresholds.loadTime.good
    );
  });

  test("bundle size benchmark", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const bundleMetrics = await benchmark.measureBundleSize();

    // Test bundle size limits
    expect(bundleMetrics.totalJS).toBeLessThan(500000); // 500KB
    expect(bundleMetrics.jsCount).toBeLessThan(20);
    expect(bundleMetrics.totalSize).toBeLessThan(1000000); // 1MB total

    // Log bundle analysis
    console.log("Bundle Analysis:", {
      totalJS: `${Math.round(bundleMetrics.totalJS / 1024)}KB`,
      jsFiles: bundleMetrics.jsCount,
      totalSize: `${Math.round(bundleMetrics.totalSize / 1024)}KB`,
      largestFiles: bundleMetrics.jsFiles
        .sort((a, b) => b.size - a.size)
        .slice(0, 5)
        .map((f) => ({ name: f.name, size: `${Math.round(f.size / 1024)}KB` })),
    });
  });

  test("memory usage benchmark", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const memoryMetrics = await benchmark.measureMemoryUsage();

    // Test memory limits
    expect(memoryMetrics.used).toBeLessThan(
      BENCHMARK_CONFIG.thresholds.memory.acceptable
    );
    expect(memoryMetrics.total).toBeLessThan(
      BENCHMARK_CONFIG.thresholds.memory.acceptable * 1.5
    );

    console.log("Memory Usage:", {
      used: `${memoryMetrics.used}MB`,
      total: `${memoryMetrics.total}MB`,
      limit: `${memoryMetrics.limit}MB`,
    });
  });
});

// Component-specific performance benchmarks
test.describe("MagneticButton Performance Benchmark", () => {
  let benchmark: PerformanceBenchmark;

  test.beforeEach(async ({ page }) => {
    benchmark = new PerformanceBenchmark(page);
    await page.goto("http://localhost:3000/interaction");
  });

  test("hover performance benchmark", async ({ page }) => {
    const button = page.locator('[data-testid="magnetic-button"]');
    await button.hover();

    const performance = await benchmark.measureAnimationPerformance(
      '[data-testid="magnetic-button"]',
      "hover"
    );

    expect(performance.fps).toBeGreaterThanOrEqual(
      BENCHMARK_CONFIG.thresholds.fps.acceptable
    );
    expect(performance.avgFrameTime).toBeLessThan(
      BENCHMARK_CONFIG.thresholds.renderTime.acceptable
    );
    expect(performance.jank).toBeLessThan(0.1); // Less than 10% jank

    console.log("MagneticButton Hover Performance:", {
      fps: performance.fps,
      avgFrameTime: `${performance.avgFrameTime}ms`,
      frameDrops: performance.frameDrops,
      jank: `${performance.jank * 100}%`,
      score: performance.score,
    });
  });

  test("click performance benchmark", async ({ page }) => {
    const button = page.locator('[data-testid="magnetic-button"]');
    await button.click();

    const performance = await benchmark.measureAnimationPerformance(
      '[data-testid="magnetic-button"]',
      "click"
    );

    expect(performance.fps).toBeGreaterThanOrEqual(
      BENCHMARK_CONFIG.thresholds.fps.acceptable
    );
    expect(performance.score).not.toBe("poor");

    console.log("MagneticButton Click Performance:", {
      fps: performance.fps,
      score: performance.score,
      memoryUsage: `${performance.memoryUsage}MB`,
    });
  });

  test("stress test benchmark", async ({ page }) => {
    const stressTest = await benchmark.runStressTest(
      '[data-testid="magnetic-button"]',
      100
    );

    expect(stressTest.avgFPS).toBeGreaterThanOrEqual(
      BENCHMARK_CONFIG.thresholds.fps.acceptable
    );
    expect(stressTest.memoryLeaks).toBe(false);
    expect(stressTest.performanceDegradation).toBeLessThan(20);

    console.log("MagneticButton Stress Test:", {
      avgFPS: stressTest.avgFPS,
      minFPS: stressTest.minFPS,
      maxFPS: stressTest.maxFPS,
      avgMemory: `${stressTest.avgMemory}MB`,
      maxMemory: `${stressTest.maxMemory}MB`,
      memoryLeaks: stressTest.memoryLeaks,
      performanceDegradation: `${stressTest.performanceDegradation}%`,
    });
  });

  test("comprehensive performance report", async ({ page }) => {
    const report = await benchmark.generatePerformanceReport("magnetic-button");

    expect(report.overallScore).toBeGreaterThanOrEqual(70); // Minimum acceptable score
    expect(report.recommendations.length).toBeLessThan(5); // Should not have too many issues

    console.log("MagneticButton Performance Report:", {
      overallScore: report.overallScore,
      recommendations: report.recommendations,
      animationScore: report.animationMetrics.score,
      memoryUsage: `${report.memoryMetrics.used}MB`,
      loadTime: `${report.loadMetrics.loadTime}ms`,
    });
  });
});

test.describe("Carousel Performance Benchmark", () => {
  let benchmark: PerformanceBenchmark;

  test.beforeEach(async ({ page }) => {
    benchmark = new PerformanceBenchmark(page);
    await page.goto("http://localhost:3000/ui");
  });

  test("slide transition performance benchmark", async ({ page }) => {
    const nextButton = page.locator('[data-testid="carousel-next-button"]');
    await nextButton.click();

    const performance = await benchmark.measureAnimationPerformance(
      '[data-testid="carousel"]',
      "click"
    );

    expect(performance.fps).toBeGreaterThanOrEqual(
      BENCHMARK_CONFIG.thresholds.fps.acceptable
    );
    expect(performance.score).not.toBe("poor");

    console.log("Carousel Transition Performance:", {
      fps: performance.fps,
      score: performance.score,
      avgFrameTime: `${performance.avgFrameTime}ms`,
    });
  });

  test("rapid navigation stress test", async ({ page }) => {
    const nextButton = page.locator('[data-testid="carousel-next-button"]');

    // Rapidly click next button
    for (let i = 0; i < 10; i++) {
      await nextButton.click();
      await page.waitForTimeout(100);
    }

    const performance = await benchmark.measureAnimationPerformance(
      '[data-testid="carousel"]',
      "stress"
    );

    expect(performance.fps).toBeGreaterThanOrEqual(
      BENCHMARK_CONFIG.thresholds.fps.acceptable
    );
    expect(performance.memoryUsage).toBeLessThan(
      BENCHMARK_CONFIG.thresholds.memory.acceptable
    );

    console.log("Carousel Rapid Navigation:", {
      fps: performance.fps,
      memoryUsage: `${performance.memoryUsage}MB`,
      frameDrops: performance.frameDrops,
    });
  });
});

test.describe("HorizontalScroll Performance Benchmark", () => {
  let benchmark: PerformanceBenchmark;

  test.beforeEach(async ({ page }) => {
    benchmark = new PerformanceBenchmark(page);
    await page.goto("http://localhost:3000/scroll");
  });

  test("scroll animation performance benchmark", async ({ page }) => {
    // Trigger scroll animation
    await page.mouse.wheel(0, 500);

    const performance = await benchmark.measureAnimationPerformance(
      '[data-testid="horizontal-scroll"]',
      "scroll"
    );

    expect(performance.fps).toBeGreaterThanOrEqual(
      BENCHMARK_CONFIG.thresholds.fps.acceptable
    );
    expect(performance.score).not.toBe("poor");

    console.log("HorizontalScroll Performance:", {
      fps: performance.fps,
      score: performance.score,
      avgFrameTime: `${performance.avgFrameTime}ms`,
    });
  });

  test("continuous scrolling stress test", async ({ page }) => {
    // Simulate continuous scrolling
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(50);
    }

    const performance = await benchmark.measureAnimationPerformance(
      '[data-testid="horizontal-scroll"]',
      "stress"
    );

    expect(performance.fps).toBeGreaterThanOrEqual(
      BENCHMARK_CONFIG.thresholds.fps.acceptable
    );
    expect(performance.memoryUsage).toBeLessThan(
      BENCHMARK_CONFIG.thresholds.memory.acceptable
    );

    console.log("HorizontalScroll Continuous Scrolling:", {
      fps: performance.fps,
      memoryUsage: `${performance.memoryUsage}MB`,
      jank: `${performance.jank * 100}%`,
    });
  });
});

test.describe("Three.js Performance Benchmark", () => {
  let benchmark: PerformanceBenchmark;

  test.beforeEach(async ({ page }) => {
    benchmark = new PerformanceBenchmark(page);
    await page.goto("http://localhost:3000/three");
  });

  test("3D animation performance benchmark", async ({ page }) => {
    const canvas = page.locator("canvas");
    await canvas.hover();

    const performance = await benchmark.measureAnimationPerformance(
      "canvas",
      "complex"
    );

    expect(performance.fps).toBeGreaterThanOrEqual(
      BENCHMARK_CONFIG.thresholds.fps.acceptable
    );
    expect(performance.score).not.toBe("poor");

    console.log("Three.js Performance:", {
      fps: performance.fps,
      score: performance.score,
      avgFrameTime: `${performance.avgFrameTime}ms`,
      memoryUsage: `${performance.memoryUsage}MB`,
    });
  });

  test("3D scene stress test", async ({ page }) => {
    const stressTest = await benchmark.runStressTest("canvas", 50);

    expect(stressTest.avgFPS).toBeGreaterThanOrEqual(
      BENCHMARK_CONFIG.thresholds.fps.acceptable
    );
    expect(stressTest.memoryLeaks).toBe(false);

    console.log("Three.js Stress Test:", {
      avgFPS: stressTest.avgFPS,
      minFPS: stressTest.minFPS,
      maxFPS: stressTest.maxFPS,
      avgMemory: `${stressTest.avgMemory}MB`,
      maxMemory: `${stressTest.maxMemory}MB`,
      memoryLeaks: stressTest.memoryLeaks,
      performanceDegradation: `${stressTest.performanceDegradation}%`,
    });
  });
});

test.describe("Cross-Device Performance Benchmark", () => {
  test("desktop performance benchmark", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium");

    const benchmark = new PerformanceBenchmark(page);
    await page.goto("http://localhost:3000/interaction");

    const report = await benchmark.generatePerformanceReport("magnetic-button");

    expect(report.overallScore).toBeGreaterThanOrEqual(80); // Desktop should perform better

    console.log("Desktop Performance Report:", {
      overallScore: report.overallScore,
      animationScore: report.animationMetrics.score,
      memoryUsage: `${report.memoryMetrics.used}MB`,
      loadTime: `${report.loadMetrics.loadTime}ms`,
    });
  });

  test("mobile performance benchmark", async ({ page, browserName }) => {
    test.skip(browserName !== "Mobile Chrome");

    const benchmark = new PerformanceBenchmark(page);
    await page.goto("http://localhost:3000/interaction");

    const report = await benchmark.generatePerformanceReport("magnetic-button");

    expect(report.overallScore).toBeGreaterThanOrEqual(60); // Mobile can be lower but still acceptable

    console.log("Mobile Performance Report:", {
      overallScore: report.overallScore,
      animationScore: report.animationMetrics.score,
      memoryUsage: `${report.memoryMetrics.used}MB`,
      loadTime: `${report.loadMetrics.loadTime}ms`,
    });
  });
});

test.describe("Performance Regression Testing", () => {
  test("performance regression detection", async ({ page }) => {
    const benchmark = new PerformanceBenchmark(page);
    await page.goto("http://localhost:3000");

    // Measure baseline performance
    const loadMetrics = await benchmark.measurePageLoadPerformance();
    const memoryMetrics = await benchmark.measureMemoryUsage();
    const bundleMetrics = await benchmark.measureBundleSize();

    // These thresholds should be updated based on baseline measurements
    expect(loadMetrics.loadTime).toBeLessThan(3000);
    expect(loadMetrics.firstContentfulPaint).toBeLessThan(1500);
    expect(memoryMetrics.used).toBeLessThan(100);
    expect(bundleMetrics.totalJS).toBeLessThan(500000);

    console.log("Performance Regression Baseline:", {
      loadTime: `${loadMetrics.loadTime}ms`,
      firstContentfulPaint: `${loadMetrics.firstContentfulPaint}ms`,
      memoryUsage: `${memoryMetrics.used}MB`,
      bundleSize: `${Math.round(bundleMetrics.totalJS / 1024)}KB`,
    });
  });

  test("animation performance regression", async ({ page }) => {
    const benchmark = new PerformanceBenchmark(page);
    await page.goto("http://localhost:3000/interaction");

    const button = page.locator('[data-testid="magnetic-button"]');
    await button.hover();

    const performance = await benchmark.measureAnimationPerformance(
      '[data-testid="magnetic-button"]',
      "hover"
    );

    // Baseline performance thresholds
    expect(performance.fps).toBeGreaterThanOrEqual(30);
    expect(performance.avgFrameTime).toBeLessThan(33);
    expect(performance.frameDrops).toBeLessThan(10);
    expect(performance.jank).toBeLessThan(0.1);

    console.log("Animation Performance Regression:", {
      fps: performance.fps,
      avgFrameTime: `${performance.avgFrameTime}ms`,
      frameDrops: performance.frameDrops,
      jank: `${performance.jank * 100}%`,
      score: performance.score,
    });
  });
});
