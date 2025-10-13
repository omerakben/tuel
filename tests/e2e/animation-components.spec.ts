import { test, expect, Page, BrowserContext } from "@playwright/test";

// Test configuration
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ANIMATION_TIMEOUT = 5000;
const PERFORMANCE_THRESHOLD = 30; // Minimum FPS threshold

// Enhanced test utilities for animation components
class AnimationTestUtils {
  constructor(private page: Page) {}

  async waitForAnimation(selector: string, timeout = ANIMATION_TIMEOUT) {
    await this.page.waitForSelector(selector, { state: "visible", timeout });
    // Wait for animation to complete
    await this.page.waitForTimeout(1000);
  }

  async measureAnimationPerformance(selector: string) {
    const performanceMetrics = await this.page.evaluate((sel) => {
      return new Promise((resolve) => {
        const element = document.querySelector(sel);
        if (!element) {
          resolve({ fps: 0, renderTime: 0, memoryUsage: 0 });
          return;
        }

        let frameCount = 0;
        let startTime = performance.now();
        let lastFrameTime = startTime;
        const frameTimes: number[] = [];

        const measureFrame = () => {
          const now = performance.now();
          const frameTime = now - lastFrameTime;
          frameTimes.push(frameTime);
          frameCount++;
          lastFrameTime = now;

          if (now - startTime < 2000) {
            // Measure for 2 seconds
            requestAnimationFrame(measureFrame);
          } else {
            const fps = frameCount / ((now - startTime) / 1000);
            const avgFrameTime =
              frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
            const memoryUsage =
              (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;

            resolve({
              fps: Math.round(fps),
              renderTime: Math.round(avgFrameTime * 100) / 100,
              memoryUsage: Math.round(memoryUsage * 100) / 100,
            });
          }
        };

        requestAnimationFrame(measureFrame);
      });
    }, selector);

    return performanceMetrics;
  }

  async testKeyboardNavigation(selector: string) {
    const element = this.page.locator(selector);

    // Test tab navigation
    await element.focus();
    await this.page.keyboard.press("Tab");

    // Test arrow keys
    await element.focus();
    await this.page.keyboard.press("ArrowRight");
    await this.page.keyboard.press("ArrowLeft");
    await this.page.keyboard.press("ArrowUp");
    await this.page.keyboard.press("ArrowDown");

    // Test Enter and Space
    await element.focus();
    await this.page.keyboard.press("Enter");
    await this.page.keyboard.press(" ");

    // Test Escape
    await element.focus();
    await this.page.keyboard.press("Escape");
  }

  async testScreenReaderCompatibility(selector: string) {
    const element = this.page.locator(selector);

    // Check ARIA attributes
    const ariaLabel = await element.getAttribute("aria-label");
    const role = await element.getAttribute("role");
    const ariaDescribedby = await element.getAttribute("aria-describedby");

    return {
      hasAriaLabel: !!ariaLabel,
      hasRole: !!role,
      hasAriaDescribedby: !!ariaDescribedby,
      ariaLabel,
      role,
    };
  }

  async testReducedMotion(selector: string) {
    // Enable reduced motion
    await this.page.emulateMedia({ reducedMotion: "reduce" });

    const element = this.page.locator(selector);
    await expect(element).toBeVisible();

    // Check if animations are disabled
    const animationDisabled = await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;

      const computedStyle = window.getComputedStyle(element);
      return (
        computedStyle.animationDuration === "0s" ||
        computedStyle.transitionDuration === "0s"
      );
    }, selector);

    return animationDisabled;
  }

  async testErrorBoundary(selector: string) {
    // Try to trigger an error by manipulating the component
    await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) {
        // Simulate an error by removing required props
        element.setAttribute("data-error", "true");
      }
    }, selector);

    // Check if error boundary is displayed
    const errorBoundary = this.page.locator(".tuel-error-boundary");
    return await errorBoundary.isVisible();
  }

  async simulateUserInteraction(
    selector: string,
    action: "click" | "hover" | "focus" | "drag"
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
      case "drag":
        await element.dragTo(this.page.locator("body"), {
          targetPosition: { x: 100, y: 100 },
        });
        break;
    }

    // Wait for any resulting animations
    await this.page.waitForTimeout(500);
  }
}

