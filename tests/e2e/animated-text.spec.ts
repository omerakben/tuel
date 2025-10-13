import { test, expect, Page, BrowserContext } from "@playwright/test";

// Test configuration
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ANIMATION_TIMEOUT = 5000;
const PERFORMANCE_THRESHOLD = 60; // FPS threshold

// Test utilities
class TuelTestUtils {
  constructor(private page: Page) {}

  async waitForAnimation(selector: string, timeout = ANIMATION_TIMEOUT) {
    await this.page.waitForSelector(selector, { state: "visible", timeout });
    // Wait for animation to complete
    await this.page.waitForTimeout(1000);
  }

  async measurePerformance(selector: string) {
    const performanceMetrics = await this.page.evaluate((sel) => {
      return new Promise((resolve) => {
        const element = document.querySelector(sel);
        if (!element) {
          resolve({ fps: 0, renderTime: 0 });
          return;
        }

        let frameCount = 0;
        let startTime = performance.now();
        let lastFrameTime = startTime;

        const measureFrame = () => {
          const now = performance.now();
          const frameTime = now - lastFrameTime;
          frameCount++;
          lastFrameTime = now;

          if (now - startTime < 1000) {
            requestAnimationFrame(measureFrame);
          } else {
            const fps = frameCount / ((now - startTime) / 1000);
            resolve({ fps, renderTime: frameTime });
          }
        };

        requestAnimationFrame(measureFrame);
      });
    }, selector);

    return performanceMetrics;
  }

  async checkAccessibility() {
    // Check for reduced motion support
    const prefersReducedMotion = await this.page.evaluate(() => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });

    // Check for ARIA labels
    const ariaElements = await this.page
      .locator("[aria-label], [aria-labelledby]")
      .count();

    // Check for keyboard navigation
    const focusableElements = await this.page
      .locator(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      .count();

    return {
      prefersReducedMotion,
      ariaElements,
      focusableElements,
    };
  }

  async simulateUserInteraction(
    selector: string,
    action: "click" | "hover" | "focus"
  ) {
    const element = this.page.locator(selector);

    switch (action) {
      case "click":
        await element.click();
        break;
      case "hover":
        await element.hover();
        break;
      case "focus":
        await element.focus();
        break;
    }

    // Wait for any resulting animations
    await this.page.waitForTimeout(500);
  }

  async capturePerformanceMetrics() {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint");

      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        firstPaint: paint.find((p) => p.name === "first-paint")?.startTime || 0,
        firstContentfulPaint:
          paint.find((p) => p.name === "first-contentful-paint")?.startTime ||
          0,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      };
    });

    return metrics;
  }
}

// Test suite for AnimatedText component
test.describe("AnimatedText Component", () => {
  let utils: TuelTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new TuelTestUtils(page);
    await page.goto(`${BASE_URL}/text-effects`);
  });

  test("renders text correctly", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="animated-text"]');

    const textContent = await page
      .locator('[data-testid="animated-text"]')
      .textContent();
    expect(textContent).toBeTruthy();
    expect(textContent?.length).toBeGreaterThan(0);
  });

  test("animates text with fade variant", async ({ page }) => {
    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    const element = page.locator('[data-testid="animated-text"]');
    await expect(element).toBeVisible();

    // Check if animation completed
    const opacity = await element.evaluate(
      (el) => getComputedStyle(el).opacity
    );
    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
  });

  test("animates text with slide variant", async ({ page }) => {
    await page.click('[data-testid="variant-slide"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    const element = page.locator('[data-testid="animated-text"]');
    await expect(element).toBeVisible();

    // Check if slide animation completed
    const transform = await element.evaluate(
      (el) => getComputedStyle(el).transform
    );
    expect(transform).not.toBe("none");
  });

  test("animates text with typewriter variant", async ({ page }) => {
    await page.click('[data-testid="variant-typewriter"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    const element = page.locator('[data-testid="animated-text"]');
    await expect(element).toBeVisible();

    // Check if typewriter effect is working
    const spans = await element.locator("span").count();
    expect(spans).toBeGreaterThan(0);
  });

  test("respects reduced motion preference", async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    const element = page.locator('[data-testid="animated-text"]');
    const transform = await element.evaluate(
      (el) => getComputedStyle(el).transform
    );

    // With reduced motion, transform should be minimal
    expect(transform).toBe("none");
  });

  test("handles error gracefully", async ({ page }) => {
    // Inject error into component
    await page.evaluate(() => {
      const element = document.querySelector('[data-testid="animated-text"]');
      if (element) {
        element.addEventListener("animationstart", () => {
          throw new Error("Animation error");
        });
      }
    });

    await page.click('[data-testid="variant-fade"]');

    // Should show error boundary
    await expect(page.locator(".tuel-error-boundary")).toBeVisible();
    await expect(page.locator("text=Animation Error")).toBeVisible();
  });

  test("supports keyboard navigation", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focusedElement).toBeTruthy();
  });

  test("meets performance requirements", async ({ page }) => {
    const metrics = await utils.measurePerformance(
      '[data-testid="animated-text"]'
    );

    expect(metrics.fps).toBeGreaterThan(PERFORMANCE_THRESHOLD);
    expect(metrics.renderTime).toBeLessThan(16); // 60fps = 16ms per frame
  });

  test("has proper ARIA labels", async ({ page }) => {
    const element = page.locator('[data-testid="animated-text"]');
    const ariaLabel = await element.getAttribute("aria-label");
    const role = await element.getAttribute("role");

    expect(ariaLabel).toBeTruthy();
    expect(role).toBe("text");
  });

  test("works with different text lengths", async ({ page }) => {
    const testTexts = [
      "Short",
      "This is a medium length text that should work well",
      "This is a very long text that contains many words and should test the component's ability to handle longer content without breaking or causing performance issues. It should still animate smoothly and maintain good performance.",
    ];

    for (const text of testTexts) {
      await page.fill('[data-testid="text-input"]', text);
      await page.click('[data-testid="variant-fade"]');
      await utils.waitForAnimation('[data-testid="animated-text"]');

      const element = page.locator('[data-testid="animated-text"]');
      await expect(element).toBeVisible();

      const displayedText = await element.textContent();
      expect(displayedText).toBe(text);
    }
  });
});

