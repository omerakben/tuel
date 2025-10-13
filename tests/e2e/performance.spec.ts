import { test, expect, Page } from "@playwright/test";

// Performance test configuration
const PERFORMANCE_THRESHOLDS = {
  fps: 30, // Minimum FPS
  renderTime: 16, // Maximum render time (60fps)
  memoryUsage: 100, // Maximum memory usage in MB
  loadTime: 3000, // Maximum load time in ms
  animationDuration: 1000, // Maximum animation duration in ms
};

// Performance test utilities
class PerformanceTestUtils {
  constructor(private page: Page) {}

  async measurePageLoadPerformance() {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        firstPaint:
          performance.getEntriesByName("first-paint")[0]?.startTime || 0,
        firstContentfulPaint:
          performance.getEntriesByName("first-contentful-paint")[0]
            ?.startTime || 0,
      };
    });

    return metrics;
  }

  async measureAnimationPerformance(selector: string, duration = 2000) {
    const metrics = await this.page.evaluate(
      (sel, dur) => {
        return new Promise((resolve) => {
          const element = document.querySelector(sel);
          if (!element) {
            resolve({ fps: 0, frameDrops: 0, memoryUsage: 0 });
            return;
          }

          let frameCount = 0;
          let droppedFrames = 0;
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

            lastFrameTime = now;

            if (now - startTime < dur) {
              requestAnimationFrame(measureFrame);
            } else {
              const fps = frameCount / ((now - startTime) / 1000);
              const avgFrameTime =
                frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
              const memoryUsage =
                (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;

              resolve({
                fps: Math.round(fps),
                avgFrameTime: Math.round(avgFrameTime * 100) / 100,
                frameDrops: droppedFrames,
                memoryUsage: Math.round(memoryUsage * 100) / 100,
                totalFrames: frameCount,
              });
            }
          };

          requestAnimationFrame(measureFrame);
        });
      },
      selector,
      duration
    );

    return metrics;
  }

  async measureMemoryUsage() {
    const memoryInfo = await this.page.evaluate(() => {
      const memory = (performance as any).memory;
      if (!memory) return null;

      return {
        used: Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
        total: Math.round((memory.totalJSHeapSize / 1024 / 1024) * 100) / 100,
        limit: Math.round((memory.jsHeapSizeLimit / 1024 / 1024) * 100) / 100,
      };
    });

    return memoryInfo;
  }

  async measureBundleSize() {
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
      };
    });

    return bundleInfo;
  }

  async testPerformanceBudget(component: string) {
    const budgets = {
      "magnetic-button": { maxMemory: 50, maxFPS: 30 },
      carousel: { maxMemory: 80, maxFPS: 30 },
      "horizontal-scroll": { maxMemory: 60, maxFPS: 30 },
      "three-canvas": { maxMemory: 100, maxFPS: 30 },
    };

    return budgets[component] || { maxMemory: 50, maxFPS: 30 };
  }

  async simulateHighLoad(selector: string, iterations = 10) {
    for (let i = 0; i < iterations; i++) {
      const element = this.page.locator(selector);
      await element.hover();
      await element.click();
      await this.page.waitForTimeout(100);
    }
  }
}

// Performance test suite
test.describe("Performance Tests", () => {
  let utils: PerformanceTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new PerformanceTestUtils(page);
  });

  test("page load performance meets requirements", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const loadMetrics = await utils.measurePageLoadPerformance();

    expect(loadMetrics.loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.loadTime);
    expect(loadMetrics.domContentLoaded).toBeLessThan(2000);
    expect(loadMetrics.firstContentfulPaint).toBeLessThan(1500);
  });

  test("bundle size is optimized", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const bundleInfo = await utils.measureBundleSize();

    // Check that total JS bundle size is reasonable
    expect(bundleInfo.totalJS).toBeLessThan(500000); // 500KB
    expect(bundleInfo.jsCount).toBeLessThan(20); // Not too many JS files
  });

  test("memory usage is within limits", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const memoryInfo = await utils.measureMemoryUsage();

    if (memoryInfo) {
      expect(memoryInfo.used).toBeLessThan(PERFORMANCE_THRESHOLDS.memoryUsage);
      expect(memoryInfo.total).toBeLessThan(
        PERFORMANCE_THRESHOLDS.memoryUsage * 1.5
      );
    }
  });
});

// Component-specific performance tests
test.describe("MagneticButton Performance", () => {
  let utils: PerformanceTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new PerformanceTestUtils(page);
    await page.goto("http://localhost:3000/interaction");
  });

  test("meets FPS requirements", async ({ page }) => {
    const button = page.locator('[data-testid="magnetic-button"]');
    await button.hover();

    const performance = await utils.measureAnimationPerformance(
      '[data-testid="magnetic-button"]'
    );

    expect(performance.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.fps);
    expect(performance.avgFrameTime).toBeLessThan(
      PERFORMANCE_THRESHOLDS.renderTime
    );
  });

  test("handles high load gracefully", async ({ page }) => {
    const initialMemory = await utils.measureMemoryUsage();

    await utils.simulateHighLoad('[data-testid="magnetic-button"]', 20);

    const finalMemory = await utils.measureMemoryUsage();

    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory.used - initialMemory.used;
      expect(memoryIncrease).toBeLessThan(20); // Should not increase by more than 20MB
    }
  });

  test("has minimal frame drops", async ({ page }) => {
    const button = page.locator('[data-testid="magnetic-button"]');
    await button.hover();

    const performance = await utils.measureAnimationPerformance(
      '[data-testid="magnetic-button"]'
    );

    const dropRate = performance.frameDrops / performance.totalFrames;
    expect(dropRate).toBeLessThan(0.1); // Less than 10% frame drops
  });
});