// Test suite for MagneticButton component
test.describe("MagneticButton E2E Tests", () => {
  let utils: AnimationTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new AnimationTestUtils(page);
    await page.goto(`${BASE_URL}/interaction`);
  });

  test("renders magnetic button correctly", async ({ page }) => {
    const button = page.locator('[data-testid="magnetic-button"]');
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("role", "button");
  });

  test("handles mouse interactions", async ({ page }) => {
    const button = page.locator('[data-testid="magnetic-button"]');

    // Test hover effect
    await button.hover();
    await page.waitForTimeout(500);

    // Test click with ripple effect
    await button.click();
    await page.waitForTimeout(500);

    // Check if ripple effect was created
    const ripple = page.locator(".absolute.rounded-full.bg-white\\/30");
    await expect(ripple).toBeVisible();
  });

  test("supports keyboard navigation", async ({ page }) => {
    const button = page.locator('[data-testid="magnetic-button"]');

    await button.focus();
    await expect(button).toBeFocused();

    // Test Enter key
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);

    // Test Space key
    await page.keyboard.press(" ");
    await page.waitForTimeout(500);

    // Test Escape key
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  });

  test("has proper accessibility attributes", async ({ page }) => {
    const button = page.locator('[data-testid="magnetic-button"]');

    const accessibility = await utils.testScreenReaderCompatibility(
      '[data-testid="magnetic-button"]'
    );

    expect(accessibility.hasAriaLabel).toBe(true);
    expect(accessibility.hasRole).toBe(true);
    expect(accessibility.role).toBe("button");
  });

  test("respects reduced motion preference", async ({ page }) => {
    const respectsReducedMotion = await utils.testReducedMotion(
      '[data-testid="magnetic-button"]'
    );
    expect(respectsReducedMotion).toBe(true);
  });

  test("has error boundary protection", async ({ page }) => {
    const hasErrorBoundary = await utils.testErrorBoundary(
      '[data-testid="magnetic-button"]'
    );
    expect(hasErrorBoundary).toBe(true);
  });

  test("meets performance requirements", async ({ page }) => {
    const button = page.locator('[data-testid="magnetic-button"]');
    await button.hover();

    const performance = await utils.measureAnimationPerformance(
      '[data-testid="magnetic-button"]'
    );

    expect(performance.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLD);
    expect(performance.renderTime).toBeLessThan(16); // 60fps = 16ms per frame
  });
});

// Test suite for Carousel component
test.describe("Carousel E2E Tests", () => {
  let utils: AnimationTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new AnimationTestUtils(page);
    await page.goto(`${BASE_URL}/ui`);
  });

  test("renders carousel correctly", async ({ page }) => {
    const carousel = page.locator('[data-testid="carousel"]');
    await expect(carousel).toBeVisible();
    await expect(carousel).toHaveAttribute("role", "region");
  });

  test("navigates slides with arrows", async ({ page }) => {
    const prevButton = page.locator('[data-testid="carousel-prev-button"]');
    const nextButton = page.locator('[data-testid="carousel-next-button"]');

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Test next button
    await nextButton.click();
    await page.waitForTimeout(1000);

    // Test prev button
    await prevButton.click();
    await page.waitForTimeout(1000);
  });

  test("navigates slides with indicators", async ({ page }) => {
    const indicators = page.locator('[data-testid^="carousel-indicator-"]');
    const count = await indicators.count();

    expect(count).toBeGreaterThan(0);

    // Click on second indicator
    if (count > 1) {
      await indicators.nth(1).click();
      await page.waitForTimeout(1000);
    }
  });

  test("supports keyboard navigation", async ({ page }) => {
    const carousel = page.locator('[data-testid="carousel"]');
    await carousel.focus();

    // Test arrow keys
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(500);

    // Test Home and End keys
    await page.keyboard.press("Home");
    await page.waitForTimeout(500);

    await page.keyboard.press("End");
    await page.waitForTimeout(500);
  });

  test("supports drag interaction", async ({ page }) => {
    const carousel = page.locator('[data-testid="carousel"]');

    // Test drag to next slide
    await carousel.dragTo(carousel, {
      targetPosition: { x: -100, y: 0 },
    });
    await page.waitForTimeout(1000);

    // Test drag to previous slide
    await carousel.dragTo(carousel, {
      targetPosition: { x: 100, y: 0 },
    });
    await page.waitForTimeout(1000);
  });

  test("has proper accessibility attributes", async ({ page }) => {
    const carousel = page.locator('[data-testid="carousel"]');

    const accessibility = await utils.testScreenReaderCompatibility(
      '[data-testid="carousel"]'
    );

    expect(accessibility.hasAriaLabel).toBe(true);
    expect(accessibility.hasRole).toBe(true);
    expect(accessibility.role).toBe("region");
  });

  test("announces slide changes to screen readers", async ({ page }) => {
    const nextButton = page.locator('[data-testid="carousel-next-button"]');

    // Listen for aria-live announcements
    await nextButton.click();
    await page.waitForTimeout(1000);

    // Check if live region exists
    const liveRegion = page.locator("[aria-live]");
    await expect(liveRegion).toBeAttached();
  });

  test("respects reduced motion preference", async ({ page }) => {
    const respectsReducedMotion = await utils.testReducedMotion(
      '[data-testid="carousel"]'
    );
    expect(respectsReducedMotion).toBe(true);
  });

  test("has error boundary protection", async ({ page }) => {
    const hasErrorBoundary = await utils.testErrorBoundary(
      '[data-testid="carousel"]'
    );
    expect(hasErrorBoundary).toBe(true);
  });

  test("meets performance requirements", async ({ page }) => {
    const nextButton = page.locator('[data-testid="carousel-next-button"]');
    await nextButton.click();

    const performance = await utils.measureAnimationPerformance(
      '[data-testid="carousel"]'
    );

    expect(performance.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLD);
    expect(performance.renderTime).toBeLessThan(16);
  });
});