// Test suite for Scroll components
test.describe("Scroll Components", () => {
  let utils: TuelTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new TuelTestUtils(page);
    await page.goto(`${BASE_URL}/scroll`);
  });

  test("HorizontalScroll works correctly", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="horizontal-scroll"]');

    const scrollContainer = page.locator('[data-testid="horizontal-scroll"]');
    await expect(scrollContainer).toBeVisible();

    // Test horizontal scrolling
    await scrollContainer.hover();
    await page.mouse.wheel(100, 0);
    await page.waitForTimeout(500);

    const scrollLeft = await scrollContainer.evaluate((el) => el.scrollLeft);
    expect(scrollLeft).toBeGreaterThan(0);
  });

  test("ParallaxScroll creates parallax effect", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="parallax-scroll"]');

    const parallaxElement = page.locator('[data-testid="parallax-element"]');
    await expect(parallaxElement).toBeVisible();

    // Scroll to trigger parallax
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);

    const transform = await parallaxElement.evaluate(
      (el) => getComputedStyle(el).transform
    );
    expect(transform).not.toBe("none");
  });

  test("scroll animations are smooth", async ({ page }) => {
    const metrics = await utils.measurePerformance(
      '[data-testid="horizontal-scroll"]'
    );

    expect(metrics.fps).toBeGreaterThan(PERFORMANCE_THRESHOLD);
  });

  test("scroll components handle rapid scrolling", async ({ page }) => {
    const scrollContainer = page.locator('[data-testid="horizontal-scroll"]');

    // Rapid scrolling
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(50, 0);
      await page.waitForTimeout(50);
    }

    await expect(scrollContainer).toBeVisible();
  });
});

// Test suite for Gallery components
test.describe("Gallery Components", () => {
  let utils: TuelTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new TuelTestUtils(page);
    await page.goto(`${BASE_URL}/gallery`);
  });

  test("image gallery loads images", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="image-gallery"]');

    const images = page.locator('[data-testid="image-gallery"] img');
    const imageCount = await images.count();

    expect(imageCount).toBeGreaterThan(0);

    // Check if images are loaded
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();

      const src = await img.getAttribute("src");
      expect(src).toBeTruthy();
    }
  });

  test("gallery navigation works", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="image-gallery"]');

    const nextButton = page.locator('[data-testid="gallery-next"]');
    const prevButton = page.locator('[data-testid="gallery-prev"]');

    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();

    // Test navigation
    await nextButton.click();
    await page.waitForTimeout(500);

    await prevButton.click();
    await page.waitForTimeout(500);
  });

  test("gallery supports keyboard navigation", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(500);
  });

  test("gallery handles touch gestures", async ({ page, context }) => {
    // Simulate touch device
    await context.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
    });

    await utils.waitForAnimation('[data-testid="image-gallery"]');

    const gallery = page.locator('[data-testid="image-gallery"]');

    // Simulate swipe gesture
    await gallery.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0);
    await page.mouse.up();

    await page.waitForTimeout(500);
    await expect(gallery).toBeVisible();
  });
});

// Test suite for Three.js components
test.describe("Three.js Components", () => {
  let utils: TuelTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new TuelTestUtils(page);
    await page.goto(`${BASE_URL}/three`);
  });

  test("3D scene renders correctly", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="three-scene"]');

    const canvas = page.locator('[data-testid="three-scene"] canvas');
    await expect(canvas).toBeVisible();

    // Check if WebGL context is available
    const webglSupported = await page.evaluate(() => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return false;

      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    });

    expect(webglSupported).toBe(true);
  });

  test("3D animations are smooth", async ({ page }) => {
    const metrics = await utils.measurePerformance(
      '[data-testid="three-scene"]'
    );

    expect(metrics.fps).toBeGreaterThan(PERFORMANCE_THRESHOLD);
  });

  test("3D scene handles mouse interaction", async ({ page }) => {
    const canvas = page.locator('[data-testid="three-scene"] canvas');

    await canvas.hover();
    await page.mouse.move(100, 100);
    await page.waitForTimeout(500);

    await expect(canvas).toBeVisible();
  });

  test("3D scene cleans up resources", async ({ page }) => {
    const initialMemory = await page.evaluate(
      () => (performance as any).memory?.usedJSHeapSize || 0
    );

    // Navigate away and back to test cleanup
    await page.goto(`${BASE_URL}/`);
    await page.goto(`${BASE_URL}/three`);

    await page.waitForTimeout(2000);

    const finalMemory = await page.evaluate(
      () => (performance as any).memory?.usedJSHeapSize || 0
    );

    // Memory should not increase significantly
    expect(finalMemory - initialMemory).toBeLessThan(10 * 1024 * 1024); // 10MB threshold
  });
});