test.describe("Carousel Performance", () => {
  let utils: PerformanceTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new PerformanceTestUtils(page);
    await page.goto("http://localhost:3000/ui");
  });

  test("slide transitions are smooth", async ({ page }) => {
    const nextButton = page.locator('[data-testid="carousel-next-button"]');
    await nextButton.click();

    const performance = await utils.measureAnimationPerformance(
      '[data-testid="carousel"]'
    );

    expect(performance.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.fps);
    expect(performance.avgFrameTime).toBeLessThan(
      PERFORMANCE_THRESHOLDS.renderTime
    );
  });

  test("handles rapid navigation", async ({ page }) => {
    const nextButton = page.locator('[data-testid="carousel-next-button"]');

    // Rapidly click next button
    for (let i = 0; i < 5; i++) {
      await nextButton.click();
      await page.waitForTimeout(100);
    }

    const performance = await utils.measureAnimationPerformance(
      '[data-testid="carousel"]'
    );

    expect(performance.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.fps);
  });
});

test.describe("HorizontalScroll Performance", () => {
  let utils: PerformanceTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new PerformanceTestUtils(page);
    await page.goto("http://localhost:3000/scroll");
  });

  test("scroll animations are smooth", async ({ page }) => {
    // Trigger scroll animation
    await page.mouse.wheel(0, 500);

    const performance = await utils.measureAnimationPerformance(
      '[data-testid="horizontal-scroll"]'
    );

    expect(performance.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.fps);
    expect(performance.avgFrameTime).toBeLessThan(
      PERFORMANCE_THRESHOLDS.renderTime
    );
  });

  test("handles continuous scrolling", async ({ page }) => {
    // Simulate continuous scrolling
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(50);
    }

    const performance = await utils.measureAnimationPerformance(
      '[data-testid="horizontal-scroll"]'
    );

    expect(performance.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.fps);
  });
});

test.describe("Three.js Performance", () => {
  let utils: PerformanceTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new PerformanceTestUtils(page);
    await page.goto("http://localhost:3000/three");
  });

  test("3D animations are performant", async ({ page }) => {
    const canvas = page.locator("canvas");
    await canvas.hover();

    const performance = await utils.measureAnimationPerformance("canvas");

    expect(performance.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.fps);
    expect(performance.avgFrameTime).toBeLessThan(
      PERFORMANCE_THRESHOLDS.renderTime
    );
  });

  test("memory usage is controlled", async ({ page }) => {
    const initialMemory = await utils.measureMemoryUsage();

    // Interact with 3D scene
    const canvas = page.locator("canvas");
    await canvas.hover();
    await page.waitForTimeout(2000);

    const finalMemory = await utils.measureMemoryUsage();

    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory.used - initialMemory.used;
      expect(memoryIncrease).toBeLessThan(50); // Should not increase by more than 50MB
    }
  });
});

// Performance regression tests
test.describe("Performance Regression Tests", () => {
  let utils: PerformanceTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new PerformanceTestUtils(page);
  });

  test("overall performance has not regressed", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const loadMetrics = await utils.measurePageLoadPerformance();
    const memoryInfo = await utils.measureMemoryUsage();

    // These thresholds should be updated based on baseline measurements
    expect(loadMetrics.loadTime).toBeLessThan(3000);
    expect(loadMetrics.firstContentfulPaint).toBeLessThan(1500);

    if (memoryInfo) {
      expect(memoryInfo.used).toBeLessThan(100);
    }
  });

  test("animation performance has not regressed", async ({ page }) => {
    await page.goto("http://localhost:3000/interaction");

    const button = page.locator('[data-testid="magnetic-button"]');
    await button.hover();

    const performance = await utils.measureAnimationPerformance(
      '[data-testid="magnetic-button"]'
    );

    // Baseline performance thresholds
    expect(performance.fps).toBeGreaterThanOrEqual(30);
    expect(performance.avgFrameTime).toBeLessThan(16);
    expect(performance.frameDrops).toBeLessThan(5);
  });
});

// Performance monitoring tests
test.describe("Performance Monitoring", () => {
  let utils: PerformanceTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new PerformanceTestUtils(page);
  });

  test("performance monitoring is active", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Check if performance monitoring is enabled
    const monitoringActive = await page.evaluate(() => {
      return (
        typeof window.performance !== "undefined" &&
        typeof window.performance.now === "function"
      );
    });

    expect(monitoringActive).toBe(true);
  });

  test("performance alerts are triggered", async ({ page }) => {
    // Listen for console warnings about performance
    const warnings: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "warning" && msg.text().includes("TUEL Performance")) {
        warnings.push(msg.text());
      }
    });

    await page.goto("http://localhost:3000/interaction");

    // Trigger potentially slow operation
    const button = page.locator('[data-testid="magnetic-button"]');
    await utils.simulateHighLoad('[data-testid="magnetic-button"]', 50);

    // Check if performance warnings were logged
    expect(warnings.length).toBeGreaterThanOrEqual(0);
  });
});