// Test suite for HorizontalScroll component
test.describe("HorizontalScroll E2E Tests", () => {
  let utils: AnimationTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new AnimationTestUtils(page);
    await page.goto(`${BASE_URL}/scroll`);
  });

  test("renders horizontal scroll correctly", async ({ page }) => {
    const scrollContainer = page.locator('[data-testid="horizontal-scroll"]');
    await expect(scrollContainer).toBeVisible();
  });

  test("scrolls horizontally on page scroll", async ({ page }) => {
    const scrollContainer = page.locator('[data-testid="horizontal-scroll"]');

    // Scroll down to trigger horizontal scroll
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1000);

    // Check if horizontal scroll occurred
    const scrollElement = scrollContainer.locator("> div");
    const transform = await scrollElement.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });

    expect(transform).not.toBe("none");
  });

  test("has error boundary protection", async ({ page }) => {
    const hasErrorBoundary = await utils.testErrorBoundary(
      '[data-testid="horizontal-scroll"]'
    );
    expect(hasErrorBoundary).toBe(true);
  });

  test("meets performance requirements", async ({ page }) => {
    const scrollContainer = page.locator('[data-testid="horizontal-scroll"]');

    // Trigger scroll animation
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1000);

    const performance = await utils.measureAnimationPerformance(
      '[data-testid="horizontal-scroll"]'
    );

    expect(performance.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLD);
    expect(performance.renderTime).toBeLessThan(16);
  });
});

// Test suite for Three.js components
test.describe("Three.js Components E2E Tests", () => {
  let utils: AnimationTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new AnimationTestUtils(page);
    await page.goto(`${BASE_URL}/three`);
  });

  test("renders Three.js canvas correctly", async ({ page }) => {
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
  });

  test("has error boundary protection", async ({ page }) => {
    const hasErrorBoundary = await utils.testErrorBoundary("canvas");
    expect(hasErrorBoundary).toBe(true);
  });

  test("meets performance requirements", async ({ page }) => {
    const canvas = page.locator("canvas");
    await canvas.hover();

    const performance = await utils.measureAnimationPerformance("canvas");

    expect(performance.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLD);
    expect(performance.renderTime).toBeLessThan(16);
  });
});

// Cross-browser compatibility tests
test.describe("Cross-Browser Compatibility", () => {
  test("works on Chrome", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium");

    await page.goto(`${BASE_URL}/interaction`);
    const button = page.locator('[data-testid="magnetic-button"]');
    await expect(button).toBeVisible();
  });

  test("works on Firefox", async ({ page, browserName }) => {
    test.skip(browserName !== "firefox");

    await page.goto(`${BASE_URL}/interaction`);
    const button = page.locator('[data-testid="magnetic-button"]');
    await expect(button).toBeVisible();
  });

  test("works on Safari", async ({ page, browserName }) => {
    test.skip(browserName !== "webkit");

    await page.goto(`${BASE_URL}/interaction`);
    const button = page.locator('[data-testid="magnetic-button"]');
    await expect(button).toBeVisible();
  });
});

// Mobile compatibility tests
test.describe("Mobile Compatibility", () => {
  test("works on mobile Chrome", async ({ page, browserName }) => {
    test.skip(browserName !== "Mobile Chrome");

    await page.goto(`${BASE_URL}/interaction`);
    const button = page.locator('[data-testid="magnetic-button"]');
    await expect(button).toBeVisible();
  });

  test("works on mobile Safari", async ({ page, browserName }) => {
    test.skip(browserName !== "Mobile Safari");

    await page.goto(`${BASE_URL}/interaction`);
    const button = page.locator('[data-testid="magnetic-button"]');
    await expect(button).toBeVisible();
  });
});