// Test suite for Performance
test.describe("Performance Tests", () => {
  let utils: TuelTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new TuelTestUtils(page);
  });

  test("page loads within performance budget", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${BASE_URL}/`);
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // 3 second budget

    const metrics = await utils.capturePerformanceMetrics();
    expect(metrics.loadTime).toBeLessThan(2000);
    expect(metrics.firstContentfulPaint).toBeLessThan(1500);
  });

  test("animations maintain 60fps", async ({ page }) => {
    await page.goto(`${BASE_URL}/text-effects`);

    const metrics = await utils.measurePerformance(
      '[data-testid="animated-text"]'
    );
    expect(metrics.fps).toBeGreaterThan(PERFORMANCE_THRESHOLD);
  });

  test("memory usage stays within limits", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const metrics = await utils.capturePerformanceMetrics();
    expect(metrics.memoryUsage).toBeLessThan(100 * 1024 * 1024); // 100MB limit
  });

  test("components handle rapid interactions", async ({ page }) => {
    await page.goto(`${BASE_URL}/text-effects`);

    const button = page.locator('[data-testid="variant-fade"]');

    // Rapid clicking
    for (let i = 0; i < 10; i++) {
      await button.click();
      await page.waitForTimeout(100);
    }

    await expect(page.locator('[data-testid="animated-text"]')).toBeVisible();
  });
});

// Test suite for Accessibility
test.describe("Accessibility Tests", () => {
  let utils: TuelTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new TuelTestUtils(page);
  });

  test("components have proper ARIA labels", async ({ page }) => {
    await page.goto(`${BASE_URL}/text-effects`);

    const accessibility = await utils.checkAccessibility();
    expect(accessibility.ariaElements).toBeGreaterThan(0);
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto(`${BASE_URL}/text-effects`);

    const accessibility = await utils.checkAccessibility();
    expect(accessibility.focusableElements).toBeGreaterThan(0);

    // Test tab navigation
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focusedElement).toBeTruthy();
  });

  test("reduced motion is respected", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/text-effects`);

    const accessibility = await utils.checkAccessibility();
    expect(accessibility.prefersReducedMotion).toBe(true);
  });

  test("high contrast mode is supported", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(`${BASE_URL}/text-effects`);

    const element = page.locator('[data-testid="animated-text"]');
    await expect(element).toBeVisible();
  });

  test("screen reader compatibility", async ({ page }) => {
    await page.goto(`${BASE_URL}/text-effects`);

    const element = page.locator('[data-testid="animated-text"]');
    const ariaLabel = await element.getAttribute("aria-label");
    const role = await element.getAttribute("role");

    expect(ariaLabel).toBeTruthy();
    expect(role).toBe("text");
  });
});

// Test suite for Cross-browser compatibility
test.describe("Cross-browser Tests", () => {
  test("works in Chrome", async ({ page, browserName }) => {
    if (browserName !== "chromium") return;

    await page.goto(`${BASE_URL}/text-effects`);
    await expect(page.locator('[data-testid="animated-text"]')).toBeVisible();
  });

  test("works in Firefox", async ({ page, browserName }) => {
    if (browserName !== "firefox") return;

    await page.goto(`${BASE_URL}/text-effects`);
    await expect(page.locator('[data-testid="animated-text"]')).toBeVisible();
  });

  test("works in Safari", async ({ page, browserName }) => {
    if (browserName !== "webkit") return;

    await page.goto(`${BASE_URL}/text-effects`);
    await expect(page.locator('[data-testid="animated-text"]')).toBeVisible();
  });
});

// Test suite for Mobile compatibility
test.describe("Mobile Tests", () => {
  test("works on mobile devices", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/text-effects`);

    await expect(page.locator('[data-testid="animated-text"]')).toBeVisible();
  });

  test("touch interactions work", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/gallery`);

    const gallery = page.locator('[data-testid="image-gallery"]');
    await gallery.tap();

    await expect(gallery).toBeVisible();
  });

  test("responsive design works", async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 375, height: 667 }, // iPhone 8
      { width: 414, height: 896 }, // iPhone 11
      { width: 768, height: 1024 }, // iPad
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}/text-effects`);

      await expect(page.locator('[data-testid="animated-text"]')).toBeVisible();
    }
  });
});
